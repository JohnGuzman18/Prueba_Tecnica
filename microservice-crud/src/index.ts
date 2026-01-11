import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// 1. Cargar configuración de variables de entorno (.env)
dotenv.config();

// 2. Inicializar la aplicación Express
const app = express();
const port = process.env.PORT || 3001;

// 3. Middleware para entender JSON (muy importante para recibir datos después)
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/technical_test';
mongoose.connect(mongoURI)
    .then(() => console.log('Base de datos conectada: MongoDB 🍃'))
    .catch((err) => console.error('Error conectando a MongoDB:', err));

// 4. Ruta de prueba básica
app.get('/', (req: Request, res: Response) => {
    res.send('¡Hola! El Microservicio CRUD está funcionando 🚀');
});

// 5. Arrancar el servidor
app.listen(port, () => {
    console.log(`[server]: Servidor corriendo en http://localhost:${port}`);
});