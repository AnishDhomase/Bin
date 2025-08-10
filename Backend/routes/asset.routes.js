import express from "express";
import assetController from "../controllers/asset.controller.js";
import {
  authenticateUser,
  emailVerifiedUser,
} from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
import multerUploadMiddleware from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/file",
  authenticateUser,
  emailVerifiedUser,
  multerUploadMiddleware.single("file"),
  assetController.fileUpload
);

export default router;
