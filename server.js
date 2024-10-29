// server.js
// Este es nuestro servidor que maneja todo

// Traemos las herramientas que necesitamos
const express = require('express');
const cors = require('cors');
const db = require('./db');  // <- Usamos el archivo db.js que creamos

// Creamos nuestro servidor
const app = express();

// Configuramos nuestro servidor
app.use(cors());  // <- Permite que el frontend se conecte
app.use(express.json());  // <- Permite recibir datos
app.use(express.static('public'));  // <- Sirve nuestros archivos HTML, CSS y JS

// Función para crear nuestra tabla en la base de datos
async function crearTabla() {
    // Esta es la receta para crear nuestra tabla
    const crearTablaQuery = `
        CREATE TABLE IF NOT EXISTS sesiones_usuario (
            id BIGINT PRIMARY KEY,
            tiempo_inicio TIMESTAMP NOT NULL,
            tiempo_fin TIMESTAMP,
            duracion INTEGER,
            interacciones INTEGER,
            pagina VARCHAR(255)
        );
    `;
    
    try {
        await db.query(crearTablaQuery);
        console.log('¡Tabla creada con éxito! 🎉');
    } catch (error) {
        console.error('Ups, algo salió mal:', error);
    }
}

// Ruta para guardar una nueva sesión
app.post('/api/sesiones', async (req, res) => {
    // Obtenemos los datos que nos envían
    const { id, tiempoInicio, tiempoFin, duracion, interacciones, pagina } = req.body;
    
    try {
        // Guardamos en la base de datos
        const resultado = await db.query(
            'INSERT INTO sesiones_usuario (id, tiempo_inicio, tiempo_fin, duracion, interacciones, pagina) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, tiempoInicio, tiempoFin, duracion, interacciones, pagina]
        );
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener todas las sesiones
app.get('/api/sesiones', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM sesiones_usuario ORDER BY tiempo_inicio DESC');
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciamos el servidor
const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`¡Servidor funcionando! 🚀 Puedes verlo en: http://localhost:${PUERTO}`);
    crearTabla();  // <- Creamos la tabla cuando inicia el servidor
});