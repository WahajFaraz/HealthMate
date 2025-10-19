const express = require('express');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Upload file to Cloudinary
router.post('/', auth, async (req, res) => {
  try {
    if (!req.body.file) {
      return res.status(400).json({ message: 'No file data provided' });
    }

    // For base64 data, upload directly to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.body.file, {
      folder: 'healthmate_uploads',
      resource_type: 'auto',
    });

    res.json({
      message: 'File uploaded successfully',
      file: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        size: uploadResult.bytes,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
