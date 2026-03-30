const db = require('../config/db');

exports.crearEmpresa = async (req, res) => {
  try {
    let {
      nombre_comercial = null,
      razon_social,
      rfc,
      regimen_fiscal,
      codigo_postal,
      direccion = null,
      correo_general = null,
      telefono = null
    } = req.body;

    const errores = [];

    // =======================
    // 1. VALIDACIÓN OBLIGATORIA
    // =======================
    if (!razon_social) errores.push('razon_social es obligatorio');
    if (!rfc) errores.push('rfc es obligatorio');
    if (!regimen_fiscal) errores.push('regimen_fiscal es obligatorio');
    if (!codigo_postal) errores.push('codigo_postal es obligatorio');

    if (errores.length > 0) {
      return res.status(400).json({
        success: false,
        errores
      });
    }

    // =======================
    // 2. LIMPIEZA
    // =======================
    razon_social = razon_social.trim();
    rfc = rfc.trim().toUpperCase();
    regimen_fiscal = regimen_fiscal.trim();
    codigo_postal = codigo_postal.trim();

    if (nombre_comercial) nombre_comercial = nombre_comercial.trim();
    if (direccion) direccion = direccion.trim();
    if (correo_general) correo_general = correo_general.trim().toLowerCase();
    if (telefono) telefono = telefono.trim();

    // =======================
    // 3. VALIDACIONES
    // =======================

    if (rfc.length < 12 || rfc.length > 13) {
      errores.push('rfc inválido (12 o 13 caracteres)');
    }

    if (!/^\d{5}$/.test(codigo_postal)) {
      errores.push('codigo_postal inválido (5 dígitos)');
    }

    if (correo_general && !/^\S+@\S+\.\S+$/.test(correo_general)) {
      errores.push('correo_general inválido');
    }

    if (telefono && !/^\d{10}$/.test(telefono)) {
      errores.push('telefono inválido (10 dígitos)');
    }

    if (errores.length > 0) {
      return res.status(400).json({
        success: false,
        errores
      });
    }

    // =======================
    // 4. INSERT
    // =======================
    const [result] = await db.execute(
      `INSERT INTO empresas 
      (nombre_comercial, razon_social, rfc, regimen_fiscal, codigo_postal, direccion, correo_general, telefono)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre_comercial,
        razon_social,
        rfc,
        regimen_fiscal,
        codigo_postal,
        direccion,
        correo_general,
        telefono
      ]
    );

    return res.status(201).json({
      success: true,
      id: result.insertId
    });

  } catch (error) {
    console.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        error: 'El RFC ya está registrado'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};