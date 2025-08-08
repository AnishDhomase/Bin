import mongoose from "mongoose";

const EmailVerificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 15 * 60 * 1000), // expires in 15 minutes
    },
  },
  {
    timestamps: true,
    expires: "15m", // TTL index to auto-delete expired docs after 15 mins
  }
);

const EmailVerificationTokenModel = mongoose.model(
  "EmailVerificationToken",
  EmailVerificationTokenSchema
);

export default EmailVerificationTokenModel;
