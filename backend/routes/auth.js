const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { signup, signin } = require('../controllers/authController');

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
router.post('/login', signin); // Alias for compatibility

module.exports = router;
