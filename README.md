# Prueba_Tecnica
Repositorio Backend para la prueba tecnica del BPD.

# Objetivo
Es crear 2 microservicios que uno de esto se encargue de la creacion y modificacion de los datos y el otro microservicio se encargue de la lectura de los datos.

# Tecnologias
- TypeScript (node.js)
- MongoDB
- Docker
- API Rest
- Kubernetes
- JWT

## Estructura del Proyecto

* `microservice-crud` (Puerto 3000): Encargado de Crear (POST), Actualizar (PUT) y Borrar (DELETE).
* `microservice-read` (Puerto 3002): Encargado exclusivamente de la Lectura (GET).
* `database`: Instancia compartida de MongoDB.

## Instalación y Ejecución

### Pre-requisitos
* Docker Desktop instalado y corriendo.

### Pasos para levantar el sistema
1.  Clonar el repositorio.
2.  Ubicarse en la raíz del proyecto.
3.  Ejecutar el siguiente comando para construir y levantar los servicios:
docker-compose up --build

## Ejecución en Kubernetes

El proyecto incluye configuración para orquestación en K8s.

1. Asegurar que Kubernetes está activo en Docker Desktop.
2. Construir las imágenes:
   `docker build -t my-crud-image:v1 ./microservice-crud`
   `docker build -t my-read-image:v1 ./microservice-read`
3. Desplegar:
   `kubectl apply -f k8s/`