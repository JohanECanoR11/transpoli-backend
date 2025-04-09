const express = require('express');
const router = express.Router();
const pool = require('../db');

// Registro de usuarios
router.post('/register', async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol } = req.body;

    // Validación de campos vacíos
    if (!nombre || !correo || !contrasena || !rol) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    // Verificar si el correo ya está registrado
    const [existente] = await pool.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);

    if (existente.length > 0) {
      return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    }

    // Insertar usuario
    const query = 'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)';
    await pool.query(query, [nombre, correo, contrasena, rol]);

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
