const express = require('express');
const router = express.Router();

// ✅ RUTA CORRECTA
router.post('/crear', (req, res) => {
  res.json({ mensaje: 'Empresa creada correctamente' });
});

router.get('/test2', (req, res) => {
  res.send('EMPRESAS ROUTES OK');
});
module.exports = router;