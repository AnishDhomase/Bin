import fs from "fs";
import { uploadToCloudinary } from "../libs/cloudinaryHelper.js";
import CloudinaryAssetModel from "../models/cloudinaryAsset.model.js";
import FileFolderModel from "../models/fileFolder.model.js";

const fileUpload = async (req, res) => {
  try {
    //check if file is missing in req object
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required.",
        data: null,
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
      });

      if (!parentFolder) {
        return res.status(404).json({ message: "Parent folder not found" });
      }
    }

    // Check for duplicate file name in the same parent
    const existingFile = await FileFolderModel.findOne({
      name: fileName,
      parentId: parentId || null,
      userId,
      isFolder: false,
      isTrash: false,
    });
    if (existingFile) {
      return res.status(400).json({
        message: `A file with the name ${fileName} already exists in this directory`,
      });
    }

    //upload to cloudinary
    const {
      url,
      publicId,
      format, //jpg
      resource_type, //image
    } = await uploadToCloudinary(req.file.path);

    // Multer: Delete file from server storage
    fs.unlinkSync(req.file.path);

    //store the file url and public id and other metadata in database
    const uploadedCloudinaryAsset = await CloudinaryAssetModel.create({
      url,
      publicId,
      format,
      resource_type,
      mimetype,
      size,
    });

    // Create FileFolder entry in database and connect it with corresponding CloudinaryAsset
    const newFile = await FileFolderModel.create({
      name: fileName,
      parentId: parentId || null,
      userId,
      isFolder: false,
      cloudinaryAssetId: uploadedCloudinaryAsset._id,
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while uploading file",
      error,
    });
  }
};

// const deleteFileController = async (req, res) => {
//   try {
//     const idOfFileToBeDeleted = req.params.id;

//     const fileToBeDeleted = await CloudinaryAssetModel.findById(
//       idOfFileToBeDeleted
//     );

//     if (!fileToBeDeleted) {
//       return res.status(404).json({
//         success: false,
//         message: "File not found! Please provide a valid file id",
//         data: null,
//       });
//     }

//     //delete this image first from your cloudinary stroage
//     await cloudinary.uploader.destroy(image.publicId);

//     //delete this image from mongodb database
//     await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

//     res.status(200).json({
//       success: true,
//       message: "Image deleted successfully",
//       data: image,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error while deleting image! Please try again",
//       data: null,
//     });
//   }
// };

export const folderCreate = async (req, res, next) => {
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
      return res
        .status(404)
        .json({ message: "Parent folder not found or not accessible" });
    }
  }

  // Check for duplicate folder name in the same parent
  const existingFolder = await FileFolderModel.findOne({
    name: name.trim(),
    parentId: parentId || null,
    userId,
    isFolder: true,
    isTrash: false,
  });
  if (existingFolder) {
    return res.status(400).json({
      message: `A folder with the name ${name} already exists in this directory`,
    });
  }

  // Create new folder
  const newFolder = await FileFolderModel.create({
    name,
    parentId: parentId || null,
    userId,
    isFolder: true,
  });

  // Respond with the created user and token
  res.status(201).json({ newFolder });
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
      return res
        .status(404)
        .json({ success: false, message: "Provide valid file or folder id" });

    fileFolderToToggle.isStarred = !fileFolderToToggle.isStarred;
    await fileFolderToToggle.save();

    res.json({ success: true, data: fileFolderToToggle });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error occured while starring the file or folder",
      error: err,
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
    if (!fileFolderToToggle)
      return res
        .status(404)
        .json({ success: false, message: "Provide valid file or folder id" });

    fileFolderToToggle.isTrash = !fileFolderToToggle.isTrash;
    await fileFolderToToggle.save();

    res.json({ success: true, data: fileFolderToToggle });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error occured while trashing the file or folder",
      error: err,
    });
  }
};

export default {
  fileUpload,
  folderCreate,
  toggleStar,
  toggleTrash,
  // fetchImagesController,
  // deleteImageController,
};
