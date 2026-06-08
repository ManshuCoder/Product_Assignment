const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const clerkMiddleware = process.env.CLERK_PUBLISHABLE_KEY
  ? require('@clerk/express').clerkMiddleware
  : null;

const app = express();

const normalizeOrigin = (origin) => {
  if (!origin) return null;
  if (/^https?:\/\//i.test(origin)) return origin.trim();
  return `https://${origin.trim()}`;
};

const allowedOrigins = new Set(
  [
    process.env.CLIENT_URL,
    process.env.CLIENT_URLS,
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URLS,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    process.env.NETLIFY_URL && `https://${process.env.NETLIFY_URL}`,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean)
);

allowedOrigins.add('http://localhost:5173');
allowedOrigins.add('http://localhost:5174');
allowedOrigins.add('http://127.0.0.1:5173');
allowedOrigins.add('http://127.0.0.1:5174');

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

app.use(limiter);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const isLocalhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
      if (allowedOrigins.has(origin) || (process.env.NODE_ENV !== 'production' && isLocalhostOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
if (clerkMiddleware) {
  app.use(clerkMiddleware());
}
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'ProductHub API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'ProductHub API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
}));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.all('*', (req, _res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

module.exports = app;
