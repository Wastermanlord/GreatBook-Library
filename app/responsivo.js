try {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js')
} catch {}

document.addEventListener('DOMContentLoaded', function() {
  try {

    const menuToggle = document.querySelector('.menu-toggle');
    const circle = document.querySelector('.circle');
    const menuContainer = document.querySelector('.menu-mobile-container');
    const menuItems = document.querySelectorAll('.mobile-menu-list li');
    const body = document.body;

    let isMenuOpen = false;

    function openMenu() {
        isMenuOpen = true;
        circle.classList.add('expand');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('menu-open');
        menuContainer.classList.add('active');
        menuItems.forEach((li, index) => {
            setTimeout(() => { li.classList.add('animate'); }, 150 + (index * 50));
        });
    }

    function closeMenu() {
        isMenuOpen = false;
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        circle.classList.remove('expand');
        body.classList.remove('menu-open');
        menuItems.forEach((li) => { li.classList.remove('animate'); });
        setTimeout(() => { if (!isMenuOpen) menuContainer.classList.remove('active'); }, 500);
    }

    if (menuToggle && circle) {
        menuToggle.addEventListener('click', (e) => { e.stopPropagation(); !isMenuOpen ? openMenu() : closeMenu(); });
        menuContainer.addEventListener('click', (e) => { if (e.target === menuContainer) closeMenu(); });
        menuItems.forEach(li => { li.querySelector('a').addEventListener('click', closeMenu); });
    }

    function normalizeId(id) {
        return id.toLowerCase().replace(/_0+/g, '_').replace('.html', '');
    }

    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop() || 'index.html';

    const isChapterPage = document.querySelector('.chapter-content');
    if (isChapterPage) {
        const parts = fileName.split('_');
        if (parts.length >= 2) {
            const bookBaseId = normalizeId(parts[0] + "_" + parts[1]);
            const h2 = document.querySelector('.chapter-content h2');
            localStorage.setItem(`last_cap_${bookBaseId}`, JSON.stringify({
                chapter: fileName,
                title: h2 ? h2.textContent.trim() : fileName,
                time: Date.now()
            }));
            localStorage.setItem(`read_${normalizeId(fileName)}`, '1');
        }
    }

    const bookTitleEl = document.querySelector('.book-info h1');
    if (bookTitleEl) {
        const bookId = normalizeId(fileName.replace('.html', ''));
        localStorage.setItem(`book_${bookId}`, bookTitleEl.textContent.trim());
    }

    const chapterListEl = document.querySelector('.chapter-menu .chapter-list');
    if (chapterListEl) {
        chapterListEl.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href')
            if (href && !href.startsWith('#') && localStorage.getItem(`read_${normalizeId(href)}`)) {
                link.classList.add('read')
            }
        })
    }

    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') html.setAttribute('data-theme', 'dark');

    const headerEl = document.querySelector('header');
    let themeBtn = document.querySelector('.theme-toggle');
    if (!themeBtn && headerEl) {
        themeBtn = document.createElement('button');
        themeBtn.className = 'theme-toggle';
        themeBtn.setAttribute('aria-label', 'Cambiar tema');
        const h1 = headerEl.querySelector('h1');
        if (h1) {
            const wrapper = document.createElement('div');
            wrapper.className = 'header-row';
            h1.parentNode.insertBefore(wrapper, h1);
            wrapper.appendChild(h1);
            wrapper.appendChild(themeBtn);
        } else {
            headerEl.appendChild(themeBtn);
        }
    }
    if (themeBtn) {
        themeBtn.textContent = html.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
        themeBtn.addEventListener('click', () => {
            const isDark = html.getAttribute('data-theme') === 'dark';
            html.setAttribute('data-theme', isDark ? '' : 'dark');
            localStorage.setItem('theme', isDark ? '' : 'dark');
            themeBtn.textContent = isDark ? '🌙' : '☀️';
        });
    }

    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG' && !e.target.hasAttribute('data-error')) {
            e.target.setAttribute('data-error', '1');
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e0e0e0" width="100" height="100"/><text x="50" y="55" text-anchor="middle" font-size="32" fill="%23999">📖</text></svg>';
            e.target.style.objectFit = 'contain';
            e.target.style.padding = '20%';
            e.target.alt = 'Imagen no disponible';
        }
    }, true);

    const offlineBanner = document.createElement('div');
    offlineBanner.className = 'offline-banner';
    offlineBanner.textContent = 'Sin conexión - algunos contenidos pueden no estar disponibles';
    document.body.insertBefore(offlineBanner, document.body.firstChild);
    function updateOnlineStatus() {
        offlineBanner.classList.toggle('show', !navigator.onLine);
    }
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    const catalogSections = document.querySelectorAll('.catalog');
    if (catalogSections.length) {
        const searchInput = document.getElementById('searchInput');
        const filterBtns = document.querySelectorAll('.filter-btn');
        let activeFilter = 'all';

        function filterCatalog() {
            const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
            catalogSections.forEach(section => {
                const books = section.querySelectorAll('.menu a');
                let visibleCount = 0;
                books.forEach(link => {
                    const nameEl = link.querySelector('.nombre');
                    const title = nameEl ? nameEl.textContent.toLowerCase() : '';
                    const badgeEl = link.querySelector('.badge');
                    const status = badgeEl ? badgeEl.textContent.trim().toLowerCase() : '';
                    const matchesSearch = !term || title.includes(term);
                    const matchesFilter = activeFilter === 'all' ||
                        (activeFilter === 'progress' && status === 'en progreso') ||
                        (activeFilter === 'paused' && status === 'pausado');
                    const show = matchesSearch && matchesFilter;
                    link.classList.toggle('hidden-book', !show);
                    if (show) visibleCount++;
                });
                section.classList.toggle('hidden-section', visibleCount === 0);
            });
        }
        if (searchInput) searchInput.addEventListener('input', filterCatalog);
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilter = btn.dataset.filter;
                filterCatalog();
            });
        });
    }

    if (isChapterPage) {
        const progressBar = document.createElement('div');
        progressBar.className = 'read-progress-bar';
        body.appendChild(progressBar);

        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
            progressBar.style.width = pct + '%';
        }
        window.addEventListener('scroll', updateProgress);
        updateProgress();

        const savedPct = localStorage.getItem('scroll_' + normalizeId(fileName));
        if (savedPct) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const targetY = (parseFloat(savedPct) / 100) * docHeight;
            setTimeout(() => window.scrollTo(0, targetY), 50);
        }

        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                localStorage.setItem('scroll_' + normalizeId(fileName), pct.toString());
            }, 2000);
        });

        const navLinks = document.querySelectorAll('.chapter-nav-link');
        let prevLink = null, nextLink = null;
        navLinks.forEach(link => {
            if (link.querySelector('.fa-arrow-left')) prevLink = link;
            if (link.querySelector('.fa-arrow-right')) nextLink = link;
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && prevLink) { e.preventDefault(); prevLink.click(); }
            if (e.key === 'ArrowRight' && nextLink) { e.preventDefault(); nextLink.click(); }
        });

        const savedSize = localStorage.getItem('fontSize');
        if (savedSize) html.style.setProperty('--font-size', savedSize);

        const controls = document.createElement('div');
        controls.className = 'font-controls';
        controls.innerHTML = '<button id="fontDec" title="Reducir fuente">A−</button><button id="fontInc" title="Aumentar fuente">A+</button>';
        body.appendChild(controls);

        const baseSizes = [0.85, 0.95, 1.05, 1.15, 1.25, 1.35];
        let sizeIndex = savedSize ? baseSizes.indexOf(parseFloat(savedSize)) : 2;
        if (sizeIndex === -1) sizeIndex = 2;

        function applyFontSize() {
            const val = baseSizes[sizeIndex] + 'em';
            html.style.setProperty('--font-size', val);
            localStorage.setItem('fontSize', val);
        }
        document.getElementById('fontDec').addEventListener('click', () => {
            sizeIndex = Math.max(0, sizeIndex - 1);
            applyFontSize();
        });
        document.getElementById('fontInc').addEventListener('click', () => {
            sizeIndex = Math.min(baseSizes.length - 1, sizeIndex + 1);
            applyFontSize();
        });
    }

    const transition = document.createElement('div');
    transition.className = 'page-transition';
    body.appendChild(transition);

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('//') || link.hasAttribute('download') || link.getAttribute('target') === '_blank') return;
        e.preventDefault();
        transition.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 250);
    });

    window.addEventListener('pageshow', () => {
        transition.classList.remove('active');
    });

  } catch(e) { console.error('UI:', e); }
});
