"use strict";

/**
 * Jardelson Barbearia
 * Arquivo responsável pelas interações do site:
 * - Menu mobile
 * - Links de WhatsApp
 * - Preloader
 * - Efeito de brilho no cursor
 * - Animação de revelação ao rolar
 * - Link ativo no menu
 * - Botão voltar ao topo
 * - Texto com efeito de digitação
 * - Efeito 3D nos cards
 */

/* =========================================================
   1. CONFIGURAÇÕES GERAIS
========================================================= */

const CONFIG = {
  barbershopPhone: "5583998059479",
  instagramUrl: "https://www.instagram.com/barbeiro_jardel1/",
  defaultWhatsappMessage:
    "Olá, Jardelson Barbearia! Gostaria de tirar uma dúvida sobre o atendimento.",
  typingPhrases: [
    "Corte masculino com acabamento limpo",
    "Atendimento por ordem de chegada",
    "Terça a sábado em Remígio-PB",
    "Fale pelo WhatsApp ou Instagram",
  ],
  scrollOffset: 150,
  backToTopVisibilityPoint: 600,
  headerScrollPoint: 60,
};

/* =========================================================
   2. SELETORES DO DOM
========================================================= */

const DOM = {
  root: document.documentElement,
  menuToggle: document.querySelector(".menu-toggle"),
  navMenu: document.querySelector(".nav-menu"),
  navLinks: document.querySelectorAll(".nav-menu a[href^='#']"),
  sideLinks: document.querySelectorAll(".side-scroll a[href^='#']"),
  backToTopButton: document.querySelector(".back-to-top"),
  whatsappLinks: document.querySelectorAll(".js-whatsapp-link"),
  instagramLinks: document.querySelectorAll("a[href*='instagram.com']"),
  header: document.querySelector(".header"),
  preloader: document.querySelector("#preloader"),
  typingText: document.querySelector("#typingText"),
  revealElements: document.querySelectorAll(".reveal"),
  tiltCards: document.querySelectorAll(".tilt-card"),
};

/* =========================================================
   3. FUNÇÕES UTILITÁRIAS
========================================================= */

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function buildWhatsappUrl(message = CONFIG.defaultWhatsappMessage) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${CONFIG.barbershopPhone}?text=${encodedMessage}`;
}

function isElementAvailable(element) {
  return Boolean(element);
}

/* =========================================================
   4. LINKS EXTERNOS
========================================================= */

function updateDefaultWhatsappLinks() {
  if (!DOM.whatsappLinks.length) return;

  DOM.whatsappLinks.forEach((link) => {
    link.href = buildWhatsappUrl();
    link.target = "_blank";
    link.rel = "noopener";
  });
}

function updateInstagramLinks() {
  if (!DOM.instagramLinks.length) return;

  DOM.instagramLinks.forEach((link) => {
    link.href = CONFIG.instagramUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });
}

/* =========================================================
   5. MENU MOBILE
========================================================= */

function openMenu() {
  if (!DOM.navMenu || !DOM.menuToggle) return;

  DOM.navMenu.classList.add("open");
  DOM.menuToggle.classList.add("open");
  DOM.menuToggle.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  if (!DOM.navMenu || !DOM.menuToggle) return;

  DOM.navMenu.classList.remove("open");
  DOM.menuToggle.classList.remove("open");
  DOM.menuToggle.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  if (!DOM.navMenu || !DOM.menuToggle) return;

  const isOpen = DOM.navMenu.classList.contains("open");

  if (isOpen) {
    closeMenu();
    return;
  }

  openMenu();
}

function initMenu() {
  if (!DOM.menuToggle || !DOM.navMenu) return;

  DOM.menuToggle.addEventListener("click", toggleMenu);

  DOM.navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

/* =========================================================
   6. PRELOADER
========================================================= */

function initPreloader() {
  if (!DOM.preloader) return;

  window.addEventListener("load", () => {
    window.setTimeout(() => {
      DOM.preloader.classList.add("hide");
    }, 450);
  });
}

/* =========================================================
   7. EFEITO DE BRILHO NO CURSOR
========================================================= */

function initMouseGlow() {
  if (prefersReducedMotion()) return;

  window.addEventListener(
    "pointermove",
    (event) => {
      DOM.root.style.setProperty("--mouse-x", `${event.clientX}px`);
      DOM.root.style.setProperty("--mouse-y", `${event.clientY}px`);
    },
    { passive: true }
  );
}

/* =========================================================
   8. ANIMAÇÃO DE REVELAÇÃO AO ROLAR
========================================================= */

function initRevealAnimation() {
  if (!DOM.revealElements.length) return;

  if (!("IntersectionObserver" in window)) {
    DOM.revealElements.forEach((element) => {
      element.classList.add("visible");
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
    }
  );

  DOM.revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* =========================================================
   9. MENU ATIVO DURANTE A ROLAGEM
========================================================= */

function getCurrentSectionId() {
  const sections = document.querySelectorAll("main section[id]");
  let currentId = "inicio";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");
    const scrollPosition = window.scrollY + CONFIG.scrollOffset;

    const isCurrentSection =
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight;

    if (isCurrentSection) {
      currentId = sectionId;
    }
  });

  return currentId;
}

function updateActiveLinks(currentId) {
  const activeHref = `#${currentId}`;

  DOM.navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === activeHref);
  });

  DOM.sideLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === activeHref);
  });
}

function setActiveNavLink() {
  const currentId = getCurrentSectionId();
  updateActiveLinks(currentId);
}

/* =========================================================
   10. HEADER E BOTÃO VOLTAR AO TOPO
========================================================= */

function updateHeaderState() {
  if (!DOM.header) return;

  DOM.header.classList.toggle(
    "scrolled",
    window.scrollY > CONFIG.headerScrollPoint
  );
}

function updateBackToTopState() {
  if (!DOM.backToTopButton) return;

  DOM.backToTopButton.classList.toggle(
    "show",
    window.scrollY > CONFIG.backToTopVisibilityPoint
  );
}

function initBackToTop() {
  if (!DOM.backToTopButton) return;

  DOM.backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  });
}

/* =========================================================
   11. TEXTO COM EFEITO DE DIGITAÇÃO
========================================================= */

function initTypingAnimation() {
  if (!DOM.typingText || prefersReducedMotion()) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typePhrase() {
    const currentPhrase = CONFIG.typingPhrases[phraseIndex];

    DOM.typingText.textContent = currentPhrase.slice(0, charIndex);

    if (!isDeleting && charIndex < currentPhrase.length) {
      charIndex += 1;
      window.setTimeout(typePhrase, 55);
      return;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      window.setTimeout(typePhrase, 1200);
      return;
    }

    if (isDeleting && charIndex > 0) {
      charIndex -= 1;
      window.setTimeout(typePhrase, 28);
      return;
    }

    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % CONFIG.typingPhrases.length;
    window.setTimeout(typePhrase, 250);
  }

  typePhrase();
}

/* =========================================================
   12. EFEITO 3D NOS CARDS
========================================================= */

function applyTiltEffect(card, event) {
  const rect = card.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const rotateY = (x / rect.width - 0.5) * 6;
  const rotateX = (y / rect.height - 0.5) * -6;

  card.style.transform = `
    perspective(900px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    translateY(-4px)
  `;
}

function resetTiltEffect(card) {
  card.style.transform = "";
}

function initTiltCards() {
  if (prefersReducedMotion() || !DOM.tiltCards.length) return;

  DOM.tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      applyTiltEffect(card, event);
    });

    card.addEventListener("pointerleave", () => {
      resetTiltEffect(card);
    });
  });
}

/* =========================================================
   13. EVENTOS DE ROLAGEM
========================================================= */

function handleScroll() {
  updateHeaderState();
  updateBackToTopState();
  setActiveNavLink();
}

function initScrollEvents() {
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });

      ticking = true;
    },
    { passive: true }
  );

  handleScroll();
}

/* =========================================================
   14. INICIALIZAÇÃO
========================================================= */

function init() {
  updateDefaultWhatsappLinks();
  updateInstagramLinks();
  initMenu();
  initPreloader();
  initMouseGlow();
  initRevealAnimation();
  initBackToTop();
  initTypingAnimation();
  initTiltCards();
  initScrollEvents();
}

document.addEventListener("DOMContentLoaded", init);