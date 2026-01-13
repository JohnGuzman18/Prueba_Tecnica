import express, { Request, Response } from 'express';
import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

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

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/technical_test';
mongoose.connect(mongoURI)
    .then(() => console.log('MS-READ: Conectado a Mongo 👁️'))
    .catch((err) => console.error('Error conectando a Mongo:', err));

// --- RUTA SEGURA (GET /get-profile) ---
app.get('/get-profile', async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Acceso denegado: Se requiere un Token' });
            return;
        }

        const secretKey = process.env.JWT_SECRET as string;
        if (!secretKey) {
            console.error("ERROR: Faltan variables de entorno JWT_SECRET");
            res.status(500).json({ message: "Error interno del servidor" });
            return;
        }

        const decoded = jwt.verify(token, secretKey) as { id: string, email: string };

        console.log(`Buscando datos para el usuario ID: ${decoded.id}`);
        const person = await Person.findById(decoded.id);

        if (!person) {
            res.status(404).json({ message: 'Perfil no encontrado' });
            return;
        }

        res.json({
            message: 'Perfil encontrado y autorizado',
            data: person,
            auth_info: {
                email_verified: decoded.email,
                msg: "Acceso permitido vía JWT"
            }
        });

    } catch (error) {
        res.status(403).json({ message: 'Token inválido o expirado', error });
    }
});

app.listen(port, () => {
    console.log(`[reader]: Microservicio de LECTURA corriendo en puerto ${port}`);
});