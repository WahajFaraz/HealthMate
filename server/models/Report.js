const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  type: {
    type: String,
    required: true,
    enum: [
      'blood-test',
      'urine-test',
      'x-ray',
      'ultrasound',
      'mri',
      'ct-scan',
      'prescription',
      'other'
    ],
    default: 'other',
  },
  description: {
    type: String,
    maxlength: 1000,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', ReportSchema);
