const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const reqButton = document.querySelector('.req-button');
const header = document.querySelector('header');
const contactForm = document.querySelector('.contact-form');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const messageField = document.getElementById('message');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function animateScroll(targetY, duration = 800) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutQuad(progress);
    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function scrollToSection(targetId) {
  const targetElement = document.querySelector(targetId);
  if (!targetElement) return;

  const headerHeight = header ? header.offsetHeight : 0;
  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

  animateScroll(targetPosition, 900);
}

function closeMobileNav() {
  if (!navLinks || !burger) return;
  if (navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
}

function toggleMobileNav() {
  if (!burger || !navLinks) return;
  const isOpen = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function handleNavLinkClick(event) {
  const link = event.currentTarget;
  const href = link.getAttribute('href');

  if (href && href.startsWith('#')) {
    event.preventDefault();
    scrollToSection(href);
  }

  closeMobileNav();
}

function handleDocumentClick(event) {
  if (!navLinks || !burger) return;
  if (!navLinks.classList.contains('open')) return;

  const clickIsInsideNav = navLinks.contains(event.target) || burger.contains(event.target);
  if (!clickIsInsideNav) {
    closeMobileNav();
  }
}

function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    closeMobileNav();
  }
}

function handleResize() {
  if (window.innerWidth > 768) {
    closeMobileNav();
  }
}

function setFieldError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}-error`);
  const field = document.getElementById(fieldId);
  if (errorElement && field) {
    errorElement.textContent = message;
    errorElement.style.color = message ? '#d93025' : '';
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) {
      field.style.borderColor = '#d93025';
      field.classList.add('invalid');
    } else {
      field.style.borderColor = '';
      field.classList.remove('invalid');
    }
  }
}

function validateForm() {
  let isValid = true;
  const nameValue = nameField?.value.trim() || '';
  const emailValue = emailField?.value.trim() || '';
  const messageValue = messageField?.value.trim() || '';

  if (!nameValue) {
    setFieldError('name', 'Ad və soyad boş ola bilməz.');
    isValid = false;
  } else {
    setFieldError('name', '');
  }

  if (!emailValue) {
    setFieldError('email', 'Email boş ola bilməz.');
    isValid = false;
  } else if (!emailRegex.test(emailValue)) {
    setFieldError('email', 'Zəhmət olmasa düzgün email daxil edin.');
    isValid = false;
  } else {
    setFieldError('email', '');
  }

  if (!messageValue) {
    setFieldError('message', 'Mesaj boş ola bilməz.');
    isValid = false;
  } else {
    setFieldError('message', '');
  }

  return isValid;
}

function focusFirstErrorField() {
  if (!contactForm) return;
  const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
  if (firstInvalid) {
    firstInvalid.focus();
  }
}

if (burger && navLinks) {
  burger.addEventListener('click', toggleMobileNav);

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', handleNavLinkClick);
  });

  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keyup', handleEscapeKey);
  window.addEventListener('resize', handleResize);
}

const internalAnchorLinks = document.querySelectorAll('a[href^="#"]');
internalAnchorLinks.forEach((link) => {
  if (link.closest('.nav-links')) return;

  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href) return;

    event.preventDefault();
    scrollToSection(href);
  });
});

if (reqButton) {
  reqButton.addEventListener('click', () => {
    const targetId = reqButton.dataset.target;
    if (targetId) {
      scrollToSection(targetId);
    }
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      focusFirstErrorField();
      return;
    }

    setFieldError('name', '');
    setFieldError('email', '');
    setFieldError('message', '');

    contactForm.reset();
    alert('Mesajınız uğurla göndərildi!');
  });
}