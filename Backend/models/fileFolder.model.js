import mongoose from "mongoose";
import { cloudinary } from "../configs/cloudinary.js";
import CloudinaryAssetModel from "./cloudinaryAsset.model.js";

const fileFolderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // For file only
    cloudinaryAssetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CloudinaryAsset",
      default: null,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fileFolder",
      default: null,
    },

    isFolder: {
      type: Boolean,
      required: true,
    },

    isStarred: {
      type: Boolean,
      default: false,
    },

    isTrash: {
      type: Boolean,
      default: false,
    },

    trashedAt: {
      type: Date,
      default: null,
    },

    trashedByParent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware: If a folder is toogle from trash, recursively toggle its children from trash
fileFolderSchema.pre("save", async function (next) {
  if (!this.isModified("isTrash")) return next();

  // get options to save or not
  const saveOptions = this.$__.saveOptions || {};

  // Moving folder to trash
  if (this.isTrash) {
    this.trashedAt = new Date();
    if (!saveOptions.skipParentFlag) this.trashedByParent = false; // only root manual trash
    if (this.isFolder) await cascadeTrash(this._id, this.constructor);
  } else {
    // Restoring folder from trash
    await restoreSingle(this, this.constructor, this.userId, true);
    if (this.isFolder)
      await cascadeRestore(this._id, this.constructor, this.userId);
  }

  next();
});

async function cascadeTrash(parentId, Model) {
  const children = await Model.find({ parentId });
  for (const child of children) {
    if (!child.isTrash) {
      child.isTrash = true;
      child.trashedAt = new Date();
      child.trashedByParent = true; // mark as auto-trashed
      await child.save({ skipParentFlag: true });
    }
    if (child.isFolder) {
      await cascadeTrash(child._id, Model);
    }
  }
}

async function cascadeRestore(parentId, Model, userId) {
  const children = await Model.find({ parentId, trashedByParent: true });

  for (const child of children) {
    await restoreSingle(child, Model, userId);
    if (child.isFolder) {
      await cascadeRestore(child._id, Model, userId);
    }
  }
}

async function restoreSingle(doc, Model, userId, skipSave = false) {
  // Check if parent exists
  if (doc.parentId) {
    const parentExists = await Model.exists({
      _id: doc.parentId,
      userId,
      isTrash: false,
    });
    if (!parentExists) {
      doc.parentId = null; // orphan recovery
    }
  }

  // Check for duplicates in parent
  let nameConflict = await Model.exists({
    name: doc.name,
    isFolder: doc.isFolder,
    parentId: doc.parentId || null,
    userId,
    isTrash: false,
  });
  if (nameConflict) {
    let baseName = doc.name;
    let counter = 1;

    // Keep appending (n) until unique
    while (
      await Model.exists({
        name: `${baseName} (${counter})`,
        isFolder: doc.isFolder,
        parentId: doc.parentId || null,
        userId,
        isTrash: false,
      })
    ) {
      counter++;
    }
    doc.name = `${baseName} (${counter})`;
  }

  // Recover item
  doc.isTrash = false;
  doc.trashedAt = null;
  doc.trashedByParent = false;

  if (!skipSave) {
    await doc.save();
  }
}

// Static: Auto-delete trashed files older than 15 days
const AUTO_DELETE_TRASH_TIME = 15 * 24 * 60 * 60 * 1000; // 15 days

fileFolderSchema.statics.deleteOldTrash = async function () {
  const cutoffDate = new Date(Date.now() - AUTO_DELETE_TRASH_TIME);

  const oldTrash = await this.find({
    isTrash: true,
    trashedAt: { $lte: cutoffDate },
  });

  for (const item of oldTrash) {
    try {
      // Delete the corresponding CloudinaryAsset if it's a file
      if (!item.isFolder) {
        //delete first from your cloudinary stroage
        const cloudinaryAssetToDelete = await CloudinaryAssetModel.findById(
          item.cloudinaryAssetId
        ).select("+publicId");
        await cloudinary.uploader.destroy(cloudinaryAssetToDelete.publicId);

        //delete from database
        await CloudinaryAssetModel.findByIdAndDelete(
          cloudinaryAssetToDelete._id
        );
      }

      // Delete from fileFolder
      await this.deleteOne({ _id: item._id });
    } catch (err) {
      console.error(
        `Routine delete: Error deleting trash ${
          item.isFolder ? "folder" : "file"
        } ${item._id}: ${item.name}`,
        err
      );
    }
  }
};

const FileFolderModel = mongoose.model("fileFolder", fileFolderSchema);
export default FileFolderModel;

// Cron job: Run once every 24 hours (24 * 60 * 60 * 1000 ms)
export const CRON_JOB_AUTO_DELETE_TRASH_TIME = 24 * 60 * 60 * 1000;
export const cronJobForAutoDeletionFromRecycleBinParmanently = async () => {
  console.log("Running daily trash cleanup...");
  try {
    await FileFolderModel.deleteOldTrash();
    console.log("Trash cleanup completed");
  } catch (err) {
    console.error("Trash cleanup error:", err);
  }
};
