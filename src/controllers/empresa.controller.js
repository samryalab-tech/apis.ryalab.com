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

    // 🧩 1. Validación obligatoria
    if (!razon_social || !rfc || !regimen_fiscal || !codigo_postal) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos obligatorios'
      });
    }

    // 🧩 2. Limpiar datos (trim)
    razon_social = razon_social.trim();
    rfc = rfc.trim().toUpperCase();
    regimen_fiscal = regimen_fiscal.trim();
    codigo_postal = codigo_postal.trim();

    if (nombre_comercial) nombre_comercial = nombre_comercial.trim();
    if (direccion) direccion = direccion.trim();
    if (correo_general) correo_general = correo_general.trim();
    if (telefono) telefono = telefono.trim();

    // 🧩 3. Validaciones básicas
    if (rfc.length < 12 || rfc.length > 13) {
      return res.status(400).json({
        success: false,
        error: 'RFC inválido'
      });
    }

    if (!/^\d{5}$/.test(codigo_postal)) {
      return res.status(400).json({
        success: false,
        error: 'Código postal inválido'
      });
    }

    if (correo_general && !/^\S+@\S+\.\S+$/.test(correo_general)) {
      return res.status(400).json({
        success: false,
        error: 'Correo inválido'
      });
    }

    // 🧩 4. Insert
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

    return res.json({
      success: true,
      id: result.insertId
    });

  } catch (error) {
    console.error(error);

    // 🧩 5. Error controlado (RFC duplicado)
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