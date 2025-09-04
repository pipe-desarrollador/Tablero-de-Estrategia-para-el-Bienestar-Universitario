# 📖 Manual de Usuario - Tablero de Estrategia para el Bienestar Universitario

## 🎯 Introducción

El **Tablero de Estrategia para el Bienestar Universitario** es un sistema de soporte a la decisión (DSS) diseñado para ayudar a la administración universitaria a tomar decisiones informadas sobre la asignación de recursos para programas de bienestar y apoyo estudiantil.

## 🚀 Características del Sistema de Ayuda

### 1. **Sistema de Ayuda Integrado**
- **Botón de ayuda flotante**: Aparece en todas las páginas (esquina inferior derecha)
- **Manual interactivo**: Tour guiado paso a paso por cada sección
- **Ayuda contextual**: Tooltips informativos en elementos clave
- **Tips rápidos**: Consejos específicos para cada sección

### 2. **Modal de Bienvenida**
- Se muestra automáticamente a nuevos usuarios
- Introducción de 4 pasos al sistema
- Opción de iniciar tour guiado
- Se recuerda la preferencia del usuario

## 📋 Guía de Navegación

### 🏠 **Página de Inicio**
**Propósito**: Dashboard principal con métricas clave y resumen ejecutivo

**Elementos principales**:
- **Tarjetas KPI**: Muestran el promedio de estrés actual y los 3 factores más críticos
- **Gráfico de tendencias**: Evolución de los niveles de estrés a lo largo del tiempo
- **Botones de navegación**: Acceso rápido a otras secciones

**Cómo usar**:
1. Revisa las métricas clave en las tarjetas superiores
2. Analiza la tendencia temporal en el gráfico
3. Usa los botones para explorar factores o análisis comparativos

### 📊 **Análisis Comparativo**
**Propósito**: Compara el rendimiento entre Universidad de Caldas y otras universidades

**Elementos principales**:
- **Gráfico de poder comparativo**: Visualiza diferencias en niveles de estrés
- **Impacto de soluciones**: Muestra cómo diferentes intervenciones afectan el estrés
- **Resumen ejecutivo**: Recomendaciones estratégicas para toma de decisiones

**Cómo usar**:
1. Observa las diferencias entre universidades en el gráfico principal
2. Revisa el impacto de soluciones propuestas
3. Consulta el resumen ejecutivo para recomendaciones

### 🎯 **Factores Clave**
**Propósito**: Identifica los factores que más impactan el bienestar estudiantil

**Elementos principales**:
- **Gráfico de promedio Likert**: Intensidad promedio de cada factor (escala 1-5)
- **Gráfico de %≥4**: Porcentaje de estudiantes con niveles altos de estrés
- **Comparación por universidad**: Diferentes grupos de universidades

**Cómo interpretar**:
- Factores con valores altos en ambos gráficos requieren atención prioritaria
- Compara entre universidades para identificar patrones
- Usa esta información para priorizar intervenciones

### 🔮 **Simulaciones (What-If)**
**Propósito**: Simula el impacto de diferentes inversiones en programas de bienestar

**Elementos principales**:
- **Filtro por universidad**: Selecciona el grupo a analizar
- **Controles de intervención**: Sliders para ajustar inversiones en:
  - Programas de tutoría académica
  - Higiene del sueño / salud mental
  - Apoyo financiero
- **Efectividad del modelo**: Control global de efectividad (0-100%)
- **Resultados**: Baseline vs escenario con delta de cambio

**Cómo usar**:
1. Selecciona el grupo de universidad a analizar
2. Ajusta los sliders para simular diferentes niveles de inversión
3. Observa cómo cambia el índice %≥4 en tiempo real
4. Analiza el delta para ver el impacto esperado

### 📁 **Carga de Datos & Reportes**
**Propósito**: Gestiona la carga de datasets y herramientas de administración

**Elementos principales**:
- **Carga de archivos CSV**: Sube datasets de encuestas de estrés
- **Herramientas de administración**: Ver estructura de tabla y limpiar BD
- **Resultados de carga**: Información sobre registros procesados y normalización

**Formatos soportados**:
- `Stress_Dataset.csv`
- `StressLevelDataset.csv`
- `Encuestas_UCaldas.csv`

**Cómo usar**:
1. Selecciona un archivo CSV compatible
2. Haz clic en "Subir Archivo"
3. Revisa los resultados de la carga
4. Usa las herramientas de administración según necesidad

## 🛠️ Funcionalidades del Sistema de Ayuda

### **Botón de Ayuda Flotante**
- **Ubicación**: Esquina inferior derecha de todas las páginas
- **Funciones**:
  - Abrir manual completo con tour guiado
  - Mostrar tips rápidos específicos de la sección actual
  - Acceso rápido a información contextual

### **Manual Interactivo**
- **Acceso**: Botón de ayuda flotante o navbar
- **Características**:
  - Tour guiado paso a paso por cada sección
  - Resaltado visual de elementos importantes
  - Navegación entre pasos con progreso visual
  - Opción de saltar o finalizar en cualquier momento

### **Ayuda Contextual**
- **Tooltips informativos**: Aparecen al hacer hover sobre elementos con indicador "?"
- **Información específica**: Explicaciones detalladas de cada funcionalidad
- **Posicionamiento inteligente**: Se adaptan al espacio disponible

### **Tips Rápidos**
- **Contenido específico**: Consejos adaptados a cada sección
- **Acceso rápido**: Desde el botón de ayuda flotante
- **Información práctica**: Cómo interpretar y usar cada funcionalidad

## 🎨 Mejores Prácticas de Uso

### **Para Administradores**
1. **Comienza con el tour**: Usa el manual interactivo para familiarizarte
2. **Carga datos primero**: Ve a Reportes para subir datasets
3. **Analiza tendencias**: Revisa la página de inicio para el panorama general
4. **Identifica problemas**: Usa Factores Clave para priorizar intervenciones
5. **Planifica estrategias**: Usa Simulaciones para evaluar diferentes escenarios
6. **Toma decisiones**: Consulta el Análisis Comparativo para recomendaciones

### **Para Usuarios Nuevos**
1. **Modal de bienvenida**: Lee la introducción completa
2. **Tour guiado**: Inicia el tour interactivo desde cualquier sección
3. **Explora gradualmente**: No intentes usar todas las funciones a la vez
4. **Usa la ayuda**: El botón de ayuda está siempre disponible
5. **Practica**: Carga datos de ejemplo y experimenta con las simulaciones

### **Para Análisis Efectivos**
1. **Datos actualizados**: Mantén los datasets actualizados
2. **Comparaciones consistentes**: Usa los mismos criterios para comparar
3. **Interpretación contextual**: Considera factores externos en tus análisis
4. **Documentación**: Registra las decisiones tomadas basadas en el sistema
5. **Seguimiento**: Monitorea el impacto de las intervenciones implementadas

## 🔧 Solución de Problemas

### **Problemas Comunes**

**No aparecen datos en los gráficos**:
- Verifica que hayas cargado datos en la sección Reportes
- Asegúrate de que el archivo CSV tenga el formato correcto
- Revisa la consola del navegador para errores

**El tour no funciona correctamente**:
- Refresca la página y vuelve a intentar
- Asegúrate de que JavaScript esté habilitado
- Verifica que no haya bloqueadores de pop-ups activos

**Los tooltips no aparecen**:
- Hacer hover sobre elementos con el indicador "?"
- Esperar 500ms para que aparezca el tooltip
- Verificar que el elemento tenga ayuda contextual disponible

### **Contacto y Soporte**
- **Documentación técnica**: Revisa el README.md del proyecto
- **Issues**: Reporta problemas en el repositorio del proyecto
- **Desarrollo**: Este es un proyecto académico de análisis de estrés estudiantil

## 📈 Métricas y KPIs

### **Indicadores Clave**
- **Promedio de estrés**: Nivel general de estrés estudiantil
- **Factores críticos**: Top 3 factores que más afectan a los estudiantes
- **Índice %≥4**: Porcentaje de estudiantes con niveles altos de estrés
- **Tendencias temporales**: Evolución del estrés a lo largo del tiempo

### **Interpretación de Datos**
- **Escala Likert**: 1 (muy bajo) a 5 (muy alto)
- **Niveles de estrés**: %≥4 indica niveles altos de estrés
- **Comparaciones**: Útiles para benchmarking entre universidades
- **Simulaciones**: Proyecciones basadas en modelos estadísticos

---

**Desarrollado con ❤️ para el análisis y mejora del bienestar universitario**

*Este manual está integrado en el sistema y se actualiza automáticamente con nuevas funcionalidades.*
