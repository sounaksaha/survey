import express from "express";
import multer from "multer";
import {
  deleteSubmission,
  getAllSubmissions,
  getSubmissionById,
  getSubmissionCount,
  submitForm,
  updateSubmission,
  uploadFile,
} from "../controllers/uploadController.js";
import { authorizeRoles, protect } from "../middleware/authorize.js";

const router = express.Router();
const upload = multer({ dest: "temp_uploads/" });

router.post(
  "/upload",
  upload.single("file"),
  protect,
  authorizeRoles("admin"),
  uploadFile
);
router.post("/submit-form", protect, authorizeRoles("admin"), submitForm);
router.get(
  "/form-submissions",
  protect,
  authorizeRoles("admin"),
  getAllSubmissions
); // 🆕

router.get(
  "/form-submissions/:id",
  protect,
  authorizeRoles("admin"),
  getSubmissionById
); // 🆕 get by ID

router.put(
  "/form-submissions/:id",
  protect,
  authorizeRoles("admin"),
  updateSubmission
);
router.delete(
  "/form-submissions/:id",
  protect,
  authorizeRoles("admin"),
  deleteSubmission
);

router.get(
  "/form-submissions-count",
  protect,
  authorizeRoles("admin"),
  getSubmissionCount
);

export default router;
