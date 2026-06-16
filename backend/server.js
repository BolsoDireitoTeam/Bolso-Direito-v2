require('dotenv').config();

const fs = require('fs');
const path = require('path');
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// ─── Detecção de certificados SSL ────────────────────────────
// Busca certificados na pasta certs/ ou via variáveis de ambiente.
// Se encontrados, sobe em HTTPS; caso contrário, fallback para HTTP.

function getSSLOptions() {
  const certDir = path.join(__dirname, 'certs');
  const keyPath = process.env.SSL_KEY_PATH || path.join(certDir, 'key.pem');
  const certPath = process.env.SSL_CERT_PATH || path.join(certDir, 'cert.pem');

  try {
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      return {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
    }
  } catch (err) {
    console.warn('[SSL] Erro ao ler certificados:', err.message);
  }

  return null;
}

// ─── Inicialização ───────────────────────────────────────────

connectDB().then(() => {
  const sslOptions = getSSLOptions();

  if (sslOptions) {
    const https = require('https');
    const server = https.createServer(sslOptions, app);
    server.listen(PORT, () => {
      console.log(`[Server] 🔒 HTTPS running on port ${PORT}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[Server] API Docs: https://localhost:${PORT}/api-docs`);
    });
  } else {
    console.log('[SSL] Certificados não encontrados. Iniciando em HTTP (dev mode).');
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`[Server] 🌐 HTTP running on port ${PORT}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[Server] API Docs: http://localhost:${PORT}/api-docs`);
    });
  }
});
