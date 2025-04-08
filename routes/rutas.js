const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middleware/verificarToken');

// ✅ Obtener todas las rutas (para estudiantes y administradores)
router.get('/', verificarToken, (req, res) => {
  db.query('SELECT * FROM rutas', (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener rutas' });
    res.json({ rutas: results });
  });
});

// ✅ Crear una nueva ruta (solo administradores)
router.post('/', verificarToken, (req, res) => {
  const { nombre, origen, destino, hora_salida, hora_llegada } = req.body;

  if (req.usuario.rol !== 'administrador') {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }

  const query = `
    INSERT INTO rutas (nombre, origen, destino, hora_salida, hora_llegada)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [nombre, origen, destino, hora_salida, hora_llegada], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al crear ruta' });
    res.status(201).json({ mensaje: 'Ruta creada correctamente' });
  });
});

// ✅ Actualizar una ruta
router.put('/:id', verificarToken, (req, res) => {
  const { nombre, origen, destino, hora_salida, hora_llegada } = req.body;

  if (req.usuario.rol !== 'administrador') {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }

  const query = `
    UPDATE rutas SET nombre=?, origen=?, destino=?, hora_salida=?, hora_llegada=?
    WHERE id=?
  `;
  db.query(query, [nombre, origen, destino, hora_salida, hora_llegada, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al actualizar ruta' });
    res.json({ mensaje: 'Ruta actualizada correctamente' });
  });
});

// ✅ Eliminar una ruta
router.delete('/:id', verificarToken, (req, res) => {
  if (req.usuario.rol !== 'administrador') {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }

  db.query('DELETE FROM rutas WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al eliminar ruta' });
    res.json({ mensaje: 'Ruta eliminada correctamente' });
  });
});

// Obtener todas las rutas
router.get('/', verificarToken, async (req, res) => {
  try {
      const [rutas] = await conexion.query('SELECT * FROM rutas');
      res.json({ mensaje: 'Listado de rutas', rutas });
  } catch (error) {
      console.error('Error al obtener rutas:', error);
      res.status(500).json({ mensaje: 'Error al obtener las rutas' });
  }
});

module.exports = router;
