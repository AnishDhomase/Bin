import { cloudinary } from "../configs/cloudinary.js";

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format, //jpg
      resource_type: result.resource_type, //image
      original_filename: result.original_filename, //fileName
    };
  } catch (error) {
    console.error("Error while file uploading to cloudinary", error);
    throw new Error("Error while file uploading to cloudinary");
  }
};

export { uploadToCloudinary };
