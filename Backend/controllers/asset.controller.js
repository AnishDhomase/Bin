import fs from "fs";
import { uploadToCloudinary } from "../libs/cloudinaryHelper.js";
import CloudinaryAssetModel from "../models/cloudinaryAsset.model.js";
import FileFolderModel from "../models/fileFolder.model.js";

const fileUpload = async (req, res) => {
  try {
    console.log(req?.file, req?.files);
    //check if file is missing in req object
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please upload an image",
        data: null,
      });
    }
    // if (req.files && req.files.length > 1) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Only one file can be uploaded at a time.",
    //     data: null,
    //   });
    // }

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    // if (req.file.size > MAX_FILE_SIZE) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "File size exceeds 2MB limit.",
    //     data: null,
    //   });
    // }

    // Validate file type (image or document)
    // const allowedImageTypes = [
    //   "image/jpeg",
    //   "image/png",
    //   "image/jpg",
    //   "image/gif",
    // ];
    // const allowedDocTypes = [
    //   "application/pdf",
    //   "application/msword",
    //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // ];

    // if (
    //   ![...allowedImageTypes, ...allowedDocTypes].includes(req.file.mimetype)
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid file type. Only images and documents are allowed.",
    //     data: null,
    //   });
    // }

    //upload to cloudinary

    const {
      url,
      publicId,
      format, //jpg
      resource_type, //image
      original_filename, //fileName
    } = await uploadToCloudinary(req.file.path);

    //store the file url and public id in database
    const newlyUploadedFile = CloudinaryAssetModel.create({
      url,
      publicId,
    });

    // Delete file from server storage
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: newlyUploadedFile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while uploading image! Please try again",
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

export default {
  fileUpload,
  folderCreate,
  // fetchImagesController,
  // deleteImageController,
};
