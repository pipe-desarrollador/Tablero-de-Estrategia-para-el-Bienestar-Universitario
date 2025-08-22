# 🧠 Backend - API de Dataset de Estrés Estudiantil

## 📋 Descripción

Backend desarrollado en Node.js para gestionar datasets de estrés estudiantil. La API permite cargar archivos CSV, procesar datos y almacenarlos en PostgreSQL, con documentación completa en Swagger.

## 🚀 Características

- **📤 Carga de archivos CSV** con detección automática de formato
- **🗄️ Base de datos PostgreSQL** para almacenamiento robusto
- **🔍 Documentación Swagger** completa e interactiva
- **🔄 API RESTful** con endpoints bien definidos
- **⚡ Procesamiento eficiente** de datasets grandes
- **🛡️ Manejo de errores** robusto con transacciones

## 🏗️ Arquitectura

```
├── server.js              # Servidor principal
├── package.json           # Dependencias del proyecto
├── upload.html            # Interfaz web básica
├── .gitignore            # Archivos a excluir
└── README.md             # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **Swagger** - Documentación de API
- **Multer** - Manejo de archivos
- **csv-parser** - Procesamiento de CSV

## 📦 Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- PostgreSQL
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio:**
```bash
git clone [URL_DEL_REPOSITORIO]
cd [NOMBRE_DEL_REPO]/backend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar base de datos:**
   - Crear base de datos PostgreSQL llamada `stress_db`
   - Usuario: `postgres`
   - Contraseña: `admin123`
   - Puerto: `5432`

4. **Ejecutar el servidor:**
```bash
npm start
```

## 🌐 Endpoints de la API

### 📤 POST `/api/upload-dataset`
**Cargar y procesar archivo CSV**
- **Content-Type:** `multipart/form-data`
- **Parámetro:** `file` (archivo CSV)
- **Soporta:** `Stress_Dataset.csv` y `StressLevelDataset.csv`

### 📊 GET `/api/stats`
**Obtener estadísticas de la base de datos**
- **Respuesta:** Número total de registros y mensaje informativo

### 🔍 GET `/api/table-structure`
**Ver estructura de las tablas**
- **Respuesta:** Esquema completo de la tabla `survey_responses`

### 🗑️ DELETE `/api/clear-data`
**Limpiar todos los datos**
- **⚠️ ADVERTENCIA:** Acción irreversible

### 📚 GET `/api-docs`
**Documentación Swagger**
- **Interfaz interactiva** para probar todos los endpoints

## 📁 Estructura de Datos

### Tabla: `survey_responses`
```sql
- gender (varchar)
- age (integer)
- stress_experience (varchar)
- palpitations (varchar)
- anxiety (varchar)
- sleep_problems (varchar)
- anxiety_duplicate (varchar)
- headaches (varchar)
- irritability (varchar)
- concentration_issues (varchar)
- sadness (varchar)
- illness (varchar)
- loneliness (varchar)
- academic_overload (varchar)
- competition (varchar)
- relationship_stress (varchar)
- professor_difficulty (varchar)
- work_environment (varchar)
- leisure_time (varchar)
- home_environment (varchar)
- low_confidence_performance (varchar)
- low_confidence_subjects (varchar)
- academic_conflict (varchar)
- class_attendance (varchar)
- weight_change (varchar)
- stress_type (varchar)
- id (serial, primary key)
```

## 🔧 Configuración

### Variables de entorno (opcional)
```bash
DB_USER=postgres
DB_HOST=localhost
DB_NAME=stress_db
DB_PASSWORD=admin123
DB_PORT=5432
PORT=3000
```

### Configuración de base de datos
```javascript
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stress_db',
  password: 'admin123',
  port: 5432,
});
```

## 🧪 Uso de la API

### 1. **Probar con Swagger:**
- Ve a `http://localhost:3000/api-docs`
- Explora todos los endpoints
- Prueba funcionalidades directamente

### 2. **Cargar dataset:**
```bash
curl -X POST \
  http://localhost:3000/api/upload-dataset \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@Stress_Dataset.csv'
```

### 3. **Ver estadísticas:**
```bash
curl http://localhost:3000/api/stats
```

## 📊 Formatos de Archivo Soportados

### Stress_Dataset.csv
- Columnas: Gender, Age, preguntas de estrés
- Separador: `;` (punto y coma)
- Mapeo automático a la base de datos

### StressLevelDataset.csv
- Columnas: anxiety_level, stress_level, etc.
- Separador: `;` (punto y coma)
- Mapeo automático a la base de datos

## 🚀 Despliegue

### Desarrollo local
```bash
npm start
# o
node server.js
```

### Producción
```bash
npm install --production
NODE_ENV=production node server.js
```

## 🤝 Colaboración

### Para el equipo de Frontend:
- **Base URL:** `http://localhost:3000`
- **Documentación:** `/api-docs`
- **Endpoints principales:** `/api/upload-dataset`, `/api/stats`
- **Formato de respuesta:** JSON estándar
- **Manejo de errores:** Códigos HTTP apropiados

### Estructura de respuestas:
```json
{
  "message": "Mensaje descriptivo",
  "data": "Datos de la respuesta",
  "status": "success/error"
}
```

## 📝 Scripts Disponibles

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

## 🔍 Troubleshooting

### Problemas comunes:
1. **Error de conexión a PostgreSQL:**
   - Verificar que PostgreSQL esté ejecutándose
   - Confirmar credenciales de base de datos

2. **Error de puerto ocupado:**
   - Cambiar puerto en `server.js`
   - Verificar que no haya otros servicios usando el puerto 3000

3. **Error de permisos de archivo:**
   - Verificar permisos de escritura en el directorio
   - Confirmar que el usuario tenga acceso a PostgreSQL

## 📞 Soporte

Para dudas o problemas:
- Revisar logs del servidor
- Consultar documentación Swagger
- Verificar configuración de base de datos

## 📄 Licencia

Este proyecto es parte del trabajo académico sobre análisis de estrés estudiantil.

---

**Desarrollado con ❤️ para el análisis de datos de estrés estudiantil**
