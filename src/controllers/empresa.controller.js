const db = require('../config/db');

exports.crearEmpresa = async (req, res) => {
  try {
    console.log('🔥 Controller crearEmpresa');

    const { razon_social, rfc, regimen_fiscal, codigo_postal } = req.body;

    // VALIDACIÓN MÍNIMA
    if (!razon_social || !rfc || !regimen_fiscal || !codigo_postal) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos obligatorios'
      });
    }

    // TEST DB
    const [rows] = await db.execute('SELECT 1');

    return res.json({
      success: true,
      test: rows
    });

  } catch (error) {
    console.error('❌ ERROR:', error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};