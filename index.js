require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const puerto = 3000;

const usuariosRoutes = require('./routes/usuarios'); 
const rutasProtegidas = require('./routes/rutasProtegidas');
const rutasRouter = require('./routes/rutas');

app.use(cors());
app.use(express.json());

app.use('/api', usuariosRoutes);
app.use('/api', rutasProtegidas);
app.use('/api/rutas', rutasRouter);


app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
