const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// =======================
// CORS (CRÍTICO)
// =======================
app.use(cors({
  origin: ['http://localhost:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// =======================
// MIDDLEWARES
// =======================
app.use(express.json());

// LOG GLOBAL
app.use((req, res, next) => {
  console.log('🔥', req.method, req.url);
  next();
});

// =======================
// TEST
// =======================
app.get('/ping', (req, res) => {
  res.send('pong');
});

// =======================
// ROUTES BASE ERP
// =======================

const empresaRoutes = require('./routes/empresa.routes');
const usuarioRoutes = require('./routes/usuario.routes');

// 🔥 IMPORTANTE: USAR MISMO PREFIJO QUE FRONTEND
app.use('/erp/empresas', empresaRoutes);
app.use('/erp/usuarios', usuarioRoutes);

// =======================
// 404
// =======================
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    url: req.originalUrl
  });
});

// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🚀 Server corriendo en puerto', PORT);
});