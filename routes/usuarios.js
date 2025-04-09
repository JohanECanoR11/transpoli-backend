const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const verificarToken = require('../middleware/verificarToken');

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

// Login
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?',
      [correo, contrasena]
    );

    if (rows.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const usuario = rows[0];

    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        correo: usuario.correo
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// Obtener todos los usuarios
router.get('/usuarios', verificarToken, async (req, res) => {
  try {
    const [usuarios] = await pool.query('SELECT id, nombre, correo, rol FROM usuarios');
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});

// Actualizar usuario
router.put('/usuarios/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, rol } = req.body;

  if (!nombre || !correo || !rol) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    const [resultado] = await pool.query(
      'UPDATE usuarios SET nombre = ?, correo = ?, rol = ? WHERE id = ?',
      [nombre, correo, rol, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
  }
});

// Eliminar usuario por ID
router.delete('/usuarios/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
});


module.exports = router;
