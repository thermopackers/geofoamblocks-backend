import express from 'express';
import Newsletter from '../models/Newsletter.js';

const router = express.Router();

// POST — subscribe (public)
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Valid email required' });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Already subscribed' });
    }

    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET — list all subscribers (private, requires admin key)
router.get('/', async (req, res) => {
  const requestKey = req.headers['x-admin-api-key'];

  if (!requestKey || requestKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, count: subscribers.length, data: subscribers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;