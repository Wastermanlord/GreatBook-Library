# GreatBook Library

App multiplataforma para publicación y lectura de novelas, fanfics y poesía.  
Web + Escritorio (Windows/Linux) + PWA Android.

---

## ¿Qué es?

GreatBook Library es una plataforma donde publico obras de mi autoría (y próximamente de más escritores). Es una librería virtual en desarrollo activo, pensada para ofrecer una experiencia de lectura cómoda tanto en web como en app de escritorio.

Actualmente incluye obras como *SNV: Duel of Legends*, *Spider-Man: Golden*, *Duelo de Corazones*, *Stellaris* y *Odas Esenciales* — y se sigue expandiendo con nuevos capítulos, obras y funcionalidades.

---

## ¿Dónde se puede usar?

### Web (Netlify)
[https://greatbooklibrary.netlify.app](https://greatbooklibrary.netlify.app)

Funciona en cualquier navegador. Además, es instalable como PWA — en Android se puede agregar a la pantalla de inicio y toda la biblioteca se descarga automáticamente para leer sin internet.

### App de escritorio
Disponible para **Linux** (AppImage) y **Windows** (Instalador NSIS + Portable).

Descargas directas desde la [página de descargas](https://greatbooklibrary.netlify.app/descargas.html) o desde [GitHub Releases](https://github.com/Wastermanlord/GreatBook-Library/releases).

---

## Funcionalidades

### Lectura
- **Panel de ajustes:** Control de tamaño de fuente (6 niveles), tipo de fuente (Serif/Sans) y tema claro/oscuro. Persiste entre sesiones.
- **Posición de lectura:** Guarda el porcentaje de avance por capítulo y lo restaura al volver.
- **Barra de progreso:** Línea dorada en la parte superior que avanza con el scroll.
- **Atajos de teclado:** Flechas ← → para navegar entre capítulos al instante.
- **Transiciones suaves:** Fade entre páginas al navegar.
- **Continuar leyendo:** En la página principal aparecen las lecturas recientes con acceso directo al último capítulo.
- **Navegación entre capítulos:** Botones circulares con flechas (anterior/siguiente) e inicio.
- **Capítulos leídos:** Check dorado en los capítulos ya visitados.
- **Capítulos bloqueados ("Coming Soon"):** Estilo visual diferenciado para capítulos no publicados aún.
- **Lista de capítulos colapsable:** Se puede ocultar/mostrar la lista de capítulos.

### Catálogo y búsqueda
- **Filtro por estado:** Botones Todos / En progreso / Pausado.
- **Búsqueda por título:** Filtro en vivo mientras escribes.

### PWA / Offline
- **Instalable:** En Android aparece un banner para instalar la app. También puedes usar "Descargar" en la web.
- **Precarga total:** Al instalar la PWA se descargan todos los capítulos, portadas y recursos — la biblioteca entera funciona sin internet.
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
- **Menú responsive:** Menú desktop + menú móvil circular con animación de expansión.
- **Elementos flotantes:** Se ocultan automáticamente al abrir el menú móvil (configuración, barra de progreso, etc.).
- **Placeholder de imágenes:** Si una portada no carga, se muestra un ícono SVG en lugar del recuadro roto.
- **Navegación unificada:** Todas las páginas comparten los mismos enlaces (Inicio, Catálogo, Noticias, Términos, Descargar).

### Web (SEO y rendimiento)
- Meta tags, Open Graph, sitemap.xml, robots.txt.
- Google Fonts optimizadas con preconnect.
- Cabeceras de seguridad (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- Cache inmutable (1 año) para assets estáticos (CSS, JS, imágenes).
- Service Worker con `no-cache` y alcance raíz.

---

## Actualizaciones automáticas

**App de escritorio:** Al abrir la app, verifica si hay una versión más nueva en GitHub. Si la hay, puedes descargar e instalar la actualización con un clic. El progreso de descarga se muestra en la interfaz.

**Contenido (capítulos):** La app descarga automáticamente los nuevos capítulos y cambios desde GitHub al iniciar, sin necesidad de reinstalar la app. Usa un sistema de versionado basado en `content-version.json`.

**Web/PWA:** El Service Worker se actualiza automáticamente cuando hay cambios. La versión web siempre refleja el último commit en `main` gracias al deploy automático de Netlify.

---

## Licencia

MIT — el código es libre. Las obras literarias son propiedad de sus respectivos autores.
