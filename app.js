require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIG DE DB (Usa las variables que configuraste en el panel de Hostinger)
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
};

// RUTA RAIZ (Para probar si el dominio ya apunta al Node)
app.get('/', (req, res) => res.send("✅ API de Maquind en Hostinger Funcionando"));

// RUTA LOGIN
app.post('/login', async (req, res) => {
    const { correo, password } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        await connection.end();

        if (rows.length === 0) return res.status(401).json({ error: "Usuario no existe" });

        const valid = await bcrypt.compare(password, rows[0].password);
        if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign({ id: rows[0].id }, 'maquind2026', { expiresIn: '24h' });
        res.json({ success: true, token, user: rows[0].nombre });
    } catch (e) {
        res.status(500).json({ error: "Error de DB en Hostinger: " + e.message });
    }
});

// IMPORTANTE: Hostinger usa process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));