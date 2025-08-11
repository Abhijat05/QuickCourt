import { Router } from "express";
import * as imageController from "../controllers/image.controller";
import { auth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// Public route to get images
router.get("/venues/:venueId", imageController.getVenueImages);

// Protected routes for uploads (need authentication)
router.use(auth);

// Add error handling middleware for Multer errors
const handleMulterError = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: "File too large, maximum size is 5MB" });
  }
  if (err.code === 'MISSING_FIELD_NAME') {
    return res.status(400).json({ 
      message: "Missing field name. Make sure you're using 'image' as the field name for file upload",
      hint: "When sending form data, the field containing the file must be named 'image'"
    });
  }
  if (err instanceof Error) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

// Owner-only routes with proper error handling
router.post(
  "/venues/:venueId", 
  requireRole(["owner"]), 
  (req, res, next) => {
    const upload = imageController.upload.single('image');
    upload(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  imageController.uploadVenueImage
);

router.post(
  "/courts/:courtId", 
  requireRole(["owner"]), 
  (req, res, next) => {
    const upload = imageController.upload.single('image');
    upload(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  imageController.uploadCourtImage
);

export default router;