const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teachers');
const bookingRoutes = require('./routes/bookings');
const accountRoutes = require('./routes/account');
const tutorRoutes = require('./routes/tutor');
const classroomRoutes = require('./routes/classroom');

const normalizeOrigin = (value) => String(value || '').trim().replace(/\/+$/, '');

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

const isAllowedOrigin = (requestOrigin) => {
  const normalizedRequestOrigin = normalizeOrigin(requestOrigin);
  if (!normalizedRequestOrigin) return true;
  if (allowedOrigins.length === 0) return true;

  return allowedOrigins.some((pattern) => {
    if (!pattern.includes('*')) return pattern === normalizedRequestOrigin;
    // Support wildcard patterns like https://*.vercel.app
    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    return new RegExp(`^${escaped}$`).test(normalizedRequestOrigin);
  });
};

app.use(cors({
  origin(origin, callback) {
    // Allow non-browser clients and same-origin requests.
    if (!origin) return callback(null, true);
    if (isAllowedOrigin(origin)) return callback(null, true);
    // Return false instead of error so preflight does not become a 500.
    return callback(null, false);
  },
  optionsSuccessStatus: 204,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/classroom', classroomRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
