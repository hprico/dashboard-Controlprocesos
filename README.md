# 📊 Dashboard de Control de Procesos
Dashboard de los procesos ejecutados diariamente

## 📌 Descripción general

Este proyecto contiene un **dashboard web interactivo** para el **seguimiento y monitoreo de procesos ejecutados**, a partir de información cargada diariamente en un archivo CSV.

El dashboard permite visualizar de forma clara y ejecutiva:
- El volumen de procesos ejecutados
- Estados de ejecución (terminados / errores)
- Tiempos mínimos y máximos de duración
- Distribución por servidores y bases de datos
- Identificación de procesos más costosos en tiempo

La solución está construida con **HTML, CSS y JavaScript**, y se publica como **sitio estático mediante GitHub Pages**, lo que permite compartir una URL sin necesidad de servidores adicionales ni permisos administrativos.

---

## 🎯 Objetivo

Brindar una herramienta visual que facilite:
- El **control operativo diario**
- La **detección temprana de errores**
- El análisis de **cargas y tiempos de ejecución**
- La **toma de decisiones** en áreas de TI, infraestructura y bases de datos

---

## 🧹 Características principales

- ✅ Dashboard web 100 % estático
- ✅ Actualización diaria mediante archivo CSV
- ✅ KPIs destacados en tarjetas visuales
- ✅ Gráficos interactivos (Plotly)
- ✅ Tabla detallada con filtros y búsqueda
- ✅ Fecha de actualización tomada directamente de la data
- ✅ Publicación por URL con GitHub Pages
- ✅ Automatización de carga del CSV mediante script `.bat`

---

## 🧾 Estructura del proyecto

dashboard-Controlprocesos/
│
├── index.html                # Página principal del dashboard
├── README.md                 # Documentación del proyecto
│
├── data/
│   └── Controlprocesos_neps.csv   # Archivo CSV con la data actual
│
└── assets/
├── css/
│   └── estilos.css       # Estilos visuales del dashboard
│
├── js/
│   └── dashboard.js      # Lógica del dashboard (gráficos, KPIs)
│
└── img/
└── Infra-BD.jpg      # Logo institucional

---

## 📈 Información mostrada en el Dashboard

### 🔹 KPIs principales
- ✅ **Total de procesos**
- ❌ **Procesos con error**
- ⏱ **Tiempo mínimo de ejecución (min)**
- ⏱ **Tiempo máximo de ejecución (min)**

### 🔹 Gráficos
- Procesos por estado
- Procesos por servidor
- **Top 10 procesos con mayor duración**
- **Top 7 bases de datos + Otras**

### 🔹 Fecha de actualización
La fecha mostrada en el dashboard corresponde a la **fecha más reciente encontrada en el campo `FECHAINICIO`** del archivo CSV, y se presenta en formato **DD/MM/YYYY**.

---

## 🔄 Actualización de la información

El dashboard utiliza un archivo con nombre fijo: data/Controlprocesos_neps.csv

### Flujo de actualización diario:
1. Se genera o reemplaza el archivo CSV con la información del día
2. Se ejecuta un script `.bat` de automatización
3. El CSV se sube al repositorio GitHub
4. GitHub Pages actualiza automáticamente el dashboard
5. Los usuarios solo deben refrescar la página

---

## ⚙️ Automatización (.bat)

El proyecto incluye la posibilidad de automatizar la carga del CSV mediante un script en Windows (`.bat`), el cual:
- Agrega el archivo CSV al control de versiones
- Realiza el commit con fecha automática
- Publica los cambios en GitHub con un solo clic

Esto permite una **operación diaria sencilla y rápida**, sin necesidad de ejecutar comandos manuales.

---

## 🌐 Publicación y acceso

El dashboard se encuentra publicado mediante **GitHub Pages**, lo que permite el acceso a través de una URL estándar: https://.github.io//

No se requieren instalaciones adicionales para los usuarios finales.

---

## 🛠️ Tecnologías utilizadas

- **HTML5**
- **CSS3**
- **JavaScript**
- **Plotly.js** (gráficos interactivos)
- **PapaParse.js** (lectura de CSV)
- **DataTables** (tabla dinámica)
- **GitHub Pages** (publicación)

---

## 👤 Autor / Responsable

**Herbert Prieto Corredor**  

---

## 📄 Notas finales

Este proyecto está diseñado para ser:
- Fácil de mantener
- Escalable
- Reutilizable para otros controles operativos
- Independiente de servidores o licencias propietarias
  
