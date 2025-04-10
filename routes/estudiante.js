// routes/estudiante.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const verificarToken = require('../middleware/verificarToken');

router.get('/ruta', verificarToken, async (req, res) => {
  try {
    const estudianteId = req.usuario.id;

    // Asumimos que hay una relación entre estudiante y ruta
    const [rows] = await pool.query(`
      SELECT r.* FROM rutas r
      JOIN estudiantes_rutas er ON er.ruta_id = r.id
      WHERE er.estudiante_id = ?
      LIMIT 1
    `, [estudianteId]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'No tienes una ruta asignada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la ruta del estudiante:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

module.exports = router;
