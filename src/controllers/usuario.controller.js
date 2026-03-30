const db = require('../config/db');
const bcrypt = require('bcrypt');

// 🔥 FLAG GLOBAL (cámbialo cuando quieras)
const ENVIAR_CORREOS = false;

// 🔑 Generar password random
const generarPassword = (length = 8) => {
  return Math.random().toString(36).slice(-length);
};

exports.crearUsuario = async (req, res) => {
  try {
    let {
      empresa_id,
      nombre,
      correo,
      whatsapp = null,
      puesto = null,
      recibe_facturas = 1,
      recibe_notificaciones = 1
    } = req.body;

    // 🧩 1. Limpiar
    empresa_id = Number(empresa_id);
    nombre = nombre?.trim();
    correo = correo?.trim().toLowerCase();
    if (whatsapp) whatsapp = whatsapp.trim();
    if (puesto) puesto = puesto.trim();

    // 🧩 2. Validar obligatorios
    if (!empresa_id || !nombre || !correo) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos obligatorios'
      });
    }

    // 🧩 3. Validar correo
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      return res.status(400).json({
        success: false,
        error: 'Correo inválido'
      });
    }

    // 🧩 4. Generar password
    const passwordPlano = generarPassword();
    const passwordHash = await bcrypt.hash(passwordPlano, 10);

    // 🧩 5. Insertar
    const [result] = await db.execute(
      `INSERT INTO usuarios 
      (empresa_id, nombre, correo, password, whatsapp, puesto, recibe_facturas, recibe_notificaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        empresa_id,
        nombre,
        correo,
        passwordHash,
        whatsapp,
        puesto,
        recibe_facturas,
        recibe_notificaciones
      ]
    );

    // 🧩 6. Manejo de correo (modo prueba)
    if (ENVIAR_CORREOS) {
      // aquí irá nodemailer después
    } else {
      console.log('=== MODO PRUEBA ===');
      console.log('Usuario:', correo);
      console.log('Password:', passwordPlano);
    }

    return res.json({
      success: true,
      id: result.insertId,
      password_temporal: ENVIAR_CORREOS ? null : passwordPlano
    });

  } catch (error) {
    console.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        error: 'El correo ya está registrado'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};