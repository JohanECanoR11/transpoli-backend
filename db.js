const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123', // ⚠️ Cámbiala por la tuya
  database: 'transpoli_db'
});

db.connect(err => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
  } else {
    console.log('✅ Conexión a MySQL exitosa');
  }
});

module.exports = db;
