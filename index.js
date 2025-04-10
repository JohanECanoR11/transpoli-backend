require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const puerto = 3000;

const usuariosRoutes = require('./routes/usuarios'); 
const rutasProtegidas = require('./routes/rutasProtegidas');
const rutasRouter = require('./routes/rutas');
const ubicacionesRoutes = require('./routes/ubicaciones');
const conductorRoutes = require('./routes/conductor');
const estudianteRoutes = require('./routes/estudiante');

app.use(cors());
app.use(express.json());

app.use('/api', usuariosRoutes);
app.use('/api', rutasProtegidas);
app.use('/api/rutas', rutasRouter);
app.use('/api/ubicaciones', ubicacionesRoutes);
app.use('/api/conductor', conductorRoutes);
app.use('/api/estudiante', estudianteRoutes);

app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
