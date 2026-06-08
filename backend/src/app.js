const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const clerkEnabled = process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY;
const clerkMiddleware = clerkEnabled
  ? require('@clerk/express').clerkMiddleware
  : null;

const app = express();

const originConfig = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const exactOrigins = originConfig.filter((origin) => !origin.includes('*'));
const originPatterns = originConfig
  .filter((origin) => origin.includes('*'))
  .map((pattern) => {
    const regexSource = pattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\\*/g, '[^/]*');
    return new RegExp(`^${regexSource}$`, 'i');
  });

const allowsVercelDeployments = exactOrigins.some((origin) => /\.vercel\.app$/i.test(origin));

const isOriginAllowed = (origin) => {
  if (!origin) return true;

  if (exactOrigins.includes(origin)) return true;
  if (originPatterns.some((pattern) => pattern.test(origin))) return true;

  if (allowsVercelDeployments && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
    return true;
  }

  if (process.env.NODE_ENV === 'production' && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
    return true;
  }

  const isLocalhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
  return process.env.NODE_ENV !== 'production' && isLocalhostOrigin;
};

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
      callback(null, isOriginAllowed(origin));
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
