const db = require('../config/db');
const bcrypt = require('bcrypt');

const ENVIAR_CORREOS = false;

// 🔑 Generar password seguro
const generarPassword = (length = 10) => {
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

    const errores = {};

    // =======================
    // 1. NORMALIZACIÓN
    // =======================
    empresa_id = Number(empresa_id);
    nombre = nombre?.trim();
    correo = correo?.trim().toLowerCase();

    if (whatsapp) whatsapp = whatsapp.trim();
    if (puesto) puesto = puesto.trim();

    // =======================
    // 2. VALIDACIONES
    // =======================

    if (!empresa_id || isNaN(empresa_id)) {
      errores.empresa_id = 'empresa_id inválido';
    }

    if (!nombre || nombre.length < 3) {
      errores.nombre = 'nombre requerido (mínimo 3 caracteres)';
    }

    if (!correo) {
      errores.correo = 'correo es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(correo)) {
      errores.correo = 'correo inválido';
    }

    if (whatsapp && !/^\d{10}$/.test(whatsapp)) {
      errores.whatsapp = 'whatsapp inválido (10 dígitos)';
    }

    if (Object.keys(errores).length > 0) {
      return res.status(400).json({
        success: false,
        errores
      });
    }

    // =======================
    // 3. VALIDAR EMPRESA EXISTE
    // =======================
    const [empresa] = await db.execute(
      'SELECT id FROM empresas WHERE id = ? LIMIT 1',
      [empresa_id]
    );

    if (empresa.length === 0) {
      return res.status(400).json({
        success: false,
        errores: {
          empresa_id: 'La empresa no existe'
        }
      });
    }

    // =======================
    // 4. GENERAR PASSWORD
    // =======================
    const passwordPlano = generarPassword();
    const passwordHash = await bcrypt.hash(passwordPlano, 10);

    // =======================
    // 5. INSERT
    // =======================
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
        recibe_facturas ? 1 : 0,
        recibe_notificaciones ? 1 : 0
      ]
    );

    // =======================
    // 6. LOG / CORREO
    // =======================
    if (ENVIAR_CORREOS) {
      // implementar después
    } else {
      console.log('=== USUARIO CREADO ===');
      console.log('Correo:', correo);
      console.log('Password:', passwordPlano);
    }

    // =======================
    // 7. RESPUESTA
    // =======================
    return res.status(201).json({
      success: true,
      id: result.insertId,
      password_temporal: ENVIAR_CORREOS ? null : passwordPlano
    });

  } catch (error) {
    console.error('❌ ERROR crearUsuario:', error);

    // =======================
    // ERRORES CONTROLADOS
    // =======================
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        errores: {
          correo: 'El correo ya está registrado'
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};