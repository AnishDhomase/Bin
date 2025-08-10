import fs from "fs";
import { uploadToCloudinary } from "../libs/cloudinaryHelper.js";
import CloudinaryAssetModel from "../models/cloudinaryAsset.model.js";

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
    if (req.files && req.files.length > 1) {
      return res.status(400).json({
        success: false,
        message: "Only one file can be uploaded at a time.",
        data: null,
      });
    }

    // // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    // if (req.file.size > 2 * 1024 * 1024) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "File size exceeds 2MB limit.",
    //     data: null,
    //   });
    // }

    // // Validate file type (image or document)
    // const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    // const allowedDocTypes = [
    //   "application/pdf",
    //   "application/msword",
    //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    // ];

    // if (![...allowedImageTypes, ...allowedDocTypes].includes(req.file.mimetype)) {
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

// const fetchImagesController = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 2;
//     const skip = (page - 1) * limit;

//     const sortBy = req.query.sortBy || "createdAt";
//     const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
//     const totalImages = await Image.countDocuments();
//     const totalPages = Math.ceil(totalImages / limit);

//     const sortObj = {};
//     sortObj[sortBy] = sortOrder;
//     const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

//     if (images) {
//       res.status(200).json({
//         success: true,
//         currentPage: page,
//         totalPages: totalPages,
//         totalImages: totalImages,
//         data: images,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong! Please try again",
//     });
//   }
// };

// const deleteImageController = async (req, res) => {
//   try {
//     const getCurrentIdOfImageToBeDeleted = req.params.id;

//     const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

//     if (!image) {
//       return res.status(404).json({
//         success: false,
//         message: "Image not found! Please provide a valid image id",
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

export default {
  fileUpload,
  // fetchImagesController,
  // deleteImageController,
};
