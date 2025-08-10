import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

// Middleware: If a folder is moved to trash, recursively mark all children as trash
fileFolderSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update?.isTrash === true) {
    const folder = await this.model.findOne(this.getQuery());
    if (folder?.isFolder) {
      await cascadeTrash(folder._id, this.model);
    }
  }
  next();
});

async function cascadeTrash(parentId, Model) {
  const children = await Model.find({ parentId });
  for (const child of children) {
    if (!child.isTrash) {
      child.isTrash = true;
      child.trashedAt = new Date();
      await child.save();
    }
    if (child.isFolder) {
      await cascadeTrash(child._id, Model);
    }
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
    await this.deleteOne({ _id: item._id });
    // Optionally: Also delete from Cloudinary if it's a file
    // if (!item.isFolder && item.cloudinaryAssetId) { ... }
  }
};

const FileFolderModel = mongoose.model("fileFolder", fileFolderSchema);
export default FileFolderModel;
