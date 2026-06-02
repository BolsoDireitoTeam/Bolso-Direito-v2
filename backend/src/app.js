const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares globais
app.use(cors()); // Permite requisições do front-end (porta diferente)
app.use(express.json()); // Habilita parse de JSON no body das requisições

// Rotas (serão importadas e usadas aqui)
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/investments', require('./routes/investmentRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/recurrent', require('./routes/recurrentRoutes'));
app.use('/api/engine', require('./routes/engineRoutes'));
// app.use('/api/settings', require('./routes/settingsRoutes'));

// Rota de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Tratamento de erros centralizado
app.use(errorHandler);

module.exports = app;
