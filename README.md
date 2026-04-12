# DALOG Diagnostic Report Manager

Aplicación Front-End diseñada bajo requerimientos *Enterprise* para la gestión, subida y listado de reportes de diagnóstico. Desarrollada con React, Next.js, Zustand y Tailwind CSS.

## 🚀 Cómo ejecutar el proyecto localmente

1. **Instalar dependencias:**
   Asegúrate de tener Node.js 18+ instalado. En la raíz del proyecto ejecuta:
   ```bash
   npm install
   ```

2. **Iniciar Servidor de Desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

3. **Ejecutar Pruebas Unitarias (Vitest):**
   ```bash
   npm run test
   ```

---

## 🏗️ Decisiones de Arquitectura y Patrones

### Arquitectura Horizontal Clásica
El proyecto está organizado categóricamente por la responsabilidad técnica de cada archivo (`components`, `services`, `store`, `types`), proporcionando predictibilidad inmediata para cualquier desarrollador que se una al proyecto, un estándar oro en aplicaciones dinámicas de Next.js.

### Patrones Aplicados y Optimizaciones
1. **Patrón Strategy (`FileProcessor.ts`):** 
   Se usó un patrón *Strategy* administrado por una fábrica (`FileProcessorFactory`) que desacopla la lógica de validación e ingesta. Si el día de mañana se soporta un nuevo modelo propietario además de PDF o DICOM, solo se escribe una nueva estrategia sin mutar el código principal del formulario (*Open/Closed Principle*).
2. **Web Worker para Filtrado (`searchWorker.ts`):**
   Dado que los reportes médicos suelen representar listas masivas, la búsqueda en tiempo real fue sacada el hilo principal (Main Thread) del navegador hacia un Worker dedicado, manteniendo la UI de React siempre a 60fps sin bloqueos.
3. **Estado Global con Zustand:**
   Elegido sobre Redux por su nulo *boilerplate* y alto rendimiento computacional al no requerir un `Provider` que envuelva el árbol de la aplicación.
4. **Code Splitting (`next/dynamic`):**
   Los componentes pesados visuales que atrapan los archivos o listas densas se cargan de forma perezosa (`lazy loading` con SSR apagado).

---