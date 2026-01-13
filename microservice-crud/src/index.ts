import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Person from './models/person';
import jwt from 'jsonwebtoken';

// Cargar variables de entorno (útil si pruebas sin Docker, con un archivo .env local)
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// 1. Conexión a Mongo usando la variable de entorno
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/technical_test';
mongoose.connect(mongoURI)
    .then(() => console.log('Base de datos conectada: MongoDB 🍃'))
    .catch((err) => console.error('Error conectando a MongoDB:', err));

// --- RUTAS ---

// POST /create-profile
app.post('/create-profile', async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, cellphone, email, address } = req.body;

        const newPerson = new Person({
            firstName, lastName, cellphone, email, address
        });

        const savedPerson = await newPerson.save();

        // Creamos el Payload
        const payload = {
            id: savedPerson._id,
            email: savedPerson.email
        };
        const secretKey = process.env.JWT_SECRET as string;

        if (!secretKey) {
            console.error("ERROR CRÍTICO: No se encontró JWT_SECRET en las variables de entorno");
            res.status(500).json({ message: "Error de configuración en el servidor" });
            return;
        }
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        res.status(201).json({
            message: 'Profile created successfully',
            token: token,
            data: savedPerson
        });

    } catch (error) {
        res.status(500).json({ message: 'Error creating profile', error });
    }
});

// PUT /update-profile/:id
app.put('/update-profile/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedPerson = await Person.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedPerson) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        res.json({
            message: 'Perfil actualizado correctamente',
            data: updatedPerson
        });

    } catch (error) {
        res.status(500).json({ message: 'Error actualizando perfil', error });
    }
});

// DELETE /delete-profile/:id
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

// Ruta base de prueba
app.get('/', (req: Request, res: Response) => {
    res.send('Microservicio CRUD funcionando con JWT y Docker 🚀');
});

app.listen(port, () => {
    console.log(`[server]: Servidor corriendo en puerto ${port}`);
});