const express = require('express');
const router = express.Router();

router.post('/crear', (req, res) => {
  try {
    console.log('🔥 ENTRE A CREAR');
    console.log('ENV:', process.env.TU_VARIABLE); // cambia por una real

    res.json({ mensaje: 'Empresa creada correctamente' });

  } catch (error) {
    console.error('❌ ERROR EN CREAR:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/test2', (req, res) => {
  res.send('EMPRESAS ROUTES OK');
});

module.exports = router;