// routes/conductor.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const verificarToken = require('../middleware/verificarToken');

router.get('/ruta-asignada', verificarToken, async (req, res) => {
  try {
    const conductorId = req.usuario.id;

    const [rows] = await pool.query(
      'SELECT * FROM rutas WHERE conductor_id = ? LIMIT 1',
      [conductorId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'No tienes una ruta asignada actualmente' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la ruta del conductor:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

module.exports = router;
