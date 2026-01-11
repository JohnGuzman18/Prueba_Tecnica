# Usamos una imagen ligera de Node
FROM node:18-alpine

# Creamos una carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias primero (para aprovechar el caché)
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de tu código fuente
COPY . .

# Comando para iniciar tu app (asegúrate de que en tu package.json tengas un script "start" o "dev")
# Si usas ts-node directamente:
CMD ["npm", "start"]