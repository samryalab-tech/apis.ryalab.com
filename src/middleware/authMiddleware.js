const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Acceso denegado' });

    try {
        const verificado = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'maquind_2026');
        req.user = verificado;
        next();
    } catch (e) {
        res.status(400).json({ error: 'Token no válido' });
    }
};