const express = require('express');
const router = express.Router();

const { crearEmpresa } = require('../controllers/empresa.controller');

// TEST
router.get('/test', (req, res) => {
  res.json({ ok: true });
});

// POST REAL
router.post('/crear', crearEmpresa);

module.exports = router;