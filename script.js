// تحسين التفاعلات: تظليل روابط التنقل، تمرير سلس، تفعيل الرابط أثناء التمرير
const navLinks = document.querySelectorAll('.main-nav a');
const header = document.querySelector('.site-header');
const sections = document.querySelectorAll('main section[id]');

// Hover glow (keeps simple and performant)
navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => link.classList.add('hover'));
    link.addEventListener('mouseleave', () => link.classList.remove('hover'));
});

// Smooth scroll for internal links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
            // update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Highlight active nav on scroll
function onScroll() {
    const scrollPos = window.scrollY + 120; // offset to trigger a bit earlier
    sections.forEach(sec => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        const id = '#' + sec.id;
        const link = document.querySelector(`.main-nav a[href="${id}"]`);
        if (!link) return;
        if (scrollPos >= top && scrollPos < bottom) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });

    // sticky header effect (add small shadow when scrolled)
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);

    // small animated counters for hero stats (simple, client-side)
    function animateCounter(el, target) {
        if (!el) return;
        const start = 0;
        const duration = 900;
        const startTime = performance.now();
        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(start + (target - start) * progress);
            el.textContent = value + (target >= 10 ? '+' : '');
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    document.addEventListener('DOMContentLoaded', () => {
        // animate only once when hero in view
        const statEls = document.querySelectorAll('.hero-stats .stat strong');
        if (statEls.length >= 2) {
            // use IntersectionObserver for efficiency
            const obs = new IntersectionObserver((entries, o) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(statEls[0], 12);
                        animateCounter(statEls[1], 50);
                        o.disconnect();
                    }
                });
            }, {threshold: 0.4});
            const hero = document.querySelector('.hero');
            if (hero) obs.observe(hero);
        }

        // keyboard accessibility: add focus-visible styling helper
        document.querySelectorAll('.main-nav a').forEach(a => {
            a.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') a.click();
            });
        });
    });

// Contact form with actual email sending
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const message = form.querySelector('[name="message"]').value.trim();
        const result = form.querySelector('.form-result');

        if (!name || !email || !message) {
            result.textContent = 'يرجى ملء جميع الحقول.';
            result.style.color = '#ff6b6b';
            return;
        }

        result.textContent = 'جارٍ إرسال الرسالة...';
        result.style.color = 'var(--muted)';

        // Send email using a mailto link
        const mailtoLink = `mailto:engahmadshtat@gmail.com?subject=رسالة من ${name}&body=الاسم: ${name}%0D%0Aالبريد: ${email}%0D%0A%0D%0Aالرسالة:%0D%0A${message}`;
        window.location.href = mailtoLink;
        
        // Show success after mailto opens
        setTimeout(() => {
            result.textContent = 'تم فتح تطبيق البريد لإرسال الرسالة.';
            result.style.color = 'var(--accent-2)';
            form.reset();
        }, 500);
    });
}