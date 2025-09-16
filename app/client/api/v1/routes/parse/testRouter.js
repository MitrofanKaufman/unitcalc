// Minimal test router to isolate the issue
import express from 'express';

const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Test route is working' });
});

console.log('[TEST] Test router created and exported');

export default router;
