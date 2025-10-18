# Lab API + Worker + PostgreSQL (Docker Compose)

Aplicación de laboratorio para Web III: API REST en Node.js + Worker programado con node-cron, persistiendo datos en PostgreSQL, todo orquestado con Docker Compose.

## Descripción

Este proyecto implementa un stack completo donde:
- Un **API REST** en Node.js expone endpoints para consultar productos almacenados en PostgreSQL.
- Un **worker** (servicio programado con node-cron) consume datos de [dummyjson.com](https://dummyjson.com/) y los inserta en la base de datos, evitando duplicados.
- Todo el entorno se ejecuta en contenedores Docker, incluyendo la base de datos y Adminer para administración visual.

## Estructura del proyecto
```
lab-api-worker/
├── .env
├── README.md
├── docker-compose.yml
├── api/
│ ├── Dockerfile
│ ├── package.json
│ └── server.js
└── worker/
├── Dockerfile
├── package.json
└── worker.js
```

## Instalación y uso

### 1. Clona el repositorio

git clone https://github.com/JaimeCordero26/Api-Worker.git
cd lab-api-worker

### 2. Configura variables de entorno

Edita el archivo `.env` si deseas cambiar credenciales o la frecuencia del worker (por defecto cada minuto):
```
POSTGRES_DB=labdb
POSTGRES_USER=app
POSTGRES_PASSWORD=app
DB_HOST=db
DB_PORT=5432
DB_SSL=false
CRON=*/1 * * * *
```
### 3. Construye e inicia los servicios
docker compose up -d --build

Esto levantará:
- PostgreSQL 16 (servicio `db`)
- Adminer (servicio `adminer`)
- API Node.js (servicio `api`)
- Worker Node.js (servicio `worker`)

### 4. Verifica el funcionamiento

- **API Health:**  
curl http://localhost:3000/api/health
Respuesta esperada: {"ok":true}


- **Consulta productos:**  
curl http://localhost:3000/api/products
Devuelve los últimos 50 productos insertados

- **Adminer:**  
Accede a [http://localhost:8080](http://localhost:8080)  
- Server: `db`
- User: `app`
- Password: `app`
- Database: `labdb`

### 5. Detener los servicios

docker compose down

## Detalles técnicos

- El worker ejecuta cada minuto (o según el CRON configurado) una consulta a la API externa y realiza inserciones en la tabla `products`, usando `ON CONFLICT (external_id) DO NOTHING` para evitar duplicados.
- El API expone dos endpoints:
  - `/api/health` para verificación de estado.
  - `/api/products` para obtener los productos almacenados.

## Dependencias principales

- Node.js 20 (alpine)
- Express
- node-cron
- node-fetch
- pg (PostgreSQL client)
- PostgreSQL 16
- Adminer

## Buenas prácticas

- Código comentado y estructurado.
- Uso de variables de entorno para credenciales y configuración.
- Persistencia de datos en volumen Docker.
- Detección y prevención de duplicados por `external_id`.

## Evidencias

Incluye capturas de pantalla del funcionamiento de los endpoints y la interfaz de Adminer en la carpeta `/screenshots` (agrega tus imágenes antes de subir).

## Autor

- Nombre: Alejandro Cordero
- Curso: Web III
- Universidad: Universidad Tecnica Nacional

---
