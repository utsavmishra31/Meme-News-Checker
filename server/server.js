const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


const analyzeRoute = require('./routes/analyze');
const extractRoute = require('./routes/extract');



app.use('/api', analyzeRoute);
app.use('/api', extractRoute);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
