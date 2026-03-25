const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 TEST ROUTE (IMPORTANTE)
app.get('/', (req, res) => {
  res.send('API ERP funcionando 🚀');
});

// 🔥 KEEP ALIVE (IMPORTANTE PARA HOSTINGER)
setInterval(() => {
  console.log('Servidor activo...');
}, 10000);
// Rutas
app.use('/erp', require('./routes/erp.routes'));

// 🔥 PUERTO DINÁMICO
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});