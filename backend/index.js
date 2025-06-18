require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const timeout = require('connect-timeout');
const morgan = require('morgan');
const uploadRouter = require('./routes/upload');
const chatRouter = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Rate limiting: 10,000 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10000,
});
app.use(limiter);

// Request timeout
app.use(timeout('2m'));

// Routes
app.use('/upload', uploadRouter);
app.use('/chat', chatRouter);

// Error handler
app.use((err, req, res, next) => {
  if (err.code === 'ETIMEDOUT') {
    return res.status(503).json({ error: 'Request timed out' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});