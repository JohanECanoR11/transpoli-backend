// routes/ubicaciones.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // conexión promesa
const verificarToken = require('../middleware/verificarToken');

router.post('/', verificarToken, async (req, res) => {
  try {
    console.log(req.body)
    const { ruta_id, latitud, longitud } = req.body;

    if (!ruta_id || !latitud || !longitud) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    const [resultado] = await pool.query(
      'INSERT INTO ubicaciones (ruta_id, latitud, longitud, fecha_hora) VALUES (?, ?, ?, NOW())',
      [ruta_id, latitud, longitud]
    );

    res.status(201).json({ mensaje: 'Ubicación registrada correctamente' });
  } catch (error) {
    console.error('Error al registrar ubicación:', error);
    res.status(500).json({ mensaje: 'Error al registrar la ubicación' });
  }
});

// Obtener la última ubicación de una ruta
router.get('/:ruta_id/ultima', async (req, res) => {
    const { ruta_id } = req.params;
    try {
        const [result] = await pool.query(`
            SELECT * FROM ubicaciones 
            WHERE ruta_id = ? 
            ORDER BY fecha_hora DESC 
            LIMIT 1
        `, [ruta_id]);

        if (result.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontró ubicación para esta ruta' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error al obtener la última ubicación:', error);
        res.status(500).json({ mensaje: 'Error al obtener la última ubicación' });
    }
});

module.exports = router;
