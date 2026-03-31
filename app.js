require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // <--- ESTO ES VITAL PARA QUE POSTMAN FUNCIONE

// CONFIG DE TU DB (Hostinger)
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
};

// --- RUTA DIRECTA ---
app.post('/login', async (req, res) => {
    const { correo, password } = req.body;
    console.log("Intentando login con:", correo); // Esto saldrá en tu terminal de Mac

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        await connection.end();

        if (rows.length === 0) return res.status(401).json({ error: "Usuario no existe" });

        const valid = await bcrypt.compare(password, rows[0].password);
        if (!valid) return res.status(401).json({ error: "Contraseña mal" });

        const token = jwt.sign({ id: rows[0].id, rol: rows[0].rol }, 'maquind_2026', { expiresIn: '24h' });
        
        res.json({ success: true, token, user: rows[0].nombre });
    } catch (e) {
        res.status(500).json({ error: "Error de DB: " + e.message });
    }
});

// --- RUTA DE PRUEBA (Para ver si el puerto sirve) ---
app.get('/', (req, res) => res.send("Servidor Maquind Vivo"));

app.listen(3000, () => console.log("🚀 BACKEND CORRIENDO EN PUERTO 3000"));