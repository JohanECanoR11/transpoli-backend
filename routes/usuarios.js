const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de que tengas este archivo y conexión

// Ruta para login
router.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?';

  db.query(sql, [correo, contrasena], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la consulta', detalles: err });

    if (results.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const usuario = results[0];
    res.status(200).json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  });
});

module.exports = router;
