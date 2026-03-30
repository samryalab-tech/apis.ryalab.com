const express = require('express');
const app = express();

// ⚠️ dotenv opcional (no rompe si no hay .env)
require('dotenv').config();

app.use(express.json());

// LOG GLOBAL
app.use((req, res, next) => {
  console.log('🔥', req.method, req.url);
  next();
});

// TEST BASE
app.get('/ping', (req, res) => {
  res.send('pong');
});

// ROUTES
const empresaRoutes = require('./routes/empresa.routes');
app.use('/api/empresas', empresaRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    url: req.originalUrl
  });
});

// SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🚀 Server corriendo en puerto', PORT);
});