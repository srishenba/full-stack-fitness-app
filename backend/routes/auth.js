import express from 'express';
import multer from 'multer';
import path from 'path';
import { signup, signin, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/signup', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'sugarReportFile', maxCount: 1 },
  { name: 'bloodPressureReport', maxCount: 1 },
  { name: 'cholesterolReport', maxCount: 1 }
]), signup);

router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/login', signin); // Alias for compatibility

export default router;
