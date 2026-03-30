const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta base para test
app.get('/', (req, res) => {
  res.send('API ERP funcionando 🚀');
});

// Rutas
app.use('/erp', require('./routes/erp.routes'));
app.use('/api/empresas', require('./routes/empresa.routes'));
app.use('/api/usuarios', require('./routes/usuario.routes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});