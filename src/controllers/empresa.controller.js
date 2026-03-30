exports.crearEmpresa = async (req, res) => {
  try {
    console.log('🔥 ENTRE A CREAR');

    // 👇 prueba conexión simple
    const [rows] = await db.execute('SELECT 1');

    console.log('✅ DB OK');

    return res.json({
      success: true,
      test: rows
    });

  } catch (error) {
    console.error('❌ ERROR REAL:', error);

    return res.status(500).json({
      error: error.message
    });
  }
};