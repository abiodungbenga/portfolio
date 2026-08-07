/**
 * Gbenga Abiodun - Premium Developer Portfolio Logic
 * File: script.js
 * Vanilla JavaScript ES6+ (No external libraries required)
 */

document.addEventListener("DOMContentLoaded", () => {
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

/// Form Manager
const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.querySelector("span").textContent = "Sending...";
  status.textContent = "";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      status.textContent =
        "✅ Thank you! Your message has been sent successfully.";
      status.style.color = "#008838";
      form.reset();
    } else {
      status.textContent = "❌ Failed to send your message. Please try again.";
      status.style.color = "#ff4d4f";
    }
  } catch (error) {
    status.textContent = "⚠️ Network error. Please check your connection.";
    status.style.color = "#ff4d4f";
  }

  submitBtn.disabled = false;
  submitBtn.querySelector("span").textContent = "Send Message";
});

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
      ctx.fillStyle = "#008838";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#3cff9c";
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

  const roles = [
    "Flutter Developer",
    "Android Developer",
    "Ios Developer",
    "Mobile UI/UX Specialist",
  ];

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

  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
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

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    if (!name || !email || !message) {
      alert("Please complete all form fields.");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = "Sending...";
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = "✓ Message Sent!";
      submitBtn.style.background = "#00b74a";
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = "";
      }, 3000);
    }, 1200);
  });
}
