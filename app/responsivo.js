// JavaScript para GreatBook Library - Menú y Sistema de Auto-guardado
document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. LÓGICA DEL MENÚ CIRCULAR ---
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
        body.classList.add('menu-open');
        menuContainer.classList.add('active');
        menuItems.forEach((li, index) => {
            setTimeout(() => { li.classList.add('animate'); }, 150 + (index * 50));
        });
    }

    function closeMenu() {
        isMenuOpen = false;
        menuToggle.classList.remove('active');
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

    // --- 2. SISTEMA DE AUTO-GUARDADO ---

    // Función para normalizar IDs (ej: fanfic_0001 -> fanfic_1)
    function normalizeId(id) {
        return id.toLowerCase().replace(/_0+/g, '_').replace('.html', '');
    }

    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop() || 'index.html';

    // A. GUARDAR PROGRESO Y MARCAR LEÍDOS (Si estamos en un capítulo)
    const isChapterPage = document.querySelector('.chapter-content');
    if (isChapterPage) {
        const parts = fileName.split('_');
        if (parts.length >= 2) {
            const bookBaseId = normalizeId(parts[0] + "_" + parts[1]);
            localStorage.setItem(`last_cap_${bookBaseId}`, fileName);
            localStorage.setItem(`read_${normalizeId(fileName)}`, '1');
        }
    }

    // B. MARCAR CAPÍTULOS LEÍDOS EN EL MENÚ (Si estamos en la portada de un libro)
    const chapterListEl = document.querySelector('.chapter-menu .chapter-list');
    if (chapterListEl) {
        chapterListEl.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href')
            if (href && !href.startsWith('#') && localStorage.getItem(`read_${normalizeId(href)}`)) {
                link.classList.add('read')
            }
        })
    }

});
