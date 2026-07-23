# GreatBook Library

App multiplataforma para publicación y lectura de novelas, fanfics y poesía.

---

## ¿Qué es?

GreatBook Library es una plataforma donde publico obras de mi autoría (y próximamente de más escritores). Es una librería virtual en desarrollo activo, pensada para ofrecer una experiencia de lectura cómoda tanto en web como en app de escritorio.

Actualmente incluye obras como *SNV: Duel of Legends*, *Spider-Man: Golden*, *Duelo de Corazones*, *Stellaris* y *Odas Esenciales* — y se sigue expandiendo con nuevos capítulos, obras y funcionalidades.

---

## ¿Dónde se puede usar?

### 🌐 Web (Netlify)
[https://greatbook-library.netlify.app](https://greatbooklibrary.netlify.app)

Funciona en cualquier navegador. Además, es instalable como aplicación (PWA) — en el celular se puede agregar a la pantalla de inicio y leer sin internet.

### 🖥️ App de escritorio
Disponible para **Linux** (AppImage) y **Windows** (Instalador + Portable).

Descargas directas desde la web, o desde [GitHub Releases](https://github.com/Wastermanlord/GreatBook-Library/releases).

---

## Actualizaciones automáticas

La app de escritorio cuenta con **auto-updater**: al abrirla, verifica si hay una versión más nueva en GitHub. Si la hay, puedes descargar e instalar la actualización con un clic — sin volver a descargar manualmente.

Solo funciona en la versión empaquetada (no en desarrollo).

---

## Funcionalidades

- **Dark mode** — Tema oscuro/claro con persistencia
- **Posición de lectura** — Guarda el porcentaje de avance por capítulo
- **Barra de progreso** — Línea dorada que avanza con el scroll
- **Tamaño de fuente ajustable** — Niveles A+/A− guardados entre sesiones
- **Atajos de teclado** — Flechas ← → para navegar entre capítulos
- **Transiciones suaves** — Fade entre páginas al navegar
- **Menú móvil circular** — Navegación adaptativa con animación
- **Ventana persistente** — La app recuerda tamaño y posición
- **Instancia única** — No se abre múltiples ventanas
- **Tray icon** — Minimiza a la bandeja del sistema
- **Capítulos leídos** — Check dorado en los visitados
- **CSP (seguridad)** — Cabeceras de seguridad en app y web
- **PWA** — Instalable en celulares con soporte offline
- **SEO** — Meta tags, Open Graph, sitemap, robots.txt

---

## Estructura del proyecto

```
GreatBook App/
├── app/                  # Contenido del sitio/app
│   ├── index.html        # Página principal
│   ├── catalogo.html     # Catálogo de libros
│   ├── noticias.html     # Novedades y actualizaciones
│   ├── descargas.html    # Descarga de la app
│   ├── terminos.html     # Términos y condiciones
│   ├── 404.html          # Página no encontrada
│   ├── offline.html      # Vista sin conexión
│   ├── *.html            # Libros y capítulos
│   ├── poster/           # Portadas de libros
│   ├── dsapp/            # Instaladores para descarga
│   ├── style.css         # Estilos globales
│   ├── responsivo.js     # Lógica frontend
│   ├── manifest.json     # PWA manifest
│   └── sw.js             # Service Worker
├── templates/            # Plantillas para generar capítulos
├── tools/                # Script de generación de capítulos
├── main.js               # Proceso principal de Electron
├── preload.js            # Puente Electron → frontend
├── electron-builder.yml  # Configuración de empaquetado
├── netlify.toml          # Configuración de despliegue
└── package.json          # Dependencias y scripts
```

---

## Tecnologías

- **Electron** — App de escritorio
- **HTML + CSS + JS** — Frontend
- **electron-builder** — Empaquetado y distribución
- **electron-updater** — Actualizaciones automáticas desde GitHub
- **Netlify** — Hosting web con despliegue continuo desde GitHub

---

## Licencia

MIT — el código es libre. Las obras literarias son propiedad de sus respectivos autores.
