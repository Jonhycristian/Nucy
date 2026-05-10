document.addEventListener('DOMContentLoaded', function() {

    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // --- Menu Mobile Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;

    if (menuToggle && navMenu && menuIcon) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', !isExpanded);

            if (navMenu.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
                menuToggle.setAttribute('aria-label', 'Fechar Menu');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
                menuToggle.setAttribute('aria-label', 'Abrir Menu');
            }
        });

        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    menuToggle.click();
                }
            });
        });

        document.addEventListener('click', (event) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                menuToggle.click();
            }
        });
    }

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    if(header){
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // --- Animação Fade-in ao Scroll (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.fade-in, .ia-video');
    if ("IntersectionObserver" in window && animatedElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Não desregistra o observador para .ia-video, para que o texto reapareça
                    if (!entry.target.classList.contains('ia-video')) {
                        observer.unobserve(entry.target);
                    }
                } else {
                    // Opcional: fazer o fade out do h2 quando sair da tela
                    if (entry.target.classList.contains('ia-video')) {
                        entry.target.classList.remove('visible');
                    }
                }
            });
        };

        const intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);
        animatedElements.forEach(el => intersectionObserver.observe(el));
    } else {
        animatedElements.forEach(el => el.classList.add('visible'));
    }

    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('main section[id]');
    const navLiAnchors = document.querySelectorAll('.nav-menu li a');

    if(sections.length > 0 && navLiAnchors.length > 0 && header) {
        let isScrolling;
        window.addEventListener('scroll', () => {
            window.cancelAnimationFrame(isScrolling);
            isScrolling = window.requestAnimationFrame(navHighlighter);
        }, { passive: true });

        function navHighlighter() {
            let scrollY = window.pageYOffset;
            const headerOffset = header.offsetHeight + 40;

            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                // Ajuste para a seção .hero (full-screen)
                const sectionTop = current.classList.contains('full-screen') ? current.offsetTop - headerOffset + (window.innerHeight * 0.3) : current.offsetTop - headerOffset;
                const sectionBottom = sectionTop + sectionHeight;
                let sectionId = current.getAttribute('id');
                let correspondingLink = document.querySelector('.nav-menu a[href*=' + sectionId + ']');

                if(correspondingLink) {
                    // Ajuste para não desativar o link "Home" tão rápido
                    if (scrollY >= sectionTop && scrollY < sectionBottom - (window.innerHeight * 0.3) ) {
                        navLiAnchors.forEach(link => link.classList.remove('active'));
                        correspondingLink.classList.add('active');
                    } else {
                        correspondingLink.classList.remove('active');
                    }
                }
            });

            // Garante que o Home esteja ativo quando no topo
            if (scrollY < sections[0].offsetTop - header.offsetHeight) {
                navLiAnchors.forEach(link => link.classList.remove('active'));
                let homeLink = document.querySelector('.nav-menu a[href="#home"]');
                if (homeLink) homeLink.classList.add('active');
            }
        }
        navHighlighter();
    }
}); // End DOMContentLoaded