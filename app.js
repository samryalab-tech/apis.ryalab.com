require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIG DB
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
};

// RUTA DIRECTA (Sin carpetas, sin broncas)
app.post('/login', async (req, res) => {
    const { correo, password } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        await connection.end();

        if (rows.length === 0) return res.status(401).json({ message: "No existe el usuario" });

        const valid = await bcrypt.compare(password, rows[0].password);
        if (!valid) return res.status(401).json({ message: "Pass mal" });

        const token = jwt.sign({ id: rows[0].id }, 'maquind2026', { expiresIn: '24h' });
        res.json({ token, user: rows[0].nombre });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => console.log("✅ JALANDO EN PUERTO 3000"));