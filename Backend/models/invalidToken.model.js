import mongoose from "mongoose";

const InvalidTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24, // 24 hours TTL
  },
});

const InvalidTokenModel = mongoose.model("invalidToken", InvalidTokenSchema);

export default InvalidTokenModel;
