// db.js
// Este archivo se conecta a nuestra base de datos

// Traemos la herramienta para conectarnos a la base de datos
const { Pool } = require('pg');

// Creamos la conexión con nuestra información
const pool = new Pool({
    user: 'postgres',          // <- Cambia esto por tu usuario
    host: 'localhost',         // <- Dejalo así
    database: 'user_tracking', // <- El nombre que le diste a tu base de datos
    password: 'comando123', // <- Cambia esto por tu contraseña
    port: 5432                 // <- Dejalo así
});

// Preparamos nuestro archivo para ser usado por otros
module.exports = {
    query: (text, params) => pool.query(text, params),
};

// Ejemplo de inserción de datos
const insertSession = async (sessionData) => {
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sessionData)
    });
    
    if (!response.ok) {
      throw new Error('Error al guardar la sesión');
    }
  };
  