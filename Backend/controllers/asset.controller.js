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

    // Check file exist of same new name and update newName accordingly
    let nameConflict = await FileFolderModel.findOne({
      name: fileName,
      parentId: parentId || null,
      userId,
      isFolder: false,
      isTrash: false,
    });
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
        })
      ) {
        counter++;
      }
      newName = `${baseName} (${counter})`;
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
      name: newName,
      parentId: parentId || null,
      userId,
      isFolder: false,
      cloudinaryAssetId: uploadedCloudinaryAsset._id,
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: newFile,
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
      return res
        .status(404)
        .json({ success: false, message: "Provide valid file or folder id" });
    }
    if (fileFolderToChange.name === name) {
      return res
        .status(404)
        .json({ success: false, message: "Same name is provided" });
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

    res.json({ success: true, data: fileFolderToChange });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error occured while renaming the file or folder",
      error: err,
    });
  }
};

export const getFilesFlders = async (req, res, next) => {
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
        return res.status(404).json({ message: "Parent folder not found" });
      }
    }

    const items = await FileFolderModel.find({
      parentId,
      userId,
      isTrash: false,
    })
      .sort({ isFolder: -1, name: 1 }) // folders first, then files
      .populate({
        path: "cloudinaryAssetId",
        select: "-publicId",
      });

    res.json({ success: true, data: items });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error occured while fetching the files and folders",
      error: err,
    });
  }
};

export default {
  fileUpload,
  folderCreate,
  toggleStar,
  toggleTrash,
  changeName,
  getFilesFlders,
  // fetchImagesController,
  // deleteImageController,
};
