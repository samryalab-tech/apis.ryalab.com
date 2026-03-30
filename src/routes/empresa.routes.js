const express = require('express');
const router = express.Router();

const empresaController = require('../controllers/empresa.controller');

router.post('/crear', empresaController.crearEmpresa);

module.exports = router;