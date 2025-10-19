const express = require('express');
const Vitals = require('../models/Vitals');
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

// Add vitals
router.post('/', auth, async (req, res) => {
  try {
    const { systolic, diastolic, heartRate, weight, bloodSugar, temperature, notes } = req.body;

    const vitals = new Vitals({
      user: req.user.id,
      systolic,
      diastolic,
      heartRate,
      weight,
      bloodSugar,
      temperature,
      notes,
      date: new Date()
    });

    await vitals.save();
    res.json(vitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get vitals with optional limit
router.get('/', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const vitals = await Vitals.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(limit);

    res.json(vitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get vitals by date range
router.get('/range', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const vitals = await Vitals.find({
      user: req.user.id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: -1 });

    res.json(vitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update vitals
router.put('/:id', auth, async (req, res) => {
  try {
    const { systolic, diastolic, heartRate, weight, bloodSugar, temperature, notes } = req.body;

    let vitals = await Vitals.findById(req.params.id);

    if (!vitals) {
      return res.status(404).json({ message: 'Vitals not found' });
    }

    // Make sure user owns vitals
    if (vitals.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    vitals = await Vitals.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          systolic,
          diastolic,
          heartRate,
          weight,
          bloodSugar,
          temperature,
          notes,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    res.json(vitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete vitals
router.delete('/:id', auth, async (req, res) => {
  try {
    const vitals = await Vitals.findById(req.params.id);

    if (!vitals) {
      return res.status(404).json({ message: 'Vitals not found' });
    }

    // Make sure user owns vitals
    if (vitals.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Vitals.findByIdAndDelete(req.params.id);

    res.json({ message: 'Vitals removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
