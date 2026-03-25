exports.login = (req, res) => {

  const { email, password } = req.body;

  // Simulación
  if (email === 'admin@erp.com' && password === '123456') {
    return res.json({
      success: true,
      token: 'fake-jwt-token',
      user: {
        name: 'Admin',
        role: 'admin'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Credenciales incorrectas'
  });

};