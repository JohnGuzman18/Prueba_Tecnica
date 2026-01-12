import express, { Request, Response } from 'express';
import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv'; // <--- FALTABA ESTO

dotenv.config(); // <--- FALTABA ESTO

const app = express();
const port = process.env.PORT || 3002;

// Definimos el mismo esquema de Persona
interface IPerson extends Document {
    firstName: string;
    lastName: string;
    cellphone: string;
    email: string;
    address: string;
}

const PersonSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    cellphone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
});

const Person = mongoose.model<IPerson>('Person', PersonSchema);

// AHORA SÍ leerá correctamente la variable de entorno de Docker
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/technical_test';

mongoose.connect(mongoURI)
    .then(() => console.log('MS-READ: Conectado a Mongo 👁️'))
    .catch((err) => console.error('Error conectando a Mongo:', err));

// RUTA GET
app.get('/get-profile/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const person = await Person.findById(id);

        if (!person) {
            res.status(404).json({ message: 'Perfil no encontrado' });
            return;
        }

        res.json({
            message: 'Perfil encontrado',
            data: person
        });
    } catch (error) {
        res.status(500).json({ message: 'Error buscando perfil', error });
    }
});

app.listen(port, () => {
    console.log(`[reader]: Microservicio de LECTURA corriendo en puerto ${port}`);
});