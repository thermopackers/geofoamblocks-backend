// backend/routes/newsletterRoutes.js
import express from 'express';
import Newsletter from '../models/Newsletter.js';
const router = express.Router();
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    await Newsletter.create({ email });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
export default router;