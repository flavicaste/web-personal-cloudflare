/**
 * script.js - Flavia Castellano Website
 * Funcionalidades interactivas, modo claro/oscuro, menú responsive y validación.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Año dinámico en el footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 2. Control de Tema (Modo Claro / Modo Oscuro)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const savedTheme = localStorage.getItem('fc_theme');

    // Inicializar tema guardado o preferencia del sistema
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        document.body.setAttribute('data-theme', initialTheme);
        updateThemeIcon(initialTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('fc_theme', newTheme);
            updateThemeIcon(newTheme);
            showToast(`Modo ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-moon';
        } else {
            themeIcon.className = 'fa-solid fa-sun';
        }
    }

    // 3. Menú Móvil Hamburger
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        // Cerrar menú al hacer clic en un enlace de navegación
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', false);
            });
        });

        // Cerrar al hacer clic fuera del menú
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', false);
            }
        });
    }

    // 4. Navegación activa con Intersection Observer
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    correspondingLink.classList.add('active');
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    }
    window.addEventListener('scroll', highlightNavOnScroll);

    // 5. Animaciones Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Dejar de observar una vez mostrado
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 6. Copiar al Portapapeles (Ej. Email)
    const copyTargets = document.querySelectorAll('.copy-target');

    copyTargets.forEach(card => {
        card.addEventListener('click', async () => {
            const textToCopy = card.getAttribute('data-copy');
            if (textToCopy) {
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    const icon = card.querySelector('.copy-icon');
                    if (icon) {
                        icon.className = 'fa-solid fa-check contact-arrow';
                        setTimeout(() => {
                            icon.className = 'fa-regular fa-copy contact-arrow copy-icon';
                        }, 2500);
                    }
                    showToast(`Copiado al portapapeles: ${textToCopy}`);
                } catch (err) {
                    showToast(`Correo: ${textToCopy}`);
                }
            }
        });
    });

    // 7. Formulario de Contacto y Validación
    const contactForm = document.getElementById('contact-form');
    const formNotification = document.getElementById('form-notification');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombreInput = document.getElementById('nombre');
            const emailInput = document.getElementById('email');
            const asuntoInput = document.getElementById('asunto');
            const mensajeInput = document.getElementById('mensaje');

            let isValid = true;

            // Validación de Nombre
            if (!nombreInput.value.trim()) {
                showFieldError('nombre-error', 'Por favor ingresa tu nombre');
                nombreInput.classList.add('error');
                isValid = false;
            } else {
                hideFieldError('nombre-error');
                nombreInput.classList.remove('error');
            }

            // Validación de Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                showFieldError('email-error', 'Por favor ingresa un correo válido');
                emailInput.classList.add('error');
                isValid = false;
            } else {
                hideFieldError('email-error');
                emailInput.classList.remove('error');
            }

            // Validación de Asunto
            if (!asuntoInput.value) {
                showFieldError('asunto-error', 'Por favor selecciona un asunto');
                asuntoInput.classList.add('error');
                isValid = false;
            } else {
                hideFieldError('asunto-error');
                asuntoInput.classList.remove('error');
            }

            // Validación de Mensaje
            if (!mensajeInput.value.trim() || mensajeInput.value.trim().length < 10) {
                showFieldError('mensaje-error', 'El mensaje debe tener al menos 10 caracteres');
                mensajeInput.classList.add('error');
                isValid = false;
            } else {
                hideFieldError('mensaje-error');
                mensajeInput.classList.remove('error');
            }

            if (!isValid) return;

            // Simulación y fallback con cliente de correo
            const recipient = 'flavicaste@hotmail.com';
            const subject = encodeURIComponent(`[Consulta Web] ${asuntoInput.value} - ${nombreInput.value.trim()}`);
            const body = encodeURIComponent(
                `Nombre: ${nombreInput.value.trim()}\n` +
                `Email: ${emailInput.value.trim()}\n` +
                `Asunto: ${asuntoInput.value}\n\n` +
                `Mensaje:\n${mensajeInput.value.trim()}`
            );

            // Mostrar mensaje de éxito en pantalla
            formNotification.className = 'form-notification success';
            formNotification.textContent = '¡Gracias por tu mensaje! Abriendo tu cliente de correo para completar el envío...';

            setTimeout(() => {
                // Abrir cliente de correo predeterminado
                window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
                contactForm.reset();
                setTimeout(() => {
                    formNotification.textContent = 'Mensaje preparado. ¡Me pondré en contacto contigo a la brevedad!';
                }, 1500);
            }, 800);
        });
    }

    function showFieldError(id, message) {
        const errorEl = document.getElementById(id);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
    }

    function hideFieldError(id) {
        const errorEl = document.getElementById(id);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
    }

    // 8. Mensaje Toast
    function showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }
});
