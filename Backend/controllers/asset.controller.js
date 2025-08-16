import fs from "fs";
import { uploadToCloudinary } from "../libs/cloudinaryHelper.js";
import CloudinaryAssetModel from "../models/cloudinaryAsset.model.js";
import FileFolderModel from "../models/fileFolder.model.js";
import { cloudinary } from "../configs/cloudinary.js";
import mongoose from "mongoose";

const fileUpload = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let publicId; // to clean up Cloudinary in catch
  try {
    //check if file is missing in req object
    if (!req.file) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "File is required.",
        errorCode: "FILE_REQUIRED",
      });
    }

    // Destructure the request
    const { parentId } = req.body;
    const { originalname: fileName, mimetype, size } = req.file;
    const userId = req.user._id;

    // If parentId is provided, check it exists or not
    let parentFolder = null;
    if (parentId) {
      parentFolder = await FileFolderModel.findOne({
        _id: parentId,
        userId,
        isFolder: true,
        isTrash: false,
      }).session(session);

      if (!parentFolder) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: "Parent folder not found",
          errorCode: "PARENT_ID_NOT_FOUND",
        });
      }
    }

    // Check file exist of same new name and update newName accordingly
    let nameConflict = await FileFolderModel.findOne({
      name: fileName,
      parentId: parentId || null,
      userId,
      isFolder: false,
      isTrash: false,
    }).session(session);
    let newName = fileName.trim();
    if (nameConflict) {
      let baseName = newName;
      let counter = 1;
      while (
        await FileFolderModel.findOne({
          name: `${baseName} (${counter})`,
          parentId: parentId || null,
          userId,
          isFolder: false,
          isTrash: false,
        }).session(session)
      ) {
        counter++;
      }
      newName = `${baseName} (${counter})`;
    }

    //upload to cloudinary
    const {
      url,
      publicId: uploadedPublicId,
      format, //jpg
      resource_type, //image
      downloadUrl,
    } = await uploadToCloudinary(req.file.path);
    publicId = uploadedPublicId;

    // Multer: Delete file from server storage
    try {
      fs.unlinkSync(req.file.path);
    } catch (unlinkErr) {
      console.warn("Failed to delete temp file:", unlinkErr.message);
    }

    //store the file url and public id and other metadata in database
    const [uploadedCloudinaryAsset] = await CloudinaryAssetModel.create(
      [
        {
          url,
          publicId,
          format,
          resource_type,
          mimetype,
          size,
          downloadUrl,
        },
      ],
      { session }
    );

    // Create FileFolder entry in database and connect it with corresponding CloudinaryAsset
    const [newFile] = await FileFolderModel.create(
      [
        {
          name: newName,
          parentId: parentId || null,
          userId,
          isFolder: false,
          cloudinaryAssetId: uploadedCloudinaryAsset._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: newFile,
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();

    //Cleanup Cloudinary asset if it was uploaded but DB failed
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cleanupErr) {
        console.error("Cloudinary cleanup failed:", cleanupErr.message);
      }
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong",
      errorCode: "UPLOAD_FAILED",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const folderCreate = async (req, res, next) => {
  try {
    // Destructure the request body
    const { name, parentId } = req.body;
    const userId = req.user._id;

    // If parentId is provided, check it exists or not
    let parentFolder = null;
    if (parentId) {
      parentFolder = await FileFolderModel.findOne({
        _id: parentId,
        userId,
        isFolder: true,
        isTrash: false,
      });

      if (!parentFolder) {
        return res.status(404).json({
          success: false,
          message: "Parent folder not found",
          errorCode: "PARENT_ID_NOT_FOUND",
        });
      }
    }

    // Check folder exist of same new name and update newName accordingly
    let nameConflict = await FileFolderModel.findOne({
      name: name.trim(),
      parentId: parentId || null,
      userId,
      isFolder: true,
      isTrash: false,
    });
    let newName = name.trim();
    if (nameConflict) {
      let baseName = newName;
      let counter = 1;
      while (
        await FileFolderModel.findOne({
          name: `${baseName} (${counter})`,
          parentId: parentId || null,
          userId,
          isFolder: true,
          isTrash: false,
        })
      ) {
        counter++;
      }
      newName = `${baseName} (${counter})`;
    }

    // Create new folder
    const newFolder = await FileFolderModel.create({
      name: newName,
      parentId: parentId || null,
      userId,
      isFolder: true,
    });

    // Respond with the created user and token
    res.status(201).json({
      success: true,
      message: "Folder created successfully",
      data: newFolder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create folder",
      errorCode: "FOLDER_CREATE_FAILED",
      error: error.message,
    });
  }
};

export const toggleStar = async (req, res, next) => {
  try {
    // Destructure request
    const userId = req.user.id;
    const fileFolderId = req.params.fileFolderId;

    // Check fileFolder exist
    const fileFolderToToggle = await FileFolderModel.findOne({
      _id: fileFolderId,
      userId,
    });
    if (!fileFolderToToggle)
      return res.status(404).json({
        success: false,
        message: "File or folder not found",
        errorCode: "ITEM_NOT_FOUND",
      });

    fileFolderToToggle.isStarred = !fileFolderToToggle.isStarred;
    await fileFolderToToggle.save();

    res.json({
      success: true,
      message: "Star status updated successfully",
      data: fileFolderToToggle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update star status",
      errorCode: "STAR_TOGGLE_FAILED",
      error: error.message,
    });
  }
};

export const toggleTrash = async (req, res, next) => {
  try {
    // Destructure request
    const userId = req.user.id;
    const fileFolderId = req.params.fileFolderId;

    // Check fileFolder exist
    const fileFolderToToggle = await FileFolderModel.findOne({
      _id: fileFolderId,
      userId,
    });
    if (!fileFolderToToggle) {
      return res.status(404).json({
        success: false,
        message: "File or folder not found",
        errorCode: "ITEM_NOT_FOUND",
      });
    }

    fileFolderToToggle.isTrash = !fileFolderToToggle.isTrash;
    await fileFolderToToggle.save();

    res.json({
      success: true,
      message: "Trash status updated successfully",
      data: fileFolderToToggle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update trash status",
      errorCode: "TRASH_TOGGLE_FAILED",
      error: error.message,
    });
  }
};

export const changeName = async (req, res, next) => {
  try {
    // Destructure request
    const { name } = req.body;
    const userId = req.user.id;
    const fileFolderId = req.params.fileFolderId;

    // Check fileFolder exist
    const fileFolderToChange = await FileFolderModel.findOne({
      _id: fileFolderId,
      userId,
    });
    if (!fileFolderToChange) {
      return res.status(404).json({
        success: false,
        message: "File or folder not found",
        errorCode: "ITEM_NOT_FOUND",
      });
    }
    if (fileFolderToChange.name === name) {
      return res.status(404).json({
        success: false,
        message: "Same name provided",
        errorCode: "NAME_UNCHANGED",
      });
    }

    // Check fileFolder exist of same new name and update newName accordingly
    let nameConflict = await FileFolderModel.findOne({
      name,
      parentId: fileFolderToChange.parentId || null,
      isFolder: fileFolderToChange.isFolder,
      userId,
      isTrash: false,
    });
    let newName = name.trim();
    if (nameConflict) {
      let baseName = newName;
      let counter = 1;
      while (
        await FileFolderModel.findOne({
          name: `${baseName} (${counter})`,
          parentId: fileFolderToChange.parentId || null,
          isFolder: fileFolderToChange.isFolder,
          userId,
          isTrash: false,
        })
      ) {
        counter++;
      }
      newName = `${baseName} (${counter})`;
    }

    // save new name to db
    fileFolderToChange.name = newName;
    await fileFolderToChange.save();

    res.json({
      success: true,
      message: "Name changed successfully",
      data: fileFolderToChange,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to rename item",
      errorCode: "RENAME_FAILED",
      error: error.message,
    });
  }
};

export const getFilesFolders = async (req, res, next) => {
  try {
    // Destructure request
    const userId = req.user.id;
    const parentId = req.query.parentId || null;

    // If parentId is provided, check it exists or not
    let parentFolder = null;
    if (parentId) {
      parentFolder = await FileFolderModel.findOne({
        _id: parentId,
        userId,
        isFolder: true,
        isTrash: false,
      });

      if (!parentFolder) {
        return res.status(404).json({
          success: false,
          message: "Parent folder not found",
          errorCode: "PARENT_ID_NOT_FOUND",
        });
      }
    }

    const items = await FileFolderModel.find({
      userId,
      parentId,
      isTrash: false,
    })
      .sort({ isFolder: -1, name: 1 }) // folders first, then files
      .populate({
        path: "cloudinaryAssetId",
        select: "-publicId",
      });

    res.json({
      success: true,
      message: "Files and folders fetched successfully",
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch files and folders",
      errorCode: "FETCH_FAILED",
      error: error.message,
    });
  }
};

export const relocateFilesFolders = async (req, res, next) => {
  try {
    // Destructure request
    const userId = req.user.id;
    const { newParentId } = req.body;
    const fileFolderId = req.params.fileFolderId;

    // Check fileFolder exist
    const fileFolderToRelocate = await FileFolderModel.findOne({
      _id: fileFolderId,
      userId,
      isTrash: false,
    });
    if (!fileFolderToRelocate) {
      return res.status(404).json({
        success: false,
        message: "File or folder not found",
        errorCode: "ITEM_NOT_FOUND",
      });
    }

    // If parentId is provided, check it exists or not
    let newParentFolder = null;
    if (newParentId) {
      newParentFolder = await FileFolderModel.findOne({
        _id: newParentId,
        userId,
        isFolder: true,
        isTrash: false,
      });

      if (!newParentFolder) {
        return res.status(404).json({
          success: false,
          message: "New parent folder not found",
          errorCode: "NEW_PARENT_NOT_FOUND",
        });
      }
    }

    // Check if no relocation to new directory
    if (fileFolderToRelocate.parentId === newParentId) {
      return res.status(400).json({
        success: false,
        message: "Same newParentId provided",
        errorCode: "SAME_PARENT_ID",
      });
    }

    // Check fileFolder exist of same new name and update newName accordingly
    let nameConflict = await FileFolderModel.findOne({
      name: fileFolderToRelocate.name,
      parentId: newParentId,
      isFolder: fileFolderToRelocate.isFolder,
      userId,
      isTrash: false,
    });
    let newName = fileFolderToRelocate.name.trim();
    if (nameConflict) {
      let baseName = newName;
      let counter = 1;
      while (
        await FileFolderModel.findOne({
          name: `${baseName} (${counter})`,
          parentId: newParentId,
          isFolder: fileFolderToRelocate.isFolder,
          userId,
          isTrash: false,
        })
      ) {
        counter++;
      }
      newName = `${baseName} (${counter})`;
    }

    // save new name to db
    fileFolderToRelocate.name = newName;
    fileFolderToRelocate.parentId = newParentId;

    await fileFolderToRelocate.save();

    res.json({
      success: true,
      message: "Item relocated successfully",
      data: fileFolderToRelocate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to relocate item",
      errorCode: "RELOCATE_FAILED",
      error: error.message,
    });
  }
};

export const getFavFilesFolders = async (req, res, next) => {
  try {
    // Destructure request
    const userId = req.user.id;

    const items = await FileFolderModel.find({
      userId,
      isStarred: true,
      isTrash: false,
    })
      .sort({ isFolder: -1, name: 1 }) // folders first, then files
      .populate({
        path: "cloudinaryAssetId",
        select: "-publicId",
      });

    res.json({
      success: true,
      message: "Fav Files and folders fetched successfully",
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch fav files and folders",
      errorCode: "FETCH_FAILED",
      error: error.message,
    });
  }
};

export const getTrashFilesFolders = async (req, res, next) => {
  try {
    // Destructure request
    const userId = req.user.id;

    const items = await FileFolderModel.find({
      userId,
      isTrash: true,
    })
      .sort({ isFolder: -1, name: 1 }) // folders first, then files
      .populate({
        path: "cloudinaryAssetId",
        select: "-publicId",
      });

    res.json({
      success: true,
      message: "Trash Files and folders fetched successfully",
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch trash files and folders",
      errorCode: "FETCH_FAILED",
      error: error.message,
    });
  }
};

export const getRecentFiles = async (req, res, next) => {
  try {
    // Destructure request
    const userId = req.user.id;

    const items = await FileFolderModel.find({
      userId,
      isTrash: false,
      isFolder: false,
    })
      .sort({ updatedAt: -1 }) // latest first
      .limit(5)
      .populate({
        path: "cloudinaryAssetId",
        select: "-publicId",
      });

    res.json({
      success: true,
      message: "Recent Files fetched successfully",
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent files",
      errorCode: "FETCH_FAILED",
      error: error.message,
    });
  }
};

export default {
  fileUpload,
  folderCreate,
  toggleStar,
  toggleTrash,
  changeName,
  getFilesFolders,
  relocateFilesFolders,
  getFavFilesFolders,
  getTrashFilesFolders,
  getRecentFiles,
};
