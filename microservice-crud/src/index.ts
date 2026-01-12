import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Person from './models/person';

// Cargar configuración de variables de entorno (.env)
dotenv.config();

// Inicializar la aplicación Express
const app = express();
const port = process.env.PORT || 3001;

// Middleware para entender JSON (muy importante para recibir datos después)
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/technical_test';
mongoose.connect(mongoURI)
    .then(() => console.log('Base de datos conectada: MongoDB 🍃'))
    .catch((err) => console.error('Error conectando a MongoDB:', err));

// POST /create-profile
app.post('/create-profile', async (req: Request, res: Response): Promise<void> => {
    try {
        // Recibimos los datos del cuerpo de la petición (body)
        const { firstName, lastName, cellphone, email, address } = req.body;

        // Creamos una nueva "Persona" usando tu modelo
        const newPerson = new Person({
            firstName,
            lastName,
            cellphone,
            email,
            address
        });

        // Guardamos en la base de datos (esto es asíncrono)
        const savedPerson = await newPerson.save();

        // Por ahora, usaremos el ID de Mongo como "token" simple para cumplir.
        res.status(201).json({
            message: 'Profile created successfully',
            token: savedPerson._id, // Simulamos el token con el ID por ahora, luego implementaremos JWT
            data: savedPerson
        });

    } catch (error) {
        // Manejo de errores (ej: email duplicado)
        res.status(500).json({ message: 'Error creating profile', error });
    }
});
// REQUISITO: Actualizar perfil (UPDATE)
// Usamos ':id' en la ruta para saber A QUIÉN vamos a modificar
app.put('/update-profile/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;          // El ID viene de la URL
        const updates = req.body;           // Los datos nuevos vienen del cuerpo (body)

        // Buscamos por ID y actualizamos. { new: true } nos devuelve el dato ya cambiado.
        const updatedPerson = await Person.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedPerson) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return; // Importante para detener la ejecución
        }

        res.json({
            message: 'Perfil actualizado correctamente',
            data: updatedPerson
        });

    } catch (error) {
        res.status(500).json({ message: 'Error actualizando perfil', error });
    }
});
// REQUISITO: Borrar perfil (DELETE) 
app.delete('/delete-profile/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const deletedPerson = await Person.findByIdAndDelete(id);

        if (!deletedPerson) {
            res.status(404).json({ message: 'Usuario no encontrado para eliminar' });
            return;
        }

        res.json({
            message: 'Perfil eliminado correctamente',
            id_deleted: deletedPerson._id
        });

    } catch (error) {
        res.status(500).json({ message: 'Error eliminando perfil', error });
    }
});
// 4. Ruta de prueba básica
app.get('/', (req: Request, res: Response) => {
    res.send('¡Hola! El Microservicio CRUD está funcionando 🚀');
});

// 5. Arrancar el servidor
app.listen(port, () => {
    console.log(`[server]: Servidor corriendo en http://localhost:${port}`);
});