const express = require('express');
const cloudinary = require('cloudinary').v2;
const Report = require('../models/Report');
const jwt = require('jsonwebtoken');

const router = express.Router();

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

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload report with file
router.post('/upload', auth, async (req, res) => {
  try {
    const { file, title, type, description } = req.body;

    if (!file) {
      return res.status(400).json({ message: 'No file data provided' });
    }

    // Upload to Cloudinary (file is base64)
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: 'healthmate_reports',
      resource_type: 'auto',
    });

    const report = new Report({
      user: req.user.id,
      title: title || 'Untitled Report',
      type: type || 'Medical Report',
      description,
      fileUrl: uploadResult.secure_url,
      fileName: `report_${Date.now()}.${uploadResult.format}`,
      fileSize: uploadResult.bytes,
      mimeType: uploadResult.format,
      cloudinaryId: uploadResult.public_id,
    });

    await report.save();

    res.json({
      id: report._id,
      title: report.title,
      type: report.type,
      description: report.description,
      fileUrl: report.fileUrl,
      date: report.createdAt,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get reports with optional limit
router.get('/', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const reports = await Report.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(reports.map(report => ({
      id: report._id,
      title: report.title,
      type: report.type,
      description: report.description,
      fileUrl: report.fileUrl,
      date: report.createdAt,
    })));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single report
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Make sure user owns report
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json({
      id: report._id,
      title: report.title,
      type: report.type,
      description: report.description,
      fileUrl: report.fileUrl,
      fileName: report.fileName,
      fileSize: report.fileSize,
      mimeType: report.mimeType,
      date: report.createdAt,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update report
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, type, description } = req.body;

    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Make sure user owns report
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          type,
          description,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    res.json({
      id: report._id,
      title: report.title,
      type: report.type,
      description: report.description,
      fileUrl: report.fileUrl,
      date: report.createdAt,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete report
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Make sure user owns report
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete from Cloudinary
    if (report.cloudinaryId) {
      await cloudinary.uploader.destroy(report.cloudinaryId);
    }

    await Report.findByIdAndDelete(req.params.id);

    res.json({ message: 'Report removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get report file (download)
router.get('/:id/file', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Make sure user owns report
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Redirect to Cloudinary URL for download
    res.redirect(report.fileUrl);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
