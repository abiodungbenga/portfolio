/**
 * Gbenga Abiodun - Premium Developer Portfolio Logic
 * File: script.js
 * Vanilla JavaScript ES6+ (No external libraries required)
 */

let portfolioContent = null;
let projectViewer = null;

document.addEventListener("DOMContentLoaded", async () => {
  projectViewer = createProjectViewer();
  await initPortfolioContent();
  initStaticProjectPreviews();

  // Initialize all interactive modules
  initPreloader();
  initThemeManager();
  initParticleBackground();
  initTypingEffect();
  initScrollObserver();
  initTiltEffect();
  initSpotlightEffect();
  initRippleEffect();
  initMobileNav();
  initIssuerLogos();
  initScrollProgress();
  initScrollToTop();
  initContactForm();
});

/* ==========================================================================
   1. PRELOADER
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  const barFill = document.querySelector(".preloader-bar-fill");
  if (!preloader || !barFill) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 25) + 10;
    if (progress >= 100) {
      progress = 100;
      barFill.style.width = "100%";
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add("loaded");
      }, 300);
    } else {
      barFill.style.width = `${progress}%`;
    }
  }, 60);
}

async function initPortfolioContent() {
  try {
    const response = await fetch("portfolio-content.json", {
      cache: "no-cache",
    });
    if (!response.ok) return;

    portfolioContent = await response.json();
    const getValue = (path) =>
      path.split(".").reduce((value, key) => value?.[key], portfolioContent);

    document.querySelectorAll("[data-content]").forEach((element) => {
      const value = getValue(element.dataset.content);
      if (typeof value === "string") element.textContent = value;
    });

    document.querySelectorAll("[data-content-src]").forEach((element) => {
      const value = getValue(element.dataset.contentSrc);
      if (typeof value === "string") element.setAttribute("src", value);
    });

    document.querySelectorAll("[data-content-href]").forEach((element) => {
      const path = element.dataset.contentHref;
      const value = getValue(path);
      if (typeof value !== "string") return;
      const href = path === "contact.email" ? `mailto:${value}` : value;
      if (/^(https?:\/\/|mailto:|\/|\.\/)/i.test(href)) {
        element.setAttribute("href", href);
      }
    });

    document.querySelectorAll("[data-content-video]").forEach((element) => {
      const videoId = getValue(element.dataset.contentVideo);
      const title = getValue(element.dataset.contentTitle);
      if (typeof videoId === "string") {
        const safeId = videoId.replace(/[^a-zA-Z0-9_-]/g, "");
        element.setAttribute(
          "src",
          `https://www.youtube-nocookie.com/embed/${safeId}`,
        );
      }
      if (typeof title === "string") element.setAttribute("title", title);
    });

    if (portfolioContent.site?.title) {
      document.title = portfolioContent.site.title;
    }
    if (portfolioContent.site?.description) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", portfolioContent.site.description);
    }

    renderContentList(
      "about.paragraphs",
      portfolioContent.about?.paragraphs,
      (item) => createContentElement("p", "", item.text),
    );
    renderContentList(
      "services.items",
      portfolioContent.services?.items,
      createServiceCard,
    );
    renderContentList(
      "projects.items",
      portfolioContent.projects?.items,
      createProjectCard,
    );
    renderContentList(
      "experience.jobs",
      portfolioContent.experience?.jobs,
      createExperienceItem,
    );
    renderContentList(
      "experience.certifications",
      portfolioContent.experience?.certifications,
      createCertificationItem,
    );
  } catch {
    portfolioContent = null;
  }
}

function renderContentList(path, items, createItem) {
  if (!Array.isArray(items)) return;

  document
    .querySelectorAll(`[data-content-list="${path}"]`)
    .forEach((container) => {
      container.replaceChildren(...items.map(createItem));
    });
}

function createContentElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text || "";
  return element;
}

function createServiceCard(service) {
  const card = createContentElement("article", "service-card reveal-fade-up");
  const icon = createContentElement("div", "service-icon");
  const image = createContentElement("img", "si-icon");
  image.src = service.icon || "";
  image.alt = service.iconAlt || service.title || "";
  image.loading = "lazy";
  icon.append(image);
  card.append(
    icon,
    createContentElement("h3", "service-title", service.title),
    createContentElement("p", "service-desc", service.description),
  );
  return card;
}

function createProjectCard(project) {
  const card = createContentElement("article", "project-card reveal-fade-up");
  const imageWrapper = createContentElement("div", "project-img-wrapper");
  const previewButton = createContentElement(
    "button",
    "project-preview-trigger",
  );
  previewButton.type = "button";
  previewButton.setAttribute(
    "aria-label",
    `View ${project.title || "project"} app previews`,
  );
  const image = createContentElement("img", "project-img");
  image.src = project.image || "";
  image.alt = project.alt || project.title || "";
  image.loading = "lazy";
  image.draggable = false;
  previewButton.append(
    image,
    createContentElement("div", "project-overlay"),
    createContentElement("span", "project-preview-label", "View app previews"),
  );
  previewButton.addEventListener("click", () => projectViewer?.open(project));
  imageWrapper.append(previewButton);

  const body = createContentElement("div", "project-body");
  const chips = createContentElement("div", "project-chips");
  (project.tags || []).forEach((tag) => {
    chips.append(createContentElement("span", "chip", tag.value));
  });
  body.append(
    createContentElement("h3", "project-title", project.title),
    createContentElement("p", "project-desc", project.description),
    chips,
  );
  card.append(imageWrapper, body);
  return card;
}

function initStaticProjectPreviews() {
  document
    .querySelectorAll(".projects-grid .project-card")
    .forEach((card) => {
      if (card.querySelector(".project-preview-trigger")) return;

      const image = card.querySelector(".project-img");
      const title = card.querySelector(".project-title")?.textContent?.trim();
      if (!image || !title) return;

      const project = {
        image: image.getAttribute("src"),
        alt: image.alt,
        title,
      };
      const wrapper = image.closest(".project-img-wrapper");
      if (!wrapper) return;

      const previewButton = createContentElement(
        "button",
        "project-preview-trigger",
      );
      previewButton.type = "button";
      previewButton.setAttribute("aria-label", `View ${title} app preview`);
      image.draggable = false;
      previewButton.append(
        image,
        wrapper.querySelector(".project-overlay") ||
          createContentElement("div", "project-overlay"),
        createContentElement(
          "span",
          "project-preview-label",
          "View app preview",
        ),
      );
      previewButton.addEventListener("click", () =>
        projectViewer?.open(project),
      );
      wrapper.replaceChildren(previewButton);
    });
}

function createProjectViewer() {
  const dialog = document.createElement("dialog");
  dialog.className = "project-viewer";
  dialog.setAttribute("aria-labelledby", "project-viewer-title");

  const panel = createContentElement("div", "project-viewer-panel");
  const header = createContentElement("header", "project-viewer-header");
  const heading = createContentElement("h2", "", "App previews");
  heading.id = "project-viewer-title";
  const count = createContentElement("span", "project-viewer-count");
  count.setAttribute("aria-live", "polite");
  count.setAttribute("aria-atomic", "true");
  const closeButton = createContentElement(
    "button",
    "project-viewer-close",
    "×",
  );
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close app previews");
  header.append(heading, count, closeButton);

  const stage = createContentElement("div", "project-viewer-stage");
  stage.tabIndex = 0;
  const image = createContentElement("img", "project-viewer-image");
  image.draggable = false;
  const previousButton = createContentElement(
    "button",
    "project-viewer-nav project-viewer-previous",
    "‹",
  );
  previousButton.type = "button";
  previousButton.setAttribute("aria-label", "Previous image");
  const nextButton = createContentElement(
    "button",
    "project-viewer-nav project-viewer-next",
    "›",
  );
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Next image");
  stage.append(image, previousButton, nextButton);

  const caption = createContentElement("p", "project-viewer-caption");
  panel.append(header, stage, caption);
  dialog.append(panel);
  document.body.append(dialog);

  let images = [];
  let activeIndex = 0;
  let opener = null;
  let pointerStart = null;

  const render = () => {
    const activeImage = images[activeIndex];
    if (!activeImage) return;

    image.src = activeImage.src;
    image.alt = activeImage.alt;
    count.textContent = `${activeIndex + 1} / ${images.length}`;
    caption.textContent = activeImage.caption;
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === images.length - 1;
  };

  const navigate = (direction) => {
    const nextIndex = activeIndex + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;
    activeIndex = nextIndex;
    render();
  };

  const open = (project) => {
    const cover = typeof project.image === "string" ? project.image : "";
    if (!cover) return;

    const title = project.title || "Project";
    heading.textContent = `${title} app previews`;
    const screenshots = Array.isArray(project.screenshots)
      ? project.screenshots
          .filter(
            (screenshot) =>
              screenshot &&
              typeof screenshot.image === "string" &&
              screenshot.image.trim(),
          )
          .map((screenshot) => ({
            src: screenshot.image,
            alt: screenshot.alt || `${title} app screenshot`,
          }))
      : [];

    images = [
      { src: cover, alt: project.alt || `${title} app preview` },
      ...screenshots,
    ].map((item) => ({
      ...item,
      caption: `${title} — ${item.alt}`,
    }));
    activeIndex = 0;
    opener = document.activeElement;
    render();
    dialog.showModal();
    closeButton.focus();
  };

  closeButton.addEventListener("click", () => dialog.close());
  previousButton.addEventListener("click", () => navigate(-1));
  nextButton.addEventListener("click", () => navigate(1));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => opener?.focus());
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(1);
    }
  });
  stage.addEventListener("pointerdown", (event) => {
    if (event.isPrimary) pointerStart = { x: event.clientX, y: event.clientY };
  });
  stage.addEventListener("pointerup", (event) => {
    if (!pointerStart) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      navigate(deltaX < 0 ? 1 : -1);
    }
  });
  stage.addEventListener("pointercancel", () => {
    pointerStart = null;
  });

  return { open };
}

function createExperienceItem(job) {
  const item = createContentElement("article", "experience-item");
  item.append(
    createContentElement("div", "experience-time", job.dates),
    createContentElement("h4", "experience-role", job.role),
    createContentElement("p", "experience-desc", job.description),
  );
  return item;
}

function createCertificationItem(certification) {
  const item = createContentElement("a", "certification-item");
  const url = certification.url || "#experience";
  if (/^https:\/\//i.test(url)) {
    item.href = url;
    item.target = "_blank";
    item.rel = "noopener noreferrer";
  }

  const top = createContentElement("div", "cert-item-top");
  const issuerClass =
    certification.issuer === "HP LIFE"
      ? "cert-logo-hp"
      : "cert-logo-simplilearn";
  const logo = createContentElement("span", `cert-logo ${issuerClass}`);
  const image = createContentElement("img", "issuer-logo");
  image.src = certification.logo || "";
  image.alt = `${certification.issuer || "Issuer"} logo`;
  image.loading = "lazy";
  const fallback = createContentElement(
    "span",
    "issuer-fallback",
    certification.issuer === "HP LIFE" ? "hp" : "SL",
  );
  fallback.setAttribute("aria-hidden", "true");
  logo.append(image, fallback);
  top.append(
    logo,
    createContentElement("span", "cert-badge", certification.badge),
  );
  item.append(
    top,
    createContentElement("h4", "cert-title", certification.title),
    createContentElement("p", "cert-meta", certification.meta),
  );
  return item;
}

/* ==========================================================================
   2. DARK / LIGHT THEME MANAGER
   ========================================================================== */
function initThemeManager() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  const themeIcon = document.getElementById("theme-icon");
  const htmlEl = document.documentElement;

  const sunSvg = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>`;
  const moonSvg = `<svg viewBox="0 0 24 24"><path d="M12.3 2c.43 0 .77.35.75.78-.34 6.27 4.67 11.28 10.94 10.94.43-.02.78.32.78.75 0 5.48-4.44 9.92-9.92 9.92C8.38 24.39 3.5 19.51 3.5 13.02 3.5 7.54 7.94 3.1 13.42 3.1c-.37-.36-.72-.73-1.12-1.1z"/></svg>`;

  const savedTheme = localStorage.getItem("gbenga_portfolio_theme") || "dark";
  setTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentTheme = htmlEl.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("gbenga_portfolio_theme", theme);
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", String(theme === "light"));
      toggleBtn.setAttribute(
        "aria-label",
        `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
      );
    }
    if (themeIcon) {
      themeIcon.innerHTML = theme === "dark" ? sunSvg : moonSvg;
    }
  }
}

/* ==========================================================================
   3. HERO CANVAS PARTICLE SYSTEM
   ========================================================================== */
function initParticleBackground() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  let particles = [];
  const particleCount = Math.min(Math.floor(width / 18), 70);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#00c853";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00c853";
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = 1 - dist / 130;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = `rgba(0, 255, 120, ${alpha * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });
}

/* ==========================================================================
   4. HERO TYPING ANIMATION (UPDATED ROLES)
   ========================================================================== */
function initTypingEffect() {
  const typingTarget = document.getElementById("typing-target");
  if (!typingTarget) return;

  const fallbackRoles = [
    "Flutter Developer",
    "Mobile Software Engineer",
    "Android Engineer",
    "Cross-Platform Expert",
    "Mobile App Architect",
    "UI/UX Enthusiast",
    "Firebase Specialist",
    "Problem Solver",
  ];
  const roles =
    portfolioContent?.hero?.roles
      ?.map((role) => role.title)
      .filter((role) => typeof role === "string" && role.length > 0) ||
    fallbackRoles;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const backSpeed = 45;
  const pauseDelay = 2200;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let currentSpeed = isDeleting ? backSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      currentSpeed = pauseDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      currentSpeed = 400;
    }

    setTimeout(type, currentSpeed);
  }

  type();
}

/* ==========================================================================
   5. INTERSECTION OBSERVER & SCROLL SPY
   ========================================================================== */
function initScrollObserver() {
  const revealElements = document.querySelectorAll(
    ".reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale",
  );

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");

        if (entry.target.classList.contains("stat-box")) {
          animateCounter(entry.target);
        }

        if (entry.target.classList.contains("progress-ring-card")) {
          animateProgressRing(entry.target);
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => revealObserver.observe(el));

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

function animateCounter(statBox) {
  const numEl = statBox.querySelector(".stat-number");
  // Only animate boxes that have an explicit data-target (skip text-only badges)
  if (!numEl || !numEl.hasAttribute("data-target")) return;

  const targetStr = numEl.getAttribute("data-target");
  const targetNum = parseInt(targetStr.replace(/\D/g, ""), 10);
  const suffix = targetStr.replace(/[0-9]/g, "");

  if (!targetNum) return;

  let current = 0;
  const duration = 1500;
  const stepTime = Math.abs(Math.floor(duration / targetNum));

  const timer = setInterval(
    () => {
      current += 1;
      numEl.textContent = `${current}${suffix}`;
      if (current >= targetNum) {
        numEl.textContent = targetStr;
        clearInterval(timer);
      }
    },
    Math.max(stepTime, 30),
  );
}

function animateProgressRing(ringCard) {
  const valCircle = ringCard.querySelector(".ring-circle-val");
  if (!valCircle) return;

  const targetPercent = parseInt(
    ringCard.getAttribute("data-percent") || "0",
    10,
  );
  const circumference = 283;
  const offset = circumference - (targetPercent / 100) * circumference;

  valCircle.style.strokeDashoffset = offset;
}

/* ==========================================================================
   6. 3D MOUSE TILT EFFECT FOR PROJECT CARDS
   ========================================================================== */
function initTiltEffect() {
  const tiltCards = document.querySelectorAll(".project-card, .service-card");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* ==========================================================================
   7. MOUSE SPOTLIGHT FOLLOW
   ========================================================================== */
function initSpotlightEffect() {
  const spotlight = document.getElementById("mouse-spotlight");
  if (!spotlight) return;

  window.addEventListener("mousemove", (e) => {
    spotlight.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  });
}

/* ==========================================================================
   8. RIPPLE EFFECT FOR BUTTONS
   ========================================================================== */
function initRippleEffect() {
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;

      const ripple = document.createElement("span");
      ripple.style.position = "absolute";
      ripple.style.width = "100px";
      ripple.style.height = "100px";
      ripple.style.background = "rgba(255, 255, 255, 0.4)";
      ripple.style.borderRadius = "50%";
      ripple.style.transform = "translate(-50%, -50%) scale(0)";
      ripple.style.animation = "ripple 0.6s linear";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.pointerEvents = "none";

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/* ==========================================================================
   9. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const navLinks = document.getElementById("nav-links");
  if (!menuBtn || !navLinks) return;
  const mobileQuery = window.matchMedia("(max-width: 768px)");

  const setMenuOpen = (isOpen) => {
    navLinks.classList.toggle("active", isOpen);
    navLinks.setAttribute(
      "aria-hidden",
      String(!isOpen && mobileQuery.matches),
    );
    navLinks.inert = !isOpen && mobileQuery.matches;
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute(
      "aria-label",
      isOpen ? "Close Navigation Menu" : "Open Navigation Menu",
    );
  };

  setMenuOpen(false);
  mobileQuery.addEventListener("change", () => setMenuOpen(false));

  menuBtn.addEventListener("click", () => {
    setMenuOpen(menuBtn.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuBtn.getAttribute("aria-expanded") === "true"
    ) {
      setMenuOpen(false);
      menuBtn.focus();
    }
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });
}

function initIssuerLogos() {
  document.querySelectorAll(".issuer-logo").forEach((logo) => {
    const showFallback = () => {
      logo.hidden = true;
    };

    logo.addEventListener("error", showFallback, { once: true });
    if (logo.complete && logo.naturalWidth === 0) showFallback();
  });
}

/* ==========================================================================
   10. SCROLL PROGRESS BAR & NAVBAR SCROLLED STATE
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById("scroll-progress");
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (navbar) {
      if (scrollTop > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  });
}

/* ==========================================================================
   11. SCROLL TO TOP
   ========================================================================== */
function initScrollToTop() {
  const btn = document.getElementById("scroll-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ==========================================================================
   12. CONTACT FORM VALIDATION & SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn?.querySelector("span");
  const status = document.getElementById("form-status");
  if (!submitBtn || !submitLabel || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitLabel.textContent = "Sending...";
    status.textContent = "";
    status.removeAttribute("data-state");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("The message could not be sent.");

      status.textContent =
        "Thanks for reaching out. Your message is on its way.";
      status.dataset.state = "success";
      form.reset();
    } catch {
      status.textContent =
        "Your message could not be sent. Please try again or email me directly.";
      status.dataset.state = "error";
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = "Send Message";
    }
  });
}
