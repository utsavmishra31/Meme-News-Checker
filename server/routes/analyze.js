const express = require('express');
const router = express.Router();
const { checkMemeFact } = require('../aiController');

router.post('/analyze-text', checkMemeFact);

module.exports = router;
