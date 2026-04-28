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
  const status = document.getElementById("form-status");
  const modal = document.getElementById("success-modal");
  if (!button || !status || !modal) return;

  const fields = {
    nom: form.elements.namedItem("nom"),
    email: form.elements.namedItem("email"),
    telephone: form.elements.namedItem("telephone"),
    service: form.elements.namedItem("service"),
    message: form.elements.namedItem("message")
  };
  const initialLabel = button.textContent;
  const phonePattern = /^[+\d\s().-]{8,20}$/;
  const modalCloseButtons = modal.querySelectorAll("[data-close-modal]");
  let lastFocusedElement = null;

  const setFieldError = (name, message) => {
    const field = fields[name];
    const label = field?.closest("label");
    const error = form.querySelector(`[data-error-for="${name}"]`);
    if (!field || !label || !error) return;

    field.setAttribute("aria-invalid", String(Boolean(message)));
    label.classList.toggle("has-error", Boolean(message));
    error.textContent = message;
  };

  const clearStatus = () => {
    status.textContent = "";
    status.className = "form-status";
  };

  const setStatus = (message, type) => {
    status.textContent = message;
    status.className = `form-status is-visible is-${type}`;
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastFocusedElement?.focus();
  };

  const openModal = () => {
    lastFocusedElement = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".success-modal__action")?.focus();
  };

  const validateField = (name) => {
    const field = fields[name];
    if (!field) return true;

    const value = field.value.trim();
    let message = "";

    if (name === "nom") {
      if (!value) message = "Veuillez renseigner votre nom complet.";
      else if (value.length < 2) message = "Le nom doit contenir au moins 2 caracteres.";
    }

    if (name === "email") {
      if (!value) message = "Veuillez renseigner votre adresse email.";
      else if (!field.validity.valid) message = "Veuillez entrer une adresse email valide.";
    }

    if (name === "telephone") {
      if (value && !phonePattern.test(value)) {
        message = "Veuillez entrer un numero de telephone valide.";
      }
    }

    if (name === "service" && !value) {
      message = "Veuillez selectionner le service concerne.";
    }

    if (name === "message") {
      if (!value) message = "Veuillez decrire votre besoin.";
      else if (value.length < 20) {
        message = "Votre message doit contenir au moins 20 caracteres.";
      }
    }

    setFieldError(name, message);
    return !message;
  };

  const validateForm = () => {
    const names = Object.keys(fields);
    const results = names.map((name) => validateField(name));
    return results.every(Boolean);
  };

  Object.keys(fields).forEach((name) => {
    const field = fields[name];
    if (!field) return;

    const eventName =
      field.tagName === "SELECT" ? "change" : "input";

    field.addEventListener(eventName, () => {
      validateField(name);
      if (status.classList.contains("is-error")) clearStatus();
    });
  });

  modalCloseButtons.forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    clearStatus();
    const isValid = validateForm();
    if (!isValid) {
      setStatus(
        "Merci de verifier les informations en surbrillance avant l'envoi de votre demande.",
        "error"
      );
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }

    button.disabled = true;
    button.textContent = "Envoi en cours...";

    window.setTimeout(() => {
      form.reset();
      Object.keys(fields).forEach((name) => setFieldError(name, ""));
      button.disabled = false;
      button.textContent = initialLabel;
      clearStatus();
      openModal();
    }, 900);
  });
})();
