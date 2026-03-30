const express = require('express');
const router = express.Router();

// 🔥 TEST
router.get('/test', (req, res) => {
  res.json({ ok: true, modulo: 'usuarios' });
});

// 🔥 POST mínimo (sin controller aún)
router.post('/crear', (req, res) => {
  console.log('🔥 POST /usuarios/crear');
  res.json({
    success: true,
    body: req.body
  });
});

module.exports = router;