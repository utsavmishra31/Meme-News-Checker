const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


const allowedOrigins = [
  'http://localhost:5173',
  'https://meme-news-checker.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

app.use(express.json());


const analyzeRoute = require('./routes/analyze');
const extractRoute = require('./routes/extract');

app.use('/api', analyzeRoute);
app.use('/api', extractRoute);


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
