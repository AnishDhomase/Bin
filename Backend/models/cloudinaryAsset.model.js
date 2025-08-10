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
    },
  },
  { timestamps: true }
);

const CloudinaryAssetModel = mongoose.model(
  "CloudinaryAsset",
  CloudinaryAssetSchema
);

export default CloudinaryAssetModel;
