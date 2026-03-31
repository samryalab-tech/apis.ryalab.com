const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (rows.length === 0) return res.status(401).json({ message: "Usuario no encontrado" });

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: user.id, rol: user.rol, empresa: user.empresa_id },
            process.env.JWT_SECRET || 'maquind_2026',
            { expiresIn: '24h' }
        );

        res.json({ token, user: { nombre: user.nombre, rol: user.rol } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};