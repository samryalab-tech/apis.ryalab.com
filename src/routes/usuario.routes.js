const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');

// 👤 Crear usuario
router.post('/crear', usuarioController.crearUsuario);

module.exports = router;