(function initNavbarState() {
  const header = document.getElementById("navbar");
  if (!header) return;

  const handleScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
})();

(function initMobileNav() {
  const button = document.getElementById("hamburger");
  const menu = document.getElementById("mobile-nav");
  if (!button || !menu) return;

  const setOpen = (open) => {
    button.classList.toggle("open", open);
    menu.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
  };

  button.addEventListener("click", () => {
    const isOpen = menu.classList.contains("open");
    setOpen(!isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
})();

(function initReveal() {
  const revealed = document.querySelectorAll(".reveal");
  if (!revealed.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealed.forEach((item) => observer.observe(item));
})();

(function initCounters() {
  const counters = document.querySelectorAll(".count");
  if (!counters.length) return;

  const animate = (node) => {
    const target = Number(node.dataset.count || 0);
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = String(Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
})();

(function initActiveLinks() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((section) => observer.observe(section));
})();

(function initSmoothAnchors() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      const target = href ? document.querySelector(href) : null;
      if (!target) return;

      event.preventDefault();
      const headerOffset = document.getElementById("navbar")?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset + 1;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();

(function initContactFeedback() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const button = form.querySelector(".form-submit");
  if (!button) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const initial = button.textContent;
    button.disabled = true;
    button.textContent = "Message envoyé";

    window.setTimeout(() => {
      form.reset();
      button.disabled = false;
      button.textContent = initial;
    }, 2200);
  });
})();
