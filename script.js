document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    gsap.registerPlugin(ScrollTrigger);

    window.addEventListener('load', () => {

    // =================== PRELOADER SEQUENCE ===================
    const mainContent = document.getElementById('main-content');
    const preloader = document.getElementById('preloader');
    
    // We want a blur-in / blur-out effect for each word
    const tl = gsap.timeline();

    tl
    // 1. Afra
      .to('.pl-afra', { opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' })
      .to('.pl-afra', { opacity: 0, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in', delay: 0.2 })
    
    // 2. Fadhma
      .to('.pl-fadhma', { opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .to('.pl-fadhma', { opacity: 0, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in', delay: 0.2 })
    
    // 3. Dinata
      .to('.pl-dinata', { opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .to('.pl-dinata', { opacity: 0, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in', delay: 0.2 })
      
      // REVEAL PHASE: Setup main content
      .set(mainContent, { opacity: 1, visibility: 'visible' })
      
      // Fade out preloader OVERLAPPING with the end of Dinata
      .to(preloader, { 
          opacity: 0, 
          duration: 0.8, 
          ease: 'power2.inOut', 
          onComplete: () => {
              preloader.style.display = 'none';
              document.body.style.overflow = 'auto'; // Re-enable scrolling
          }
      }, '-=0.2')
      
      // Start Hero Animation Timeline (Overlapping with preloader fade out)
      .from('.nav-wrapper', { y: -50, opacity: 0, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.6')
      .from('.hero-terminal', { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.6')
      .from('.hero-heading', { y: 50, rotation: 2, opacity: 0, duration: 1.2, ease: 'power4.out' }, '-=0.4')
      .from('.hero-sub', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
      .fromTo('.hero-cta a', 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.1, clearProps: 'all' }, 
          '-=0.7'
      )
      .from('.hero-shape-1', { scale: 0, rotation: -45, opacity: 0, duration: 1.5, ease: 'elastic.out(1, 0.3)' }, '-=0.8');

      // Start typing animation after preloader
      startTypingAnimation();
    });

    // =================== TYPING ANIMATION ===================
    function startTypingAnimation() {
        const phrases = [
            'console.log("Hello, World!")',
            'while (alive) { code(); }',
            'git commit -m "ship it 🚀"',
            'npm run build — success ✓',
            '// crafting digital magic...',
            'sudo make me_a_website',
        ];
        const el = document.getElementById('typingText');
        if (!el) return;

        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let pauseMs = 0;

        function tick() {
            const current = phrases[phraseIdx];
            
            if (pauseMs > 0) {
                pauseMs -= 50;
                setTimeout(tick, 50);
                return;
            }

            if (!isDeleting) {
                el.textContent = current.substring(0, charIdx + 1);
                charIdx++;
                if (charIdx >= current.length) {
                    isDeleting = true;
                    pauseMs = 2000; // pause before deleting
                }
                setTimeout(tick, 60 + Math.random() * 40);
            } else {
                el.textContent = current.substring(0, charIdx - 1);
                charIdx--;
                if (charIdx <= 0) {
                    isDeleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                }
                setTimeout(tick, 30);
            }
        }
        // Small delay before first type starts
        setTimeout(tick, 600);
    }

    // =================== SCROLL REVEAL ===================
    document.querySelectorAll('.reveal').forEach(el => {
        gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
        // Initial setup
        gsap.set(el, { y: 40, opacity: 0 });
    });

    // =================== THEME TOGGLE ===================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    const applyTheme = (theme) => {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = (html.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });
    }

    // =================== NAVBAR SCROLL ===================
    const navbar = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sectionIds = ['about', 'work', 'stack', 'contact'];

    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) navbar.style.boxShadow = '0 10px 40px -10px rgba(0,0,0,0.8)';
            else navbar.style.boxShadow = '0 10px 40px -10px rgba(0,0,0,0.5)';
        }

        const scrollPos = window.scrollY + window.innerHeight / 3;
        let current = '';
        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top + window.scrollY <= scrollPos) current = id;
        });
        navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === current));
    }, { passive: true });

    // =================== GITHUB PROJECTS CAROUSEL ===================
    const langIcons = {
        'Python': 'devicon-python-plain', 'C++': 'devicon-cplusplus-plain', 'JavaScript': 'devicon-javascript-plain',
        'HTML': 'devicon-html5-plain', 'CSS': 'devicon-css3-plain', 'R': 'devicon-r-original',
        'TypeScript': 'devicon-typescript-plain', 'Java': 'devicon-java-plain', 'C': 'devicon-c-plain',
        'Shell': 'devicon-bash-plain', 'Jupyter Notebook': 'devicon-jupyter-plain'
    };

    const fallbackProjects = [
        { name: 'PRANK-WIFI-SMADA', description: 'Captive portal prank with sound effects — Arduino + C++.', language: 'C++', html_url: 'https://github.com/Afra4509/PRANK-WIFI-SMADA' },
        { name: 'aplikasi-klasifikasi-gorengan', description: 'TensorFlow image classifier for fried food pricing.', language: 'Python', html_url: 'https://github.com/Afra4509/aplikasi-klasifikasi-gorengan' },
        { name: 'termodinamika', description: 'Interactive thermodynamics calculator — R + Shiny.', language: 'R', html_url: 'https://github.com/Afra4509/termodinamika' },
        { name: 'CekFollower', description: 'Compare Instagram followers — find non-followers.', language: 'HTML', html_url: 'https://github.com/Afra4509/CekFollower' },
        { name: 'afrachiper', description: 'Shift cipher tool with brute-force decryption.', language: 'HTML', html_url: 'https://github.com/Afra4509/afrachiper' },
        { name: 'afra-fadhma-dinata', description: 'This portfolio website.', language: 'HTML', html_url: 'https://github.com/Afra4509/afra-fadhma-dinata' }
    ];

    const buildCardHTML = (repo) => {
        const iconClass = langIcons[repo.language] || 'devicon-github-original';
        const name = repo.name.replace(/-/g, ' ');
        const desc = repo.description || 'Cool internal side-project built with passion.';
        return `
            <a href="${repo.html_url}" target="_blank" class="project-card">
                <div class="project-header">
                    <div class="project-icon"><i class="${iconClass}" style="font-size:28px;color:var(--accent-3);"></i></div>
                    <svg class="project-link-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                </div>
                <h3 class="project-name">${name}</h3>
                <p class="project-description">${desc}</p>
                <div class="project-footer">${repo.language || 'Code'}</div>
            </a>`;
    };

    const initCarousel = (repos) => {
        const loading = document.getElementById('projectsLoading');
        const track = document.getElementById('carouselTrack');
        const dotsEl = document.getElementById('carouselDots');
        const counter = document.getElementById('carouselCounter');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const wrapper = document.getElementById('projectsCarouselWrapper');
        if (!track) return;

        // Hide loading, populate track
        if (loading) loading.style.display = 'none';
        track.innerHTML = repos.map(buildCardHTML).join('');

        const getPerView = () => {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 900) return 2;
            return 3;
        };

        let current = 0;
        let autoTimer = null;
        const total = repos.length;

        const maxIndex = () => Math.max(0, total - getPerView());

        const goTo = (idx) => {
            const perView = getPerView();
            current = Math.max(0, Math.min(idx, maxIndex()));

            // Calculate px offset: card width + gap
            const cards = track.querySelectorAll('.project-card');
            if (!cards.length) return;
            const cardW = cards[0].offsetWidth;
            const gap = 24; // 1.5rem gap
            track.style.transform = `translateX(-${current * (cardW + gap)}px)`;

            // Dots
            document.querySelectorAll('.carousel-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });

            // Counter
            if (counter) counter.textContent = `${current + 1} – ${Math.min(current + perView, total)} of ${total} repos`;

            // Buttons
            if (prevBtn) prevBtn.disabled = current === 0;
            if (nextBtn) nextBtn.disabled = current >= maxIndex();
        };

        const next = () => goTo(current + 1 > maxIndex() ? 0 : current + 1);
        const prev = () => goTo(current - 1 < 0 ? maxIndex() : current - 1);

        const startAuto = () => {
            stopAuto();
            autoTimer = setInterval(next, 4000);
        };
        const stopAuto = () => { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } };

        // Build dots
        if (dotsEl) {
            dotsEl.innerHTML = repos.map((_, i) =>
                `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-idx="${i}" aria-label="Go to repo ${i+1}"></button>`
            ).join('');
            dotsEl.querySelectorAll('.carousel-dot').forEach(dot => {
                dot.addEventListener('click', () => { goTo(+dot.dataset.idx); startAuto(); });
            });
        }

        // Nav buttons
        if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { prev(); startAuto(); }
            if (e.key === 'ArrowRight') { next(); startAuto(); }
        });

        // Pause on hover
        if (wrapper) {
            wrapper.addEventListener('mouseenter', stopAuto);
            wrapper.addEventListener('mouseleave', startAuto);
        }

        // Touch swipe
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
        });

        // Recalculate on resize
        window.addEventListener('resize', () => goTo(current), { passive: true });

        // Init
        goTo(0);
        startAuto();

        // Scroll reveal for wrapper
        gsap.from('#projectsCarouselWrapper', {
            y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '#projectsCarouselWrapper', start: 'top 85%', toggleActions: 'play none none none' }
        });
        ScrollTrigger.refresh();
    };

    (async () => {
        try {
            const res = await fetch('https://api.github.com/users/Afra4509/repos?sort=updated&per_page=30');
            if (!res.ok) throw new Error();
            const data = await res.json();
            if (data.message) throw new Error();
            const filtered = data.filter(r => !r.fork && r.name !== 'Afra4509' && !r.name.includes('.github.io'));
            initCarousel(filtered.length ? filtered : fallbackProjects);
        } catch {
            initCarousel(fallbackProjects);
        }

    })();

    // =================== EMAILJS ===================
    if (typeof emailjs !== 'undefined') emailjs.init('CWMC8v90lTidiLI6O');
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('cf-name').value.trim();
            const email = document.getElementById('cf-email').value.trim();
            const message = document.getElementById('cf-message').value.trim();

            if (!name || !email || !message) return;

            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.querySelector('span').textContent = 'Sending...';

            try {
                await emailjs.sendForm('service_laqjruc', 'template_36bqmac', contactForm);
                contactForm.reset();
                feedback.className = 'form-feedback success';
                feedback.textContent = 'Message sent! I\'ll get back to you soon.';
                
                // Fire confetti!
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#ff00cc', '#333399', '#00f2fe', '#4facfe'],
                        zIndex: 100000
                    });
                }
            } catch (err) {
                feedback.className = 'form-feedback error';
                feedback.textContent = 'Something went wrong. Email me directly!';
            }
            feedback.style.display = 'block';
            setTimeout(() => { feedback.style.display = 'none'; }, 5000);
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.querySelector('span').textContent = 'Send Message';
        });
    }

    // =================== HERO CANVAS ANIMATION ===================
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const colors = ['#00f2fe', '#4facfe', '#ff00cc', '#ffffff'];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = Math.random() * 0.6 - 0.3;
                this.speedY = Math.random() * -0.6 - 0.2; // Float upwards
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = Math.random() * 0.6 + 0.1;
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            }
            update() {
                this.x += this.speedX + Math.sin(this.wobble) * 0.5;
                this.y += this.speedY;
                this.wobble += this.wobbleSpeed;

                if (this.y < -10) {
                    this.y = height + 10;
                    this.x = Math.random() * width;
                }
                if (this.x > width + 10) this.x = -10;
                if (this.x < -10) this.x = width + 10;
            }
            draw() {
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }
    
    // =================== GITHUB STATS ===================
    async function fetchGitHubStats() {
        try {
            const response = await fetch('https://api.github.com/users/Afra4509');
            if (response.ok) {
                const data = await response.json();
                document.getElementById('github-repos').textContent = data.public_repos || '--';
                document.getElementById('github-followers').textContent = data.followers || '--';
            }
        } catch (error) {
            console.error('Failed to fetch GitHub stats:', error);
        }
    }
    fetchGitHubStats();

    // =================== MOBILE MENU ===================
    const menuBtn = document.getElementById('menuToggle');
    const overlay = document.getElementById('mobileOverlay');

    if (menuBtn && overlay) {
        const toggleMenu = () => {
            const isActive = menuBtn.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        };
        menuBtn.addEventListener('click', toggleMenu);
        overlay.querySelectorAll('a').forEach(link => link.addEventListener('click', toggleMenu));
    }
});