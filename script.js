/**
 * script.js - Flavia Castellano Website
 * Interacciones estilo Framer / Portix: Menú móvil, animaciones al scroll,
 * copia rápida al portapapeles y validación de formulario.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Año dinámico en el footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 2. Menú Móvil Hamburger
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
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Cerrar al hacer clic fuera del menú
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 3. Navegación activa con Intersection Observer
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

    // 4. Animaciones Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Copiar al Portapapeles (Email)
    const copyTargets = document.querySelectorAll('.copy-target');

    copyTargets.forEach(card => {
        card.addEventListener('click', async () => {
            const textToCopy = card.getAttribute('data-copy');
            if (textToCopy) {
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    const icon = card.querySelector('.copy-icon');
                    if (icon) {
                        icon.className = 'fa-solid fa-check tile-arrow';
                        setTimeout(() => {
                            icon.className = 'fa-regular fa-copy tile-arrow copy-icon';
                        }, 2500);
                    }
                    showToast(`Copiado al portapapeles: ${textToCopy}`);
                } catch (err) {
                    showToast(`Correo: ${textToCopy}`);
                }
            }
        });
    });

    // 6. Formulario de Contacto y Validación
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

            // Preparación del correo mailto
            const recipient = 'flavicaste@hotmail.com';
            const subject = encodeURIComponent(`[Consulta Web] ${asuntoInput.value} - ${nombreInput.value.trim()}`);
            const body = encodeURIComponent(
                `Nombre: ${nombreInput.value.trim()}\n` +
                `Email: ${emailInput.value.trim()}\n` +
                `Servicio de interés: ${asuntoInput.value}\n\n` +
                `Mensaje:\n${mensajeInput.value.trim()}`
            );

            // Notificación visual de éxito
            formNotification.className = 'form-notification success';
            formNotification.textContent = '¡Gracias! Abriendo tu gestor de correo para enviar tu mensaje...';

            setTimeout(() => {
                window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
                contactForm.reset();
                setTimeout(() => {
                    formNotification.textContent = 'Mensaje preparado. ¡Responderé a tu consulta a la brevedad!';
                }, 1500);
            }, 700);
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

    // 7. Toast flotante
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
