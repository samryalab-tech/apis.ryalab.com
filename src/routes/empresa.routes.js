const express = require('express');
const router = express.Router();

router.post('/crear', (req, res) => {
  console.log('🔥 POST /crear recibido');
  res.json({ mensaje: 'Empresa creada correctamente' });
});

router.get('/test2', (req, res) => {
  res.send('EMPRESAS ROUTES OK');
});

module.exports = router;