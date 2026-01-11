import mongoose, { Schema, Document } from 'mongoose';

// 1. Definimos la interfaz de TypeScript
// (Esto sirve para que tu código sepa qué propiedades existen y te ayude a autocompletar)
export interface IPerson extends Document {
    firstName: string;
    lastName: string;
    cellphone: number;
    email: string;
    address: string;
}

// 2. Definimos el Esquema de Mongoose
// (Esto sirve para que MongoDB sepa cómo guardar los datos y validar tipos)
const PersonSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    cellphone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true }
});

// 3. Exportamos el modelo
// 'Person' será el nombre de la colección en la base de datos
export default mongoose.model<IPerson>('Person', PersonSchema);