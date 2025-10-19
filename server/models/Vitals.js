const mongoose = require('mongoose');

const VitalsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  systolic: {
    type: Number,
    min: 50,
    max: 250,
  },
  diastolic: {
    type: Number,
    min: 30,
    max: 150,
  },
  heartRate: {
    type: Number,
    min: 30,
    max: 200,
  },
  weight: {
    type: Number,
    min: 1,
    max: 1000,
  },
  bloodSugar: {
    type: Number,
    min: 20,
    max: 1000,
  },
  temperature: {
    type: Number,
    min: 30,
    max: 50,
  },
  notes: {
    type: String,
    maxlength: 500,
  },
  date: {
    type: Date,
    default: Date.now,
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

module.exports = mongoose.model('Vitals', VitalsSchema);
