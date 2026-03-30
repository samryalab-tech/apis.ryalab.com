const express = require('express');
const cors = require('cors');

const app = express();

// =======================
// MIDDLEWARES
// =======================
app.use(cors());
app.use(express.json());

// =======================
// RUTAS BASE
// =======================

// 🔥 TEST BASE
app.get('/', (req, res) => {
  res.send('API ERP funcionando 🚀');
});

// 🔥 TEST API
app.get('/api/test', (req, res) => {
  res.json({ ok: true });
});

// =======================
// CARGA DE RUTAS
// =======================

console.log('Cargando rutas...');

// ERP
try {
  const erpRoutes = require('./routes/erp.routes');
  console.log('✔ erp.routes cargado');
  app.use('/erp', erpRoutes);
} catch (err) {
  console.error('❌ Error cargando erp.routes:', err.message);
}

// EMPRESAS
try {
  const empresaRoutes = require('./routes/empresa.routes');
  console.log('✔ empresa.routes cargado');
  app.use('/api/empresas', empresaRoutes);
} catch (err) {
  console.error('❌ Error cargando empresa.routes:', err.message);
}

// USUARIOS
try {
  const usuarioRoutes = require('./routes/usuario.routes');
  console.log('✔ usuario.routes cargado');
  app.use('/api/usuarios', usuarioRoutes);
} catch (err) {
  console.error('❌ Error cargando usuario.routes:', err.message);
}

// =======================
// RUTA DEBUG DIRECTA
// =======================

app.get('/api/empresas/test', (req, res) => {
  res.json({ mensaje: 'Ruta empresas directa OK' });
});

// =======================
// 404 HANDLER (IMPORTANTE)
// =======================

app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    url: req.originalUrl
  });
});

// =======================
// SERVER
// =======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});