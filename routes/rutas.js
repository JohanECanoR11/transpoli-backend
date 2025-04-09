const express = require('express');
const router = express.Router();
const pool = require('../db');
const verificarToken = require('../middleware/verificarToken');

// Obtener todas las rutas
router.get('/', verificarToken, async (req, res) => {
  try {
    const [rutas] = await pool.query('SELECT * FROM rutas');
    res.json(rutas);
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    res.status(500).json({ mensaje: 'Error al obtener las rutas' });
  }
});

// Crear una nueva ruta
router.post('/', verificarToken, async (req, res) => {
  const { nombre, origen, destino, hora_salida, hora_llegada } = req.body;

  if (!nombre || !origen || !destino || !hora_salida || !hora_llegada) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    const [resultado] = await pool.query(
      'INSERT INTO rutas (nombre, origen, destino, hora_salida, hora_llegada) VALUES (?, ?, ?, ?, ?)',
      [nombre, origen, destino, hora_salida, hora_llegada]
    );
    res.status(201).json({ mensaje: 'Ruta creada correctamente' });
  } catch (error) {
    console.error('Error al crear ruta:', error);
    res.status(500).json({ mensaje: 'Error al crear la ruta' });
  }
});

// Actualizar una ruta existente
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nombre, origen, destino, hora_salida, hora_llegada } = req.body;

  if (!nombre || !origen || !destino || !hora_salida || !hora_llegada) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    const [resultado] = await pool.query(
      'UPDATE rutas SET nombre = ?, origen = ?, destino = ?, hora_salida = ?, hora_llegada = ? WHERE id = ?',
      [nombre, origen, destino, hora_salida, hora_llegada, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Ruta no encontrada' });
    }

    res.json({ mensaje: 'Ruta actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar ruta:', error);
    res.status(500).json({ mensaje: 'Error al actualizar la ruta' });
  }
});

// Eliminar una ruta
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await pool.query('DELETE FROM rutas WHERE id = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Ruta no encontrada' });
    }

    res.json({ mensaje: 'Ruta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar ruta:', error);
    res.status(500).json({ mensaje: 'Error al eliminar la ruta' });
  }
});

module.exports = router;
