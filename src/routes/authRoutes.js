const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', authController.login);

// Ruta protegida para probar que el token jala
router.get('/dashboard', authMiddleware, (req, res) => {
    res.json({ msg: "Bienvenido al Dashboard de Maquind", user: req.user });
});

module.exports = router;