# 🚀 TaskFlow | Gestión de Tareas de Alto Rendimiento

**TaskFlow** es una plataforma SaaS moderna diseñada para la gestión de tareas con una experiencia de usuario de primer nivel. Inspirada en la estética de herramientas líderes como Linear y Vercel, esta aplicación combina velocidad extrema, diseño minimalista y una infraestructura robusta basada en Supabase y Next.js.

---

## ✨ Características Principales

### 🎨 Experiencia de Usuario (UX/UI) Premium
- **Estética High-End**: Diseño basado en `glassmorphism`, bordes sutiles, sombras dinámicas y efectos de desenfoque de fondo.
- **Modo Oscuro/Claro**: Sistema de temas nativo con persistencia y detección automática de preferencias del sistema.
- **Interacciones Fluidas**: Animaciones escalonadas y transiciones suaves impulsadas por **Framer Motion**.
- **Responsive & Mobile-First**: Experiencia optimizada para dispositivos móviles con una interfaz que se siente como una aplicación nativa.

### ⚡ Rendimiento y Funcionalidad
- **Optimistic Updates**: Las acciones de crear, completar, editar y eliminar tareas son instantáneas en la interfaz, eliminando cualquier sensación de latencia.
- **Edición en Tiempo Real**: Permite corregir títulos de tareas directamente desde la lista con una interfaz intuitiva.
- **Historial de Cambios**: Registro visual de la última modificación de cada tarea, incluyendo quién y cuándo se realizó.
- **Notificaciones Elegantes**: Sistema de notificaciones tipo "toast" mediante **Sonner** para feedback inmediato.

### 🔐 Seguridad y Autenticación
- **Supabase Auth**: Sistema completo de registro e inicio de sesión con confirmación por correo electrónico.
- **Seguridad RLS (Row Level Security)**: Los datos están protegidos a nivel de base de datos; cada usuario solo puede acceder y modificar sus propias tareas.
- **Gestión de Perfiles**: Los usuarios pueden personalizar su identidad subiendo fotos a **Supabase Storage** y cambiando su nombre de usuario.

---

## 🛠️ Stack Tecnológico

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/).
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) (Configuración CSS-first).
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/).
- **Base de Datos & Auth**: [Supabase](https://supabase.com/) (PostgreSQL).
- **Almacenamiento**: Supabase Storage (Bucket para avatares).
- **Iconografía**: [Lucide React](https://lucide.dev/).
- **Notificaciones**: [Sonner](https://sonner.emilkowal.ski/).

---

## 🚀 Guía de Instalación Local

1. **Clonar y Preparar**:
   ```bash
   npm install
   ```

2. **Configurar Supabase**:
   - Crea un proyecto en [Supabase](https://supabase.com).
   - Ejecuta el archivo `schema.sql` en el SQL Editor de Supabase.
   - Crea un bucket de almacenamiento **público** llamado `avatars`.

3. **Variables de Entorno**:
   Crea un archivo `.env.local` en la raíz con:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_llave_anon_de_supabase
   ```

4. **Ejecutar**:
   ```bash
   npm run dev
   ```

---

## 📂 Estructura del Proyecto

```text
src/
├── app/            # Rutas y páginas (Home, Dashboard, Profile)
├── components/     # Componentes de UI, Layout y Autenticación
├── context/        # Manejo de estado global (Tema)
├── lib/            # Clientes de Supabase y utilidades
└── middleware.ts   # Gestión de sesiones y protección de rutas
```

---

## ⚖️ Licencia y Créditos

Este proyecto ha sido desarrollado con los más altos estándares de calidad por:
**Jose Miguel Orozco Martinez**

&copy; 2026 TaskFlow Platform. Todos los derechos reservados.
