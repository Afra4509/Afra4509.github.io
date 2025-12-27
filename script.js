// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // =================== LOADING SCREEN ===================
    const loader = document.getElementById('loader');
    
    // Minimum display time for smooth UX
    const minLoadTime = 1000;
    const startTime = Date.now();
    
    // Hide loader after page loads
    window.addEventListener('load', () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(minLoadTime - elapsedTime, 0);
        
        setTimeout(() => {
            if (loader) {
                loader.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }
        }, remainingTime);
    });

    // =================== SCROLL PROGRESS BAR ===================
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    // Get DOM elements
    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const themeToggle = document.querySelector('.theme-toggle-floating');
    const header = document.getElementById('header');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const skillLevels = document.querySelectorAll('.skill-level');
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');

    // Check if dark mode is enabled in local storage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
    } else {
        if (themeToggle) themeToggle.setAttribute('aria-pressed', 'false');
    }

    // =================== SCROLL REVEAL ANIMATION ===================
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        scrollRevealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
    };
    
    // Initial check on load
    revealOnScroll();
    
    // Check on scroll with throttle for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            revealOnScroll();
            scrollTimeout = null;
        }, 10);
    });

    // =================== SMOOTH PARALLAX EFFECT ===================
    const parallaxElements = document.querySelectorAll('.orb');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        parallaxElements.forEach((el, index) => {
            const speed = 0.1 + (index * 0.05);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // =================== MAGNETIC BUTTON EFFECT ===================
    const magneticButtons = document.querySelectorAll('.btn');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // =================== TEXT SCRAMBLE EFFECT ===================
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise(resolve => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    // Apply scramble effect to hero title on load
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        const scrambler = new TextScramble(heroTitle);
        
        setTimeout(() => {
            scrambler.setText(originalText);
        }, 500);
    }

    // =================== CURSOR TRAIL EFFECT ===================
    const createCursorTrail = () => {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        
        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animate = () => {
            trailX += (mouseX - trailX) * 0.1;
            trailY += (mouseY - trailY) * 0.1;
            
            trail.style.left = trailX + 'px';
            trail.style.top = trailY + 'px';
            
            requestAnimationFrame(animate);
        };
        
        animate();
    };
    
    // Only create cursor trail on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches) {
        createCursorTrail();
    }

    // Function to handle sticky navbar and scroll progress
    function handleScroll() {
        // Scroll progress bar
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide scroll indicator on scroll
        if (scrollIndicator) {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }

        // Activate nav items based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });

        // Animate skill bars when in view
        skillLevels.forEach(skill => {
            const skillSection = document.getElementById('skills');
            if (skillSection) {
                const sectionTop = skillSection.offsetTop;
                const sectionHeight = skillSection.offsetHeight;
                const windowHeight = window.innerHeight;
                
                if (window.scrollY > (sectionTop - windowHeight + 200) && window.scrollY < (sectionTop + sectionHeight)) {
                    const level = skill.getAttribute('data-level');
                    skill.style.width = `${level}%`;
                }
            }
        });
    }

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when a link is clicked
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Dark/Light theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            // Save preference to local storage
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('darkMode', 'enabled');
                this.setAttribute('aria-pressed', 'true');
            } else {
                localStorage.setItem('darkMode', null);
                this.setAttribute('aria-pressed', 'false');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =================== BUTTON RIPPLE EFFECT ===================
    const buttons = document.querySelectorAll('.btn, .btn-submit');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Handle form submission - Real email via Web3Forms
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Build FormData from the form
            const formData = new FormData(contactForm);
            
            // Optional: append page info
            formData.append('referer', window.location.href);
            
            // Show loading state on button
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';

            // Remove any existing status
            const existingMsg = contactForm.querySelector('.form-success');
            if (existingMsg) existingMsg.remove();
            
            try {
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                
                if (data.success) {
                    // Reset form and show success
                    contactForm.reset();
                    const successMsg = document.createElement('div');
                    successMsg.className = 'form-success';
                    successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Your message has been sent successfully!';
                    contactForm.appendChild(successMsg);
                    
                    setTimeout(() => {
                        successMsg.style.opacity = '0';
                        setTimeout(() => successMsg.remove(), 300);
                    }, 5000);
                } else {
                    // Show error feedback
                    alert('Failed to send message: ' + (data.message || 'Unknown error'));
                    // Fallback to mailto if API fails
                    const name = document.getElementById('name').value;
                    const email = document.getElementById('email').value;
                    const userSubject = document.getElementById('subject').value;
                    const message = document.getElementById('message').value;
                    const mailtoLink = `mailto:afrafadmadinata@gmail.com?subject=${encodeURIComponent('[Portfolio] ' + (userSubject || 'New Message'))}&body=${encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)}`;
                    window.location.href = mailtoLink;
                }
            } catch (err) {
                alert('Network error: Unable to send your message right now.');
                console.error('Web3Forms error:', err);
                // Fallback to mailto on network error
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const userSubject = document.getElementById('subject').value;
                const message = document.getElementById('message').value;
                const mailtoLink = `mailto:afrafadmadinata@gmail.com?subject=${encodeURIComponent('[Portfolio] ' + (userSubject || 'New Message'))}&body=${encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)}`;
                window.location.href = mailtoLink;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }
        });
    }

    // Initial scroll handler call to set initial states
    handleScroll();

    // Add scroll event listener with throttle for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Add scroll reveal animation with IntersectionObserver
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scrolled');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        scrollElements.forEach((el) => io.observe(el));
    } else {
        // Fallback for older browsers
        scrollElements.forEach((el) => el.classList.add('scrolled'));
    }

    // Subtle parallax effect on hero orbs
    const hero = document.getElementById('hero');
    const orbs = document.querySelectorAll('.bg-orbs .orb');
    
    if (hero && orbs.length > 0) {
        let rafId;
        
        hero.addEventListener('mousemove', (e) => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                orbs.forEach((orb, idx) => {
                    const strength = (idx + 1) * 15;
                    orb.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
                });
            });
        });

        hero.addEventListener('mouseleave', () => {
            cancelAnimationFrame(rafId);
            orbs.forEach((orb) => {
                orb.style.transform = 'translate(0, 0)';
                orb.style.transition = 'transform 0.5s ease';
            });
        });

        hero.addEventListener('mouseenter', () => {
            orbs.forEach((orb) => {
                orb.style.transition = 'none';
            });
        });
    }

    // Add typing effect to hero subtitle (optional enhancement)
    const heroSubtitle = document.querySelector('.hero-content h2');
    if (heroSubtitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.classList.add('typing-active');
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            } else {
                // Remove cursor after typing
                setTimeout(() => {
                    heroSubtitle.classList.remove('typing-active');
                }, 1000);
            }
        };
        
        // Start typing after a short delay
        setTimeout(typeWriter, 2000);
    }

    // =================== STAT COUNTER ANIMATION ===================
    const animateStats = () => {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target + '+';
                }
            };
            
            updateCount();
        });
    };

    // Trigger stat animation when about section is visible
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statObserver.observe(aboutSection);
    }

    // =================== GITHUB PROJECTS INTEGRATION ===================
    const loadGitHubProjects = async () => {
        const projectsContainer = document.getElementById('github-projects');
        if (!projectsContainer) return;

        const username = 'Afra4509';
        
        // Fallback projects data (used when API fails or rate limited)
        const fallbackProjects = [
            {
                name: 'PRANK-WIFI-SMADA',
                description: 'Prank wifi dan ketika murid mulai menekan tombol pada log page, akan ada suara misterius',
                language: 'C++',
                html_url: 'https://github.com/Afra4509/PRANK-WIFI-SMADA',
                homepage: 'https://afra4509.github.io/PRANK-WIFI-SMADA/',
                stargazers_count: 0,
                forks_count: 0,
                topics: ['Arduino', 'C++']
            },
            {
                name: 'aplikasi-klasifikasi-gorengan',
                description: 'Teknologi tensorflow membuat kasir bisa mengklasifikasi gambar lalu mengeluarkan output harganya',
                language: 'Python',
                html_url: 'https://github.com/Afra4509/aplikasi-klasifikasi-gorengan',
                homepage: 'https://aplikasi-klasifikasi-gorengan.streamlit.app/',
                stargazers_count: 0,
                forks_count: 0,
                topics: ['Python', 'Machine Learning', 'Streamlit']
            },
            {
                name: 'termodinamika',
                description: 'Aplikasi ini bertujuan untuk menghitung atau sebagai kalkulator fisika yaitu termodinamika',
                language: 'R',
                html_url: 'https://github.com/Afra4509/termodinamika',
                homepage: 'https://afra1502.shinyapps.io/fisikasenopati/',
                stargazers_count: 0,
                forks_count: 0,
                topics: ['R', 'Statistics']
            },
            {
                name: 'CekFollower',
                description: 'Web ini digunakan untuk membandingkan siapa saja yang tidak memfollow balik instagram kita',
                language: 'HTML',
                html_url: 'https://github.com/Afra4509/CekFollower',
                homepage: 'https://afra4509.github.io/CekFollower/',
                stargazers_count: 0,
                forks_count: 0,
                topics: ['HTML', 'JavaScript']
            },
            {
                name: 'afrachiper',
                description: 'Web ini sebagai decrypt juga encrypt kode shift Cipher serta bruteforce',
                language: 'HTML',
                html_url: 'https://github.com/Afra4509/afrachiper',
                homepage: 'https://afra4509.github.io/afrachiper/',
                stargazers_count: 0,
                forks_count: 0,
                topics: ['Cryptography', 'JavaScript']
            },
            {
                name: 'afra-fadhma-dinata',
                description: 'Personal portfolio website showcasing my projects and skills',
                language: 'HTML',
                html_url: 'https://github.com/Afra4509/afra-fadhma-dinata',
                homepage: 'https://afra4509.github.io/afra-fadhma-dinata/',
                stargazers_count: 0,
                forks_count: 0,
                topics: ['Portfolio', 'HTML', 'CSS']
            }
        ];

        const renderProjects = (repos) => {
            projectsContainer.innerHTML = repos.map(repo => {
                const languageClass = repo.language ? repo.language.toLowerCase().replace(/[^a-z]/g, '') : '';
                const description = repo.description || 'No description available';
                const homepage = repo.homepage;
                
                return `
                    <div class="project-item card-neo">
                        <div class="project-info">
                            <div class="project-meta">
                                ${repo.language ? `
                                    <span class="project-language">
                                        <span class="language-dot ${languageClass}"></span>
                                        ${repo.language}
                                    </span>
                                ` : ''}
                                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                            </div>
                            <h3>${repo.name.replace(/-/g, ' ')}</h3>
                            <p>${description}</p>
                            <div class="project-tags">
                                ${repo.topics && repo.topics.length > 0 
                                    ? repo.topics.slice(0, 3).map(topic => `<span>${topic}</span>`).join('')
                                    : repo.language ? `<span>${repo.language}</span>` : ''
                                }
                            </div>
                            <div class="project-links">
                                ${homepage ? `<a href="${homepage}" class="btn btn-sm" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                                <a href="${repo.html_url}" class="btn btn-sm btn-outline" target="_blank"><i class="fab fa-github"></i> Source</a>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Re-apply scroll reveal to new elements
            const newCards = projectsContainer.querySelectorAll('.project-item');
            newCards.forEach((card, idx) => {
                card.style.opacity = '0';
                card.style.animation = `slideUp 0.6s ease forwards ${0.1 + idx * 0.1}s`;
            });
        };
        
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
            
            if (!response.ok) throw new Error('Failed to fetch');
            
            const repos = await response.json();
            
            // Check if rate limited
            if (repos.message && repos.message.includes('rate limit')) {
                throw new Error('Rate limited');
            }
            
            // Filter out forked repos and the profile repo
            const filteredRepos = repos.filter(repo => 
                !repo.fork && repo.name !== username && repo.name !== `${username}.github.io`
            ).slice(0, 6);

            if (filteredRepos.length === 0) {
                renderProjects(fallbackProjects);
                return;
            }

            renderProjects(filteredRepos);

        } catch (error) {
            console.error('Error fetching GitHub repos, using fallback:', error);
            // Use fallback projects when API fails
            renderProjects(fallbackProjects);
        }
    };

    // Load GitHub projects
    loadGitHubProjects();

    // Add button ripple effect
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                pointer-events: none;
                width: 100px;
                height: 100px;
                left: ${x - 50}px;
                top: ${y - 50}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});