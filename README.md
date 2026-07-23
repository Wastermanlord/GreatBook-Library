# GreatBook Library

App multiplataforma para publicación y lectura de novelas, fanfics y poesía.  
Web + Escritorio (Windows/Linux) + PWA Android.

---

## ¿Qué es?

GreatBook Library es una plataforma donde publico obras de mi autoría (y próximamente de más escritores). Es una librería virtual en desarrollo activo, pensada para ofrecer una experiencia de lectura cómoda tanto en web como en app de escritorio.

Actualmente incluye obras como *SNV: Duel of Legends*, *Spider-Man: Golden*, *Duelo de Corazones*, *Stellaris* y *Odas Esenciales* — y se sigue expandiendo con nuevos capítulos, obras y funcionalidades.

---

## ¿Dónde se puede usar?

### 🌐 Web (Netlify)
[https://greatbooklibrary.netlify.app](https://greatbooklibrary.netlify.app)

Funciona en cualquier navegador. Además, es instalable como PWA — en Android se puede agregar a la pantalla de inicio y toda la biblioteca se descarga automáticamente para leer sin internet.

### 🖥️ App de escritorio
Disponible para **Linux** (AppImage) y **Windows** (Instalador NSIS + Portable).

Descargas directas desde la [página de descargas](https://greatbooklibrary.netlify.app/descargas.html) o desde [GitHub Releases](https://github.com/Wastermanlord/GreatBook-Library/releases).

---

## Funcionalidades

### Lectura
- **Panel de ajustes (⚙):** Control de tamaño de fuente (6 niveles), tipo de fuente (Serif/Sans) y tema (☀️/🌙). Persiste entre sesiones.
- **Posición de lectura:** Guarda el porcentaje de avance por capítulo y lo restaura al volver.
- **Barra de progreso:** Línea dorada en la parte superior que avanza con el scroll.
- **Atajos de teclado:** Flechas ← → para navegar entre capítulos al instante.
- **Transiciones suaves:** Fade entre páginas al navegar.
- **Continuar leyendo:** En la página principal aparecen las lecturas recientes con acceso directo al último capítulo.
- **Navegación entre capítulos:** Botones circulares con flechas (anterior/siguiente) e inicio.
- **Capítulos leídos:** Check dorado en los capítulos ya visitados.

### Catálogo y búsqueda
- **Filtro por estado:** Botones Todos / En progreso / Pausado.
- **Búsqueda por título:** Filtro en vivo mientras escribes.

### PWA / Offline
- **Instalable:** Banner de instalación PWA en dispositivos compatibles.
- **Precarga total:** Al instalar la PWA se descargan todos los capítulos, portadas y recursos — la biblioteca entera funciona sin internet.
- **Service Worker:** Estrategia mixta (network-first para HTML, cache-first para CSS/imágenes, stale-while-revalidate para JS).
- **Página offline personalizada:** Vista cuando no hay conexión.
- **Banner sin conexión:** Aviso visual al perder internet.

### App de escritorio (Electron)
- **Auto-updater:** Verifica e instala nuevas versiones desde GitHub con un clic.
- **Auto-update de contenido:** Descarga automática de nuevos capítulos sin reinstalar la app.
- **Tray icon:** Minimiza a la bandeja del sistema al cerrar.
- **Ventana persistente:** Recuerda tamaño y posición entre sesiones.
- **Instancia única:** No se abre múltiples ventanas.
- **Seguridad CSP:** Cabeceras de seguridad.

### Interfaz
- **Menú responsive:** Menú desktop + menú móvil circular con animación.
- **Elementos flotantes:** Se ocultan automáticamente al abrir el menú móvil.
- **Placeholder de imágenes:** Si una portada no carga, se muestra un ícono en lugar del recuadro roto.
- **Navegación unificada:** Todas las páginas comparten los mismos enlaces (Inicio, Catálogo, Noticias, Términos, Descargar).

### Web (SEO)
- Meta tags, Open Graph, sitemap.xml, robots.txt.
- Google Fonts optimizadas con preconnect.
- Cabeceras de seguridad (CSP, X-Frame-Options, etc.).
- Cache inmutable para assets estáticos.

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
│   │   └── ds/           # Iconos de SO para descargas
│   ├── dsapp/            # Instaladores para descarga
│   ├── style.css         # Estilos globales
│   ├── responsivo.js     # Lógica frontend
│   ├── manifest.json     # PWA manifest
│   └── sw.js             # Service Worker
├── scripts/              # Scripts de utilidad
│   └── generate-sw-assets.js  # Genera lista de archivos para el SW
├── templates/            # Plantillas para generar capítulos
├── tools/                # Script de generación de capítulos
├── main.js               # Proceso principal de Electron
├── preload.js            # Puente Electron → frontend
├── electron-builder.yml  # Configuración de empaquetado
├── netlify.toml          # Configuración de despliegue (Netlify)
└── package.json          # Dependencias y scripts
```

---

## Scripts disponibles

```bash
npm start          # Ejecutar app en desarrollo
npm run dist       # Empaquetar para Linux (AppImage) y Windows (Portable)
npm run release    # Empaquetar + publicar en GitHub Releases
npm run generate-sw  # Actualizar lista de archivos en el Service Worker
```

Los scripts `dist` y `release` ejecutan automáticamente `generate-sw` antes de compilar (via hooks `predist` / `prerelease`).

---

## Tecnologías

- **Electron** — App de escritorio
- **HTML + CSS + JS** — Frontend
- **electron-builder** — Empaquetado y distribución
- **electron-updater** — Actualizaciones automáticas desde GitHub
- **Netlify** — Hosting web con despliegue continuo desde GitHub
- **Font Awesome 6** — Iconos de navegación (vía CDN)
- **Google Fonts** — Playfair Display + Poppins

---

## Actualizaciones automáticas

**App de escritorio:** Al abrir la app, verifica si hay una versión más nueva en GitHub. Si la hay, puedes descargar e instalar la actualización con un clic.

**Contenido (capítulos):** La app descarga automáticamente los nuevos capítulos y cambios desde GitHub al iniciar, sin necesidad de reinstalar el .exe.

**Web/PWA:** El Service Worker se actualiza automáticamente cuando hay cambios. La versión web siempre refleja el último commit en `main` gracias al deploy automático de Netlify.

---

## Licencia

MIT — el código es libre. Las obras literarias son propiedad de sus respectivos autores.
