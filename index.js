const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const usuariosRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRoutes); // ¡Esto conecta correctamente la ruta!

// Servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
