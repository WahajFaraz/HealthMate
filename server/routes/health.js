const express = require('express');
const Vitals = require('../models/Vitals');
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

// Get dashboard stats
router.get('/dashboard-stats', auth, async (req, res) => {
  try {
    // Get total reports count
    const totalReports = await Report.countDocuments({ user: req.user.id });

    // Get total vitals count
    const totalVitals = await Vitals.countDocuments({ user: req.user.id });

    // Get latest vitals for last checkup
    const latestVitals = await Vitals.findOne({ user: req.user.id })
      .sort({ date: -1 })
      .select('date');

    // Calculate health score (simplified logic)
    let healthScore = 0;
    if (totalVitals > 0) {
      // Get recent vitals for scoring
      const recentVitals = await Vitals.find({ user: req.user.id })
        .sort({ date: -1 })
        .limit(10);

      let score = 0;
      let count = 0;

      recentVitals.forEach(vital => {
        // Simple scoring based on normal ranges
        if (vital.systolic && vital.systolic >= 90 && vital.systolic <= 140) score += 20;
        if (vital.diastolic && vital.diastolic >= 60 && vital.diastolic <= 90) score += 20;
        if (vital.heartRate && vital.heartRate >= 60 && vital.heartRate <= 100) score += 20;
        if (vital.weight && vital.weight > 0) score += 20; // Just check if recorded
        if (vital.bloodSugar && vital.bloodSugar >= 70 && vital.bloodSugar <= 140) score += 20;
        count += 5; // 5 possible measurements
      });

      healthScore = Math.round((score / count) * 100);
    }

    res.json({
      totalReports,
      totalVitals,
      lastCheckup: latestVitals ? latestVitals.date.toISOString().split('T')[0] : 'No data',
      healthScore: Math.max(0, Math.min(100, healthScore))
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get health summary for specified days
router.get('/summary', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get vitals in date range
    const vitals = await Vitals.find({
      user: req.user.id,
      date: { $gte: startDate }
    });

    // Get reports in date range
    const reports = await Report.find({
      user: req.user.id,
      createdAt: { $gte: startDate }
    });

    // Calculate averages and trends
    const summary = {
      vitalsCount: vitals.length,
      reportsCount: reports.length,
      averageSystolic: vitals.filter(v => v.systolic).length > 0
        ? Math.round(vitals.reduce((sum, v) => sum + (v.systolic || 0), 0) / vitals.filter(v => v.systolic).length)
        : 0,
      averageDiastolic: vitals.filter(v => v.diastolic).length > 0
        ? Math.round(vitals.reduce((sum, v) => sum + (v.diastolic || 0), 0) / vitals.filter(v => v.diastolic).length)
        : 0,
      averageHeartRate: vitals.filter(v => v.heartRate).length > 0
        ? Math.round(vitals.reduce((sum, v) => sum + (v.heartRate || 0), 0) / vitals.filter(v => v.heartRate).length)
        : 0,
      averageWeight: vitals.filter(v => v.weight).length > 0
        ? Math.round((vitals.reduce((sum, v) => sum + (v.weight || 0), 0) / vitals.filter(v => v.weight).length) * 10) / 10
        : 0,
      averageBloodSugar: vitals.filter(v => v.bloodSugar).length > 0
        ? Math.round(vitals.reduce((sum, v) => sum + (v.bloodSugar || 0), 0) / vitals.filter(v => v.bloodSugar).length)
        : 0,
      period: `${days} days`
    };

    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get health trends for specific metric
router.get('/trends', auth, async (req, res) => {
  try {
    const { metric, days = 30 } = req.query;

    if (!metric) {
      return res.status(400).json({ message: 'Metric parameter is required' });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get vitals in date range
    const vitals = await Vitals.find({
      user: req.user.id,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Group by date and calculate daily averages
    const dailyData = {};
    vitals.forEach(vital => {
      const dateKey = vital.date.toISOString().split('T')[0];

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { count: 0, total: 0 };
      }

      if (vital[metric] !== undefined && vital[metric] !== null) {
        dailyData[dateKey].total += vital[metric];
        dailyData[dateKey].count += 1;
      }
    });

    // Convert to array format for charts
    const trends = Object.keys(dailyData).map(date => ({
      date,
      value: dailyData[date].count > 0 ? Math.round(dailyData[date].total / dailyData[date].count) : 0
    }));

    res.json({
      metric,
      period: `${days} days`,
      data: trends
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
