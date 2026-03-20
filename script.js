document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =================== LOADING SCREEN ===================
    const loader = document.getElementById('loader');
    document.body.classList.add('is-loading');

    const hideLoader = () => {
        if (loader) {
            loader.classList.add('hidden');
            document.body.classList.remove('is-loading');
            setTimeout(() => { loader.style.display = 'none'; }, 600);
        }
    };

    // Hide after page fully loads (with a minimum display time for polish)
    const loadStart = Date.now();
    window.addEventListener('load', () => {
        const elapsed = Date.now() - loadStart;
        const remaining = Math.max(1200 - elapsed, 0);
        setTimeout(hideLoader, remaining);
    });

    // Safety fallback: hide after 4 seconds no matter what
    setTimeout(hideLoader, 4000);

    // =================== SCROLL PROGRESS BAR ===================
    const scrollBar = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');

    const updateScroll = () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
        if (scrollBar) scrollBar.style.width = pct + '%';
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    // =================== SCROLL REVEAL (IntersectionObserver) ===================
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('active');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-up').forEach(el => revealObs.observe(el));

    // =================== STAT COUNTER ANIMATION ===================
    const animateStats = () => {
        document.querySelectorAll('.stat-number[data-count]').forEach(el => {
            if (el.dataset.animated) return;
            el.dataset.animated = '1';
            const target = parseInt(el.dataset.count, 10);
            const duration = 1600;
            const step = target / (duration / 16);
            let current = 0;

            const tick = () => {
                current += step;
                if (current < target) {
                    el.textContent = Math.floor(current);
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target + '+';
                }
            };
            tick();
        });
    };

    const aboutEl = document.getElementById('about');
    if (aboutEl) {
        const statObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    animateStats();
                    statObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });
        statObs.observe(aboutEl);
    }

    // =================== INTERACTIVE CARD GLOW (mouse-following) ===================
    document.querySelectorAll('.card').forEach(card => {
        const shine = card.querySelector('.card-shine');
        if (!shine) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            shine.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 40%)`;
            shine.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            shine.style.opacity = '0';
        });
    });

    // =================== EMAILJS INIT ===================
    if (typeof emailjs !== 'undefined') {
        emailjs.init('CWMC8v90lTidiLI6O');
    }

    // =================== CONTACT FORM (EmailJS) ===================
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');

    const showFeedback = (type, message) => {
        feedback.className = 'form-feedback show ' + type;
        feedback.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>${message}`;
        
        if (type === 'success') {
            setTimeout(() => {
                feedback.classList.remove('show');
                setTimeout(() => { feedback.className = 'form-feedback'; }, 400);
            }, 5000);
        }
    };

    const setLoading = (loading) => {
        submitBtn.disabled = loading;
        submitBtn.classList.toggle('loading', loading);
    };

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Gather values
            const name = document.getElementById('cf-name').value.trim();
            const email = document.getElementById('cf-email').value.trim();
            const title = document.getElementById('cf-subject').value.trim();
            const message = document.getElementById('cf-message').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                showFeedback('error', 'Please fill in all required fields.');
                return;
            }

            // Email format check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFeedback('error', 'Please enter a valid email address.');
                return;
            }

            // Clear previous feedback
            feedback.className = 'form-feedback';
            setLoading(true);

            try {
                // Add auto-generated time field for the template
                const timeInput = document.createElement('input');
                timeInput.type = 'hidden';
                timeInput.name = 'time';
                timeInput.value = new Date().toLocaleString('en-US', {
                    dateStyle: 'full', timeStyle: 'short'
                });
                contactForm.appendChild(timeInput);

                const result = await emailjs.sendForm(
                    'service_laqjruc',
                    'template_36bqmac',
                    contactForm
                );

                // Remove the temporary time input
                timeInput.remove();

                if (result.status === 200) {
                    contactForm.reset();
                    showFeedback('success', 'Message sent successfully! I\'ll get back to you soon.');
                } else {
                    showFeedback('error', 'Something went wrong. Please try again.');
                }
            } catch (err) {
                console.error('EmailJS error:', err);
                // Fallback to mailto
                const sub = encodeURIComponent('[Portfolio] ' + (title || 'New Message'));
                const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
                window.location.href = `mailto:afrafadmadinata@gmail.com?subject=${sub}&body=${body}`;
                contactForm.reset();
                showFeedback('success', 'Opening your email client as fallback...');
            }

            setLoading(false);
        });
    }

    // =================== GITHUB PROJECTS ===================
    const langColors = {
        'Python': '#3572A5', 'C++': '#f34b7d', 'JavaScript': '#f1e05a',
        'HTML': '#e34c26', 'CSS': '#563d7c', 'R': '#198CE7',
        'TypeScript': '#3178c6', 'Java': '#b07219', 'C': '#555555'
    };

    const fallbackProjects = [
        {
            name: 'PRANK-WIFI-SMADA',
            description: 'Captive portal prank with mysterious sound effects triggered on interaction. Built with Arduino and C++.',
            language: 'C++',
            html_url: 'https://github.com/Afra4509/PRANK-WIFI-SMADA',
            homepage: 'https://afra4509.github.io/PRANK-WIFI-SMADA/'
        },
        {
            name: 'aplikasi-klasifikasi-gorengan',
            description: 'TensorFlow-powered intelligent cashier — classifies fried food images and outputs pricing automatically.',
            language: 'Python',
            html_url: 'https://github.com/Afra4509/aplikasi-klasifikasi-gorengan',
            homepage: 'https://aplikasi-klasifikasi-gorengan.streamlit.app/'
        },
        {
            name: 'termodinamika',
            description: 'Physics computation app for thermodynamics formulas. Built with R and Shiny for interactive calculations.',
            language: 'R',
            html_url: 'https://github.com/Afra4509/termodinamika',
            homepage: 'https://afra1502.shinyapps.io/fisikasenopati/'
        },
        {
            name: 'CekFollower',
            description: 'Web tool to compare Instagram followers and find who doesn\'t follow you back.',
            language: 'HTML',
            html_url: 'https://github.com/Afra4509/CekFollower',
            homepage: 'https://afra4509.github.io/CekFollower/'
        },
        {
            name: 'afrachiper',
            description: 'Shift cipher encryption/decryption tool with brute-force capability. Built with vanilla JavaScript.',
            language: 'HTML',
            html_url: 'https://github.com/Afra4509/afrachiper',
            homepage: 'https://afra4509.github.io/afrachiper/'
        },
        {
            name: 'afra-fadhma-dinata',
            description: 'Personal portfolio website showcasing projects, skills, and engineering philosophy.',
            language: 'HTML',
            html_url: 'https://github.com/Afra4509/afra-fadhma-dinata',
            homepage: 'https://afra4509.github.io/afra-fadhma-dinata/'
        }
    ];

    const renderProjects = (repos) => {
        const container = document.getElementById('github-projects');
        if (!container) return;

        container.innerHTML = `<div class="projects-grid">${repos.map((repo, idx) => {
            const color = langColors[repo.language] || '#888';
            const name = repo.name.replace(/-/g, ' ');
            const desc = repo.description || 'No description provided.';

            return `
                <a href="${repo.html_url}" target="_blank" class="project-card reveal-up" style="transition-delay: ${idx * 0.1}s;">
                    <div>
                        <h3 class="project-title">${name}</h3>
                        <p class="project-desc">${desc}</p>
                    </div>
                    <div class="project-footer">
                        <div class="project-lang">
                            <span class="lang-dot" style="background:${color};box-shadow:0 0 8px ${color}40;"></span>
                            <span>${repo.language || 'Code'}</span>
                        </div>
                        <span class="project-link">View →</span>
                    </div>
                </a>`;
        }).join('')}</div>`;

        // Re-observe for scroll reveal
        setTimeout(() => {
            container.querySelectorAll('.reveal-up').forEach(el => revealObs.observe(el));
        }, 50);
    };

    (async () => {
        try {
            const res = await fetch('https://api.github.com/users/Afra4509/repos?sort=updated&per_page=10');
            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            if (data.message) throw new Error(data.message);

            const filtered = data
                .filter(r => !r.fork && r.name !== 'Afra4509' && !r.name.includes('.github.io'))
                .slice(0, 6);

            renderProjects(filtered.length ? filtered : fallbackProjects);
        } catch {
            renderProjects(fallbackProjects);
        }
    })();

    // =================== SMOOTH ANCHOR SCROLLING ===================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const id = a.getAttribute('href');
            if (id === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
            const target = document.querySelector(id);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // =================== MOBILE NAV TOGGLE ===================
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });

        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            });
        });
    }
});