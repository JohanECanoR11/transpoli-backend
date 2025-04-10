const express = require('express');
const router = express.Router();
const pool = require('../db');
const verificarToken = require('../middleware/verificarToken');

// Registrar ubicación actual de una ruta
router.post('/', verificarToken, async (req, res) => {
  try {
    const { ruta_id, latitud, longitud } = req.body;

    if (!ruta_id || !latitud || !longitud) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    await pool.query(
      'INSERT INTO ubicaciones (ruta_id, latitud, longitud, fecha_hora) VALUES (?, ?, ?, NOW())',
      [ruta_id, latitud, longitud]
    );

    res.status(201).json({ mensaje: 'Ubicación registrada correctamente' });
  } catch (error) {
    console.error('Error al registrar ubicación:', error);
    res.status(500).json({ mensaje: 'Error al registrar ubicación' });
  }
});

// Obtener última ubicación de todas las rutas activas
router.get('/todas/ultimas', async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT r.id AS ruta_id, r.nombre, u.latitud, u.longitud, u.fecha_hora
      FROM rutas r
      LEFT JOIN (
        SELECT ruta_id, latitud, longitud, fecha_hora
        FROM ubicaciones
        WHERE (ruta_id, fecha_hora) IN (
          SELECT ruta_id, MAX(fecha_hora)
          FROM ubicaciones
          GROUP BY ruta_id
        )
      ) u ON r.id = u.ruta_id
    `);

    res.json(result); // 👈 ¡Esto era lo que fallaba antes!
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener ubicaciones de rutas' });
  }
});

router.get('/ruta/:id', async (req, res) => {
  const rutaId = req.params.id;

  try {
    const [ubicaciones] = await pool.query(
      'SELECT latitud, longitud, fecha_hora FROM ubicaciones WHERE ruta_id = ? ORDER BY fecha_hora',
      [rutaId]
    );
    res.json(ubicaciones);
  } catch (error) {
    console.error('Error al obtener ruta completa:', error);
    res.status(500).json({ mensaje: 'Error al obtener la ruta' });
  }
});


module.exports = router;
