# 🚀 Guía de Despliegue para Demostración en Vivo

## 📋 Resumen de la Estrategia

**Frontend (React):** Vercel - Gratuito, fácil configuración
**Backend (Node.js):** Railway - Gratuito con límites generosos
**Base de Datos:** PostgreSQL en Railway

## 🎯 Paso 1: Preparar el Proyecto para Producción

### 1.1 Configurar Variables de Entorno

Crear archivo `.env.production` en el backend:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://usuario:password@host:puerto/database
```

### 1.2 Actualizar package.json del Backend
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

### 1.3 Configurar CORS para Producción
En `backend/src/app.js`, actualizar CORS:
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-app.vercel.app'] 
    : ['http://localhost:5173'],
  credentials: true
};
app.use(cors(corsOptions));
```

## 🎯 Paso 2: Desplegar Backend en Railway

### 2.1 Crear cuenta en Railway
1. Ve a [railway.app](https://railway.app)
2. Conecta tu cuenta de GitHub
3. Selecciona tu repositorio

### 2.2 Configurar Variables de Entorno en Railway
```
NODE_ENV=production
PORT=3000
```

### 2.3 Configurar Base de Datos
1. En Railway, agrega un servicio PostgreSQL
2. Copia la URL de conexión
3. Agrégala como variable `DATABASE_URL`

### 2.4 Configurar Scripts de Inicio
Railway detectará automáticamente el `package.json` y ejecutará `npm start`

## 🎯 Paso 3: Desplegar Frontend en Vercel

### 3.1 Crear cuenta en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa tu repositorio

### 3.2 Configurar Build Settings
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 3.3 Configurar Variables de Entorno
```
VITE_API_URL=https://tu-backend.railway.app
```

### 3.4 Actualizar API URL en el Frontend
En `frontend/src/lib/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

## 🎯 Paso 4: Preparar Datos de Demostración

### 4.1 Crear Script de Datos de Prueba
```javascript
// scripts/seed-demo-data.js
const { Pool } = require('pg');

const demoData = [
  {
    gender: 'F',
    age: 20,
    sleep_problems: '4',
    headaches: '3',
    concentration_issues: '4',
    irritability: '3',
    palpitations: '2',
    sadness: '3',
    anxiety: '4',
    stress_type: 'Académico',
    source: 'Demo_Data'
  },
  // ... más datos de ejemplo
];
```

### 4.2 Ejecutar Script en Producción
```bash
# En Railway, ejecutar en la consola
node scripts/seed-demo-data.js
```

## 🎯 Paso 5: Configurar Dominio Personalizado (Opcional)

### 5.1 Vercel
- Ve a Project Settings > Domains
- Agrega tu dominio personalizado

### 5.2 Railway
- Ve a Settings > Domains
- Configura subdominio personalizado

## 🎯 Paso 6: Monitoreo y Mantenimiento

### 6.1 Logs
- **Vercel:** Dashboard > Functions > Logs
- **Railway:** Dashboard > Deployments > Logs

### 6.2 Métricas
- **Vercel:** Analytics en el dashboard
- **Railway:** Métricas de uso en el dashboard

## 🎯 URLs Finales

- **Frontend:** `https://tu-app.vercel.app`
- **Backend:** `https://tu-backend.railway.app`
- **API Docs:** `https://tu-backend.railway.app/api-docs`

## 🎯 Actualizar README

Agregar sección de demostración en vivo:
```markdown
## 🌐 Demostración en Vivo

- **Aplicación:** [https://tu-app.vercel.app](https://tu-app.vercel.app)
- **API Docs:** [https://tu-backend.railway.app/api-docs](https://tu-backend.railway.app/api-docs)
- **Repositorio:** [GitHub](https://github.com/tu-usuario/tu-repo)
```

## 🎯 Costos

- **Vercel:** Gratuito (hasta 100GB bandwidth/mes)
- **Railway:** Gratuito (hasta $5 de crédito/mes)
- **Total:** $0/mes para demostración

## 🎯 Ventajas de esta Configuración

1. **Gratuito:** Sin costos para demostración
2. **Escalable:** Fácil upgrade cuando sea necesario
3. **Profesional:** URLs limpias y confiables
4. **Automático:** Deploy automático con cada push
5. **Monitoreo:** Logs y métricas incluidas
