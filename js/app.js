/**
 * VARIEDADES CASERAS - LOGICA PRINCIPAL MEJORADA
 * ==============================================
 * Modalidad de pedidos por mensaje, renderizado de productos congelados,
 * inclinacion 3D fluida y sutil, scroll spy, cabecera dinamica, tema claro/oscuro,
 * lightbox accesible y contacto directo.
 */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initHeaderScroll();
  initScrollSpy();
  initSmoothLinks();
  initOrderStatusBar();
  initMobileNav();
  renderProducts();
  renderGallery();
  renderDeliveryZones();
  initSubtleTilt();
  initScrollAnimations();
  initLightbox();
  initContactForm();
  initLegalModal();
});

/* ================= UTILIDADES DE ACCESIBILIDAD ================= */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

function createModalController(modalEl, { openClass = "open", onAfterClose } = {}) {
  let lastFocusedEl = null;

  const isOpen = () => modalEl.classList.contains(openClass);

  const getFocusable = () =>
    Array.from(modalEl.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
      (el) => el.offsetParent !== null
    );

  const handleKeyDown = (e) => {
    if (!isOpen()) return;

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }

    if (e.key === "Tab") {
      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const open = (initialFocusEl) => {
    lastFocusedEl = document.activeElement;
    modalEl.classList.add(openClass);
    modalEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    const target = initialFocusEl || getFocusable()[0];
    if (target) {
      requestAnimationFrame(() => target.focus());
    }
  };

  const close = () => {
    if (!isOpen()) return;
    modalEl.classList.remove(openClass);
    modalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleKeyDown);

    if (typeof onAfterClose === "function") {
      onAfterClose();
    }

    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
    lastFocusedEl = null;
  };

  return { open, close, isOpen };
}

/* ================= 0. MODO CLARO / NOCTURNO ================= */
function initThemeToggle() {
  const btn = document.getElementById("themeToggleBtn");
  const meta = document.getElementById("themeColorMeta");
  if (!btn) return;

  const syncState = () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.setAttribute("aria-pressed", isDark ? "true" : "false");
    btn.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo nocturno");
    if (meta) {
      meta.setAttribute("content", isDark ? "#1A1410" : "#F7F3EC");
    }
  };

  syncState();

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const nextTheme = isDark ? "light" : "dark";

    if (nextTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    try {
      localStorage.setItem("variedades_caseras_theme", nextTheme);
    } catch (e) {}

    syncState();
  });
}

/* ================= 1. CABECERA DINÁMICA AL SCROLL ================= */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let ticking = false;

  function updateHeader() {
    if (window.scrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  updateHeader();
}

/* ================= 2. SCROLL SPY PARA NAVEGACIÓN ACTIVA ================= */
function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".desktop-nav .nav-link"));
  if (!sections.length || !navLinks.length) return;

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.getAttribute("id"));
          }
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (window.scrollY < 40) {
        setActiveLink(sections[0].getAttribute("id"));
      } else if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        setActiveLink(sections[sections.length - 1].getAttribute("id"));
      }
      ticking = false;
    });
  }, { passive: true });

  setActiveLink(sections[0].getAttribute("id"));
}

/* ================= 3. SCROLL SUAVE CON COMPENSACIÓN DE CABECERA ================= */
function initSmoothLinks() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector(".site-header");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 70;
      const targetPosition =
        targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  });
}

/* ================= 4. MODALIDAD DE ATENCIÓN Y PEDIDOS ================= */
function initOrderStatusBar() {
  const textEl = document.getElementById("statusText");
  const noteEl = document.getElementById("statusHoursText");

  if (textEl && CONFIG.orderModeNotice) {
    textEl.textContent = CONFIG.orderModeNotice;
  }
  if (noteEl && CONFIG.orderPickupNotice) {
    noteEl.textContent = CONFIG.orderPickupNotice;
  }
}

/* ================= 5. NAVEGACIÓN MÓVIL ================= */
function initMobileNav() {
  const toggleBtn = document.getElementById("mobileMenuBtn");
  const panel = document.getElementById("mobileNavPanel");

  if (!toggleBtn || !panel) return;

  const links = panel.querySelectorAll("a");

  const closeMenu = (restoreFocus = false) => {
    if (!panel.classList.contains("open")) return;
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("hidden", "");
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.setAttribute("aria-label", "Abrir menú de navegación");
    document.body.style.overflow = "";
    if (restoreFocus) toggleBtn.focus();
  };

  const openMenu = () => {
    panel.removeAttribute("hidden");
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");
    toggleBtn.setAttribute("aria-label", "Cerrar menú de navegación");
    document.body.style.overflow = "hidden";
    if (links[0]) {
      requestAnimationFrame(() => links[0].focus());
    }
  };

  toggleBtn.addEventListener("click", () => {
    if (panel.classList.contains("open")) {
      closeMenu(false);
    } else {
      openMenu();
    }
  });

  links.forEach((link) => {
    link.addEventListener("click", () => closeMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) {
      closeMenu(true);
    }
  });
}

/* ================= 6. RENDERIZADO EDITORIAL DE PRODUCTOS ================= */
function renderProducts() {
  const container = document.getElementById("productsContainer");
  if (!container || typeof PRODUCTS === "undefined") return;

  const getWaUrl = (q) => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(q)}`;

  const html = PRODUCTS.map((product, index) => {
    const isReversed = index % 2 === 1 ? " is-reversed" : "";
    const delayClass = index > 0 ? ` delay-${index}` : "";

    const fillingsBlock = product.fillings && product.fillings.length > 0
      ? `
          <div class="editorial-menu-box">
            <div class="editorial-menu-title">${product.fillingsTitle || "Variedades disponibles"}</div>
            <div class="editorial-fillings-list">
              ${product.fillings.map((f) => `
                <div class="editorial-filling-row">
                  <span class="filling-name">${f.name}:</span>
                  <span class="filling-detail">${f.detail}</span>
                </div>
              `).join("")}
            </div>
          </div>
        `
      : "";

    return `
      <article class="editorial-spread${isReversed} fade-in-up${delayClass}" id="producto-${product.id}">
        <div class="editorial-spread-media">
          <div class="editorial-photo-frame tilt-target">
            <picture>
              <source srcset="${product.image.replace('.jpg', '.webp')}" type="image/webp">
              <img src="${product.image}" alt="${product.imageAlt}" loading="lazy" decoding="async"
                width="${product.imageWidth || 896}" height="${product.imageHeight || 1200}">
            </picture>
          </div>
          <div class="editorial-photo-caption">
            <em>${product.imageCaption || product.imageAlt}</em>
          </div>
        </div>

        <div class="editorial-spread-story">
          <div class="editorial-spread-kicker">${product.kicker || "Elaboración casera"}</div>
          <h3 class="editorial-spread-title">${product.name}</h3>
          <p class="editorial-spread-subtitle">${product.subtitle}</p>
          <p class="editorial-spread-desc">${product.description}</p>
          ${fillingsBlock}
          <div class="editorial-format-note">${product.format}</div>

          <div class="editorial-action-row">
            <a href="${getWaUrl(product.whatsappQuery)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              ${product.ctaLabel || "Consultar disponibilidad"}
            </a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  container.innerHTML = html;
}

/* ================= 7. GALERÍA CON LIGHTBOX ACCESIBLE ================= */
function renderGallery() {
  const container = document.getElementById("galleryGrid");
  if (!container || typeof GALLERY === "undefined") return;

  const html = GALLERY.map((item, index) => `
    <figure class="gallery-item fade-in-up delay-${(index % 3) + 1}" data-index="${index}" tabindex="0" role="button" aria-label="Ampliar fotografía: ${item.title}">
      <picture>
        <source srcset="${item.image.replace('.jpg', '.webp')}" type="image/webp">
        <img src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async"
          width="${item.width || 1024}" height="${item.height || 1024}">
      </picture>
      <figcaption class="gallery-caption">
        <span>${item.title}</span>
        <span>${item.category}</span>
      </figcaption>
    </figure>
  `).join("");

  container.innerHTML = html;
}

function initLightbox() {
  const modal = document.getElementById("lightboxModal");
  const webpSource = document.getElementById("lightboxWebpSource");
  const modalImg = document.getElementById("lightboxImg");
  const modalCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxCloseBtn");
  const grid = document.getElementById("galleryGrid");

  if (!modal || !grid || !modalImg) return;

  const controller = createModalController(modal, {
    openClass: "open",
    onAfterClose: () => {
      modalImg.removeAttribute("src");
      modalImg.alt = "";
      if (webpSource) webpSource.setAttribute("srcset", "");
    }
  });

  const openLightboxItem = (item) => {
    const index = parseInt(item.getAttribute("data-index"), 10);
    const data = GALLERY[index];
    if (!data) return;

    if (webpSource) {
      webpSource.setAttribute("srcset", data.image.replace(".jpg", ".webp"));
    }
    modalImg.src = data.image;
    modalImg.alt = data.alt;
    modalCaption.textContent = `${data.title} — ${data.category}`;
    controller.open(closeBtn);
  };

  grid.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (item) openLightboxItem(item);
  });

  grid.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const item = e.target.closest(".gallery-item");
      if (item) {
        e.preventDefault();
        openLightboxItem(item);
      }
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", controller.close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) controller.close();
  });
}

/* ================= 8. ZONAS DE ENTREGA ================= */
function renderDeliveryZones() {
  const container = document.getElementById("deliveryZonesContainer");
  if (!container || !CONFIG.deliveryZones) return;

  const html = CONFIG.deliveryZones.map((z) => `
    <div class="delivery-zone-row">
      <span class="delivery-zone-name">${z.name}</span>
      <span class="delivery-zone-note">${z.note}</span>
    </div>
  `).join("");

  container.innerHTML = html;
}

/* ================= 9. INCLINACIÓN 3D SUTIL Y OPTIMIZADA ================= */
function initSubtleTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth < 1025) return;

  const targets = document.querySelectorAll(".tilt-target");

  targets.forEach((el) => {
    let frameId = null;

    el.addEventListener("mousemove", (e) => {
      if (frameId) cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4.5;
        const rotateY = ((x - centerX) / centerX) * 4.5;

        el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });
    }, { passive: true });

    el.addEventListener("mouseleave", () => {
      if (frameId) cancelAnimationFrame(frameId);
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

/* ================= 10. ANIMACIONES AL SCROLL (INTERSECTION OBSERVER) ================= */
function initScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in-up");

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach((el) => observer.observe(el));
}

/* ================= 11. FORMULARIO DE CONTACTO ================= */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nameInput = document.getElementById("inputName");
  const phoneInput = document.getElementById("inputPhone");
  const productSelect = document.getElementById("selectProduct");
  const notesInput = document.getElementById("inputNotes");
  const errorBox = document.getElementById("formError");

  const clearErrors = () => {
    [nameInput, phoneInput].forEach((input) => {
      if (input) {
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
      }
    });
    if (errorBox) {
      errorBox.textContent = "";
      errorBox.hidden = true;
    }
  };

  [nameInput, phoneInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true") {
          clearErrors();
        }
      });
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const name = nameInput ? nameInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const product = productSelect ? productSelect.value : "";
    const notes = notesInput ? notesInput.value.trim() : "";

    const missing = [];
    if (!name && nameInput) {
      nameInput.setAttribute("aria-invalid", "true");
      nameInput.setAttribute("aria-describedby", "formError");
      missing.push("nombre");
    }
    if (!phone && phoneInput) {
      phoneInput.setAttribute("aria-invalid", "true");
      phoneInput.setAttribute("aria-describedby", "formError");
      missing.push("teléfono");
    }

    if (missing.length > 0) {
      if (errorBox) {
        errorBox.textContent = `Por favor completá tu ${missing.join(" y ")} de contacto para enviar la consulta.`;
        errorBox.hidden = false;
      }
      const firstInvalid = !name ? nameInput : phoneInput;
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    let message = `Hola Variedades Caseras, me comunico desde la página web.\n`;
    message += `Nombre: ${name}\n`;
    message += `Teléfono: ${phone}\n`;
    if (product) message += `Producto de interés: ${product}\n`;
    if (notes) message += `Consulta: ${notes}\n`;
    message += `Quería consultar precio y disponibilidad.`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

/* ================= 12. MODAL DE AVISOS LEGALES ================= */
function initLegalModal() {
  const modal = document.getElementById("legalModal");
  const openBtns = [
    document.getElementById("footerLegalLink"),
    document.getElementById("footerPrivacyLink")
  ].filter(Boolean);
  const closeBtn = document.getElementById("legalCloseBtn");
  const confirmBtn = document.getElementById("legalConfirmBtn");
  const backdrop = document.getElementById("legalModalBackdrop");

  if (!modal) return;

  const controller = createModalController(modal, { openClass: "is-open" });

  openBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      controller.open(closeBtn || confirmBtn);
    })
  );
  if (closeBtn) closeBtn.addEventListener("click", controller.close);
  if (confirmBtn) confirmBtn.addEventListener("click", controller.close);
  if (backdrop) backdrop.addEventListener("click", controller.close);
}
