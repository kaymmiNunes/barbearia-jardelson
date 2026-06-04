const BARBERSHOP_PHONE = "5583998059479";
const INSTAGRAM_URL = "https://www.instagram.com/barbeiro_jardel1/";

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a[href^='#']");
const sideLinks = document.querySelectorAll(".side-scroll a[href^='#']");
const backToTopButton = document.querySelector(".back-to-top");
const whatsappLinks = document.querySelectorAll(".js-whatsapp-link");
const header = document.querySelector(".header");
const preloader = document.querySelector("#preloader");
const typingText = document.querySelector("#typingText");

function buildWhatsappUrl(message) {
  return `https://wa.me/${BARBERSHOP_PHONE}?text=${encodeURIComponent(message)}`;
}

function updateDefaultWhatsappLinks() {
  const defaultMessage = "Olá, Jardelson Barbearia! Gostaria de tirar uma dúvida sobre o atendimento.";

  whatsappLinks.forEach((link) => {
    link.href = buildWhatsappUrl(defaultMessage);
  });
}

function toggleMenu() {
  if (!navMenu || !menuToggle) return;

  const isOpen = navMenu.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function closeMenu() {
  if (!navMenu || !menuToggle) return;

  navMenu.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function initMenu() {
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener("click", toggleMenu);
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
}

function initPreloader() {
  if (!preloader) return;

  window.addEventListener("load", () => {
    setTimeout(() => preloader.classList.add("hide"), 450);
  });
}

function initMouseGlow() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  window.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
  });
}

function initRevealAnimation() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

function setActiveNavLink() {
  const sections = document.querySelectorAll("main section[id]");
  const scrollPosition = window.scrollY + 150;
  let currentId = "inicio";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentId = sectionId;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });

  sideLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

function handleHeaderAndBackToTop() {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 60);
  }

  if (backToTopButton) {
    backToTopButton.classList.toggle("show", window.scrollY > 600);
  }
}

function initBackToTop() {
  if (!backToTopButton) return;

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initTypingAnimation() {
  if (!typingText) return;

  const phrases = [
    "Corte masculino com acabamento limpo",
    "Atendimento por ordem de chegada",
    "Terça a sábado em Remígio-PB",
    "Fale pelo WhatsApp ou Instagram"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    typingText.textContent = currentPhrase.slice(0, charIndex);

    if (!isDeleting && charIndex < currentPhrase.length) {
      charIndex += 1;
      setTimeout(type, 55);
      return;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(type, 1200);
      return;
    }

    if (isDeleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(type, 28);
      return;
    }

    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(type, 250);
  }

  type();
}

function initTiltCards() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const cards = document.querySelectorAll(".tilt-card");

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 6;
      const rotateX = ((y / rect.height) - 0.5) * -6;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

function initScrollEvents() {
  const onScroll = () => {
    handleHeaderAndBackToTop();
    setActiveNavLink();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function init() {
  updateDefaultWhatsappLinks();
  initMenu();
  initPreloader();
  initMouseGlow();
  initRevealAnimation();
  initBackToTop();
  initTypingAnimation();
  initTiltCards();
  initScrollEvents();
}

init();
