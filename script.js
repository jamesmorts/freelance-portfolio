const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

// Header background once the page scrolls past the top
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// Mobile menu
const setMenu = (open) => {
    header.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
};

navToggle.addEventListener('click', () => {
    setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
});

navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('is-open')) {
        setMenu(false);
        navToggle.focus();
    }
});

document.addEventListener('click', (event) => {
    if (header.classList.contains('is-open') && !header.contains(event.target)) {
        setMenu(false);
    }
});

// Highlight the nav link for the section in view
const sectionLinks = new Map(
    [...navLinks]
        .filter((link) => !link.classList.contains('btn'))
        .map((link) => [document.querySelector(link.hash), link])
);

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        sectionLinks.get(entry.target)?.classList.toggle('is-active', entry.isIntersecting);
    });
}, { rootMargin: '-45% 0px -50% 0px' });

sectionLinks.forEach((_, section) => section && sectionObserver.observe(section));

// Fade sections in as they scroll into view
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Submit forms to Getform in the background and show the result inline
document.querySelectorAll('.js-form').forEach((form) => {
    const button = form.querySelector('[type="submit"]');
    const status = form.querySelector('.form-status');
    const buttonText = button.textContent;

    const setStatus = (message, type) => {
        status.textContent = message;
        status.classList.toggle('is-success', type === 'success');
        status.classList.toggle('is-error', type === 'error');
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        button.disabled = true;
        button.textContent = 'Sending…';
        setStatus('', null);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            form.reset();
            setStatus(form.dataset.success, 'success');
        } catch {
            setStatus('Sorry, something went wrong. Please try again, or call me on 0411 676 391.', 'error');
        } finally {
            button.disabled = false;
            button.textContent = buttonText;
        }
    });
});

document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
});
