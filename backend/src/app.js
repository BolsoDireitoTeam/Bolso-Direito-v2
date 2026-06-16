const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { globalLimiter, authLimiter } = require('./config/rateLimiter');
const { errorHandler } = require('./middlewares/errorMiddleware');
const configurePassport = require('./config/passportConfig');

const app = express();

// ─── Helmet (proteção de headers HTTP) ───────────────────────
// CSP ajustado para permitir avatares do Google/UI-Avatars e o Swagger UI
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'https:', 'http:'],
        connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// ─── CORS ────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// ─── Body Parser ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));

// ─── Rate Limiting global (/api) ─────────────────────────────
app.use('/api', globalLimiter);

// ─── Session (necessária para Passport OAuth) ────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// ─── Passport ────────────────────────────────────────────────
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// ─── Servir uploads como estático ────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Swagger UI (/api-docs) ─────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Bolso Direito — API Docs',
}));

// ─── Rotas da API ────────────────────────────────────────────
// Rate limiter restrito para autenticação
const authRoutes = require('./routes/authRoutes');
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);
app.use('/api/users', authRoutes);

app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/investments', require('./routes/investmentRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/recurrent', require('./routes/recurrentRoutes'));
app.use('/api/engine', require('./routes/engineRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// ─── Rotas OAuth ─────────────────────────────────────────────
app.use('/auth', require('./routes/oauthRoutes'));

// ─── Health Check ────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// ─── Tratamento de erros centralizado ────────────────────────
app.use(errorHandler);

module.exports = app;
