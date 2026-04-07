// ✅ DOM yuklanganini kutamiz
document.addEventListener("DOMContentLoaded", () => {
  // ── CUSTOM CURSOR ──
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");

  // ✅ Faqat mouse qurilmalari uchun
  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice() && cursor && ring) {
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
    });

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effectlar
    const interactiveElements = document.querySelectorAll(
      "a, button, .project-row, .skill-item, .fact-box",
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.width = "16px";
        cursor.style.height = "16px";
        ring.style.width = "56px";
        ring.style.height = "56px";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.width = "10px";
        cursor.style.height = "10px";
        ring.style.width = "36px";
        ring.style.height = "36px";
      });
    });
  }

  // ── SCROLL REVEAL ──
  const reveals = document.querySelectorAll(".reveal");
  const skillItems = document.querySelectorAll(".skill-item");

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // ✅ Skill bar animation trigger
          if (entry.target.classList.contains("skills-grid")) {
            skillItems.forEach((item, index) => {
              setTimeout(() => item.classList.add("visible"), index * 100);
            });
          }

          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  reveals.forEach((r) => obs.observe(r));
  // Skills grid alohida kuzatilsin
  const skillsGrid = document.querySelector(".skills-grid");

  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Grid visible bo'lganda skill itemlarni ketma-ket animatsiya qilish
          skillItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add("visible");
            }, index * 80); // 80ms delay har bir item uchun
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  if (skillsGrid) {
    skillsObserver.observe(skillsGrid);
  }

  // ── TYPING EFFECT (Accessible version) ──
  const tag = document.querySelector(".hero-tag");
  if (tag && !isTouchDevice()) {
    const originalText = tag.textContent;
    const ariaLabel = tag.getAttribute("aria-label") || originalText;
    tag.setAttribute("aria-label", ariaLabel);

    // Screen readerlar uchun original matnni saqlaymiz
    tag.textContent = "";
    tag.style.animation = "none";
    tag.style.opacity = "1";

    let i = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        tag.textContent = originalText.slice(0, ++i);
        if (i >= originalText.length) {
          clearInterval(interval);
          // Animation tugagach aria-labelni to'liq qaytaramiz
          tag.setAttribute("aria-label", originalText);
        }
      }, 40);
    }, 600);
  }

  // ── PROJECT ROW CLICK HANDLER ──
  document.querySelectorAll(".project-row").forEach((row, index) => {
    const handleClick = (e) => {
      e.preventDefault();
      const projectName = row.querySelector(".project-name")?.textContent;
      console.log(`Project clicked: ${projectName} (#${index + 1})`);
      // ✅ Bu yerga real link yoki modal ochish kodini qo'shishingiz mumkin
      // window.location.href = `/projects/${index + 1}`;
    };

    row.addEventListener("click", handleClick);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(e);
      }
    });
  });

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ──
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
});

/* ── MOBILE MENU — JAVASCRIPT ── */

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const menuOverlay = document.getElementById("menu-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  // Menu ochish
  function openMenu() {
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("active");
    menuOverlay.classList.add("active");
    document.body.classList.add("menu-open");
    document.body.style.cursor = "none"; // Cursor yashirish
  }

  // Menu yopish
  function closeMenu() {
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
    document.body.classList.remove("menu-open");
    document.body.style.cursor = ""; // Cursor qaytarish
  }

  // Toggle menu
  function toggleMenu() {
    if (mobileMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Event listeners
  if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);

    // Keyboard accessibility (Enter va Space)
    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", closeMenu);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener("click", closeMenu);
  }

  // Link bosilganda menu yopilsin
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setTimeout(closeMenu, 300); // Smooth scroll uchun biroz kutamiz
    });
  });

  // ESC tugmasi bilan yopish
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  // Scroll paytida menu yopilsin (desktop)
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    if (window.innerWidth > 900 && mobileMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  // Window resize paytida menu yopilsin
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && mobileMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  console.log("✅ Mobile menu initialized!");
});