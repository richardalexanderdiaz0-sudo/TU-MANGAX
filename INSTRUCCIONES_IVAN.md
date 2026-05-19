# ¡Hola Ivan! 👋 Bienvenido a Nexus Manga & Manhwa

¡Qué alegría tenerte en el equipo! Este proyecto, **TU MANGAX (Nexus)**, es el fruto de mucho trabajo en el frontend y ahora tú eres el encargado de darle vida con el cerebro de la operación: el **Backend**.

Estamos emocionados de ver cómo este servidor propio que vas a desarrollar potenciará la plataforma.

---

## 🚀 ¿Qué es un Backend?

Para que todos estemos en la misma sintonía:

- **Frontend (Nosotros):** Es todo lo que el usuario ve y toca (botones, diseño, animaciones). Está construido con React, Vite y Tailwind CSS.
- **Backend (Tú):** Es el motor. Se encarga de procesar los datos, manejar la base de datos, gestionar la seguridad y autenticar a los usuarios.

### Tipos de Backend
1. **Backend-as-a-Service (BaaS):** Como Firebase, Supabase o PocketBase. Son servicios listos para usar pero con limitaciones de escalabilidad o costos. **Nosotros hemos decidido movernos de aquí.**
2. **Backend Personalizado (Ese eres tú):** Un servidor propio donde tienes control total. Puedes usar tecnologías como **Node.js con Express**, Python con Django/FastAPI, Go, PHP, etc. Tú decides dónde corre (tu propia PC como servidor o un VPS en la nube).

---

## 🛠️ Cómo conectar tu Backend a esta App

El frontend está configurado para ser "agnóstico" al backend, pero necesita saber a dónde enviar las peticiones.

1. **Variables de Entorno:**
   Hemos creado una variable llamada `VITE_API_URL` en el archivo `.env`. Aquí es donde colocarás la URL de tu servidor (ej: `http://localhost:5000` o `https://tu-servidor.com`).

2. **Servicio Centralizado:**
   Todas las llamadas a la API se gestionan en `src/services/api.ts`. He dejado una estructura limpia basada en `fetch` o `axios` (puedes elegir) para que solo tengas que apuntar a tus rutas.

---

## 📋 Lista de Necesidades (Endpoints)

Tu backend deberá resolver las siguientes funcionalidades para que la app sea 100% funcional:

### 1. Autenticación (`/auth`)
- `POST /auth/register`: Crear un nuevo usuario.
- `POST /auth/login`: Validar credenciales y devolver un Token (JWT recomendado).
- `GET /auth/me`: Obtener los datos del usuario actual mediante el token.

### 2. Gestión de Contenido (`/stories`)
- `GET /stories`: Listar todas las obras (Manga/Manhwa/Comics).
- `POST /stories`: Subir una nueva obra (Título, Sinopsis, Géneros, Imagen de Portada).
- `GET /stories/:id`: Obtener el detalle de una obra específica.
- `DELETE /stories/:id`: Borrar una obra.

### 3. Capítulos y Páginas (`/chapters`)
- `GET /chapters?story_id=ID`: Listar todos los capítulos de una obra.
- `POST /chapters`: Subir un nuevo capítulo (Número de cap, Título, Array de imágenes/páginas).
- `GET /chapters/:id`: Obtener las imágenes de un capítulo específico para el lector.

### 4. Interacción del Usuario
- `POST /library`: Guardar una obra en la biblioteca del usuario.
- `DELETE /library/:id`: Quitar de la biblioteca.
- `GET /library`: Listar la biblioteca del usuario.
- `POST /likes`: Dar like a una obra.
- `POST /comments`: Publicar un comentario o respuesta.
- `GET /comments?chapter_id=ID`: Obtener los comentarios de un capítulo.

---

## 🖼️ Manejo de Archivos (Imágenes)

Como somos una plataforma de lectura, el manejo de imágenes es crítico. Puedes guardarlas localmente en tu servidor (carpeta `/uploads`) o usar servicios de almacenamiento (S3, Cloudinary). Lo único que el frontend necesita es que el endpoint le devuelva la URL completa de la imagen.

---

¡Dale con todo, Ivan! Si tienes dudas sobre el código del frontend, contáctanos. El archivo principal de la lógica se encuentra en `src/App.tsx` y los servicios en `src/services/`.

**¡A darle vida a Nexus!** 🚀💫
