const express = require('express');
const router = express.Router();
const Tesseract = require('tesseract.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

router.post('/extract-from-url', async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    const response = await fetch(imageUrl);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('URL is not a valid image');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await Tesseract.recognize(buffer, 'eng');
    const text = result.data.text.trim();

    res.json({ text });
  } catch (err) {
    console.error('OCR error from URL:', err.message);
    res.status(500).json({ error: 'Failed to extract text from image URL' });
  }
});

module.exports = router;
