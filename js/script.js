// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Active link on scroll
const links = document.querySelectorAll('.site-nav a');
const sections = [...links].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

function onScroll() {
  const y = window.scrollY + 90;
  let current = null;
  sections.forEach(sec => {
    if (sec.offsetTop <= y) current = sec.id;
  });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll);
onScroll();

// Year
const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

// Count up (simple demo)
document.querySelectorAll('[data-count]').forEach(el => {
  const target = Number(el.dataset.count || '0');
  let n = 0;
  const step = Math.ceil(target / 40);
  const tick = () => {
    n += step;
    if (n >= target) { el.textContent = target + '%'; return; }
    el.textContent = n + '%';
    requestAnimationFrame(tick);
  };
  tick();
});

// Dark mode toggle
const themeToggle = document.querySelector('.theme-toggle');

// Function to set theme
function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    document.body.classList.remove('dark-mode');
    if (themeToggle) themeToggle.setAttribute('aria-pressed', 'false');
  }
  localStorage.setItem('theme', theme);
}

// Load theme on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else {
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

// Toggle theme on button click
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
}

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTopBtn');

function toggleScrollTopBtn() {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

if (scrollTopBtn) {
  window.addEventListener('scroll', toggleScrollTopBtn);
  scrollTopBtn.addEventListener('click', scrollToTop);
}

// Contact Form AJAX
const contactForm = document.querySelector('.fs-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // UI Loading State
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    const formData = new FormData(contactForm);
    const action = contactForm.action;

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = { message: await response.text() };
      }

      if (response.ok) {
        // Success
        btn.textContent = '¡Enviado!';
        btn.style.backgroundColor = '#22c55e'; // Green success
        contactForm.reset();
        console.log('Formulario enviado con éxito:', result);

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.disabled = false;
        }, 3000);
      } else {
        // Server Error (e.g., 4xx, 5xx)
        console.error('Error del servidor:', response.status, result);
        const errorMsg = result.errors
          ? result.errors.map(e => e.message).join(', ')
          : (result.message || 'Error desconocido');
        throw new Error(errorMsg);
      }
    } catch (err) {
      // Network Error or Server Error
      console.error('Error de red o de envío:', err);
      btn.textContent = 'Error al enviar';
      btn.style.backgroundColor = '#ef4444'; // Red error

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}
