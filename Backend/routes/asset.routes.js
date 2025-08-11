import express from "express";
import assetController from "../controllers/asset.controller.js";
import {
  authenticateUser,
  emailVerifiedUser,
} from "../middlewares/auth.middleware.js";
import { body, param } from "express-validator";
import multerUploadMiddleware from "../middlewares/upload.middleware.js";
import { expressValidator } from "../middlewares/bodyValidator.middleware.js";
import mongoose from "mongoose";

const router = express.Router();

// Upload file
router.post(
  "/file",
  [
    body("parentId")
      .optional({ nullable: true })
      .custom((value) => {
        if (!value) return true;
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error("Invalid parentId");
        }
        return true;
      }),
    expressValidator,
  ],
  authenticateUser,
  emailVerifiedUser,
  multerUploadMiddleware.single("file"),
  assetController.fileUpload
);

// Create folder
router.post(
  "/folder",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("parentId")
      .optional({ nullable: true })
      .custom((value) => {
        if (!value) return true;
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error("Invalid parentId");
        }
        return true;
      }),
    expressValidator,
  ],
  authenticateUser,
  emailVerifiedUser,
  assetController.folderCreate
);

// Toogle Star fileFolder
router.patch(
  "/:fileFolderId/star",
  [
    param("fileFolderId").isMongoId().withMessage("Invalid file/folder ID"),
    expressValidator,
  ],
  authenticateUser,
  emailVerifiedUser,
  assetController.toggleStar
);

// Toogle trash fileFolder
router.patch(
  "/:fileFolderId/trash",
  [
    param("fileFolderId").isMongoId().withMessage("Invalid file/folder ID"),
    expressValidator,
  ],
  authenticateUser,
  emailVerifiedUser,
  assetController.toggleTrash
);

export default router;
