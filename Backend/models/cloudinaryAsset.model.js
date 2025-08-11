import mongoose from "mongoose";

const CloudinaryAssetSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
      select: false,
    },
    format: {
      type: String,
      required: true, // e.g., 'jpg'
    },
    resource_type: {
      type: String,
      required: true, // e.g., 'image', 'video', 'raw'
    },
    mimetype: {
      type: String,
      required: true, // e.g., 'image/png'
    },
    size: {
      type: Number,
      required: true, // file size in bytes
    },
  },
  { timestamps: true }
);

const CloudinaryAssetModel = mongoose.model(
  "CloudinaryAsset",
  CloudinaryAssetSchema
);

export default CloudinaryAssetModel;
