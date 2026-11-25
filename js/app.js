/**
 * VARIEDADES CASERAS - LOGICA PRINCIPAL MEJORADA
 * ==============================================
 * Modalidad de pedidos por mensaje, renderizado de productos congelados,
 * inclinacion 3D fluida y sutil, scroll spy, cabecera dinamica, lightbox y contacto directo.
 */

document.addEventListener("DOMContentLoaded", () => {
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
  initCookieBanner();
});

/* ================= 1. CABECERA DINAMICA AL SCROLL ================= */
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

/* ================= 2. SCROLL SPY PARA NAVEGACION ACTIVA ================= */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".desktop-nav .nav-link");
  if (!sections.length || !navLinks.length) return;

  let ticking = false;

  function onScroll() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
}

/* ================= 3. SCROLL SUAVE CON COMPENSACION DE CABECERA ================= */
function initSmoothLinks() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector(".site-header");

  anchorLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 70;
      const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });
}

/* ================= 4. MODALIDAD DE ATENCION Y PEDIDOS ================= */
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

/* ================= 5. NAVEGACION MOVIL ================= */
function initMobileNav() {
  const toggleBtn = document.getElementById("mobileMenuBtn");
  const panel = document.getElementById("mobileNavPanel");

  if (!toggleBtn || !panel) return;

  const links = panel.querySelectorAll("a");

  toggleBtn.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  links.forEach(link => {
    link.addEventListener("click", () => {
      panel.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

/* ================= 6. RENDERIZADO EDITORIAL DE PRODUCTOS ================= */
function renderProducts() {
  const container = document.getElementById("productsContainer");
  if (!container) return;

  const getWaUrl = (q) => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(q)}`;

  const html = PRODUCTS.map((product, index) => {
    const isReversed = index % 2 === 1 ? " is-reversed" : "";
    const delayClass = index > 0 ? ` delay-${index}` : "";

    const fillingsBlock = product.fillings && product.fillings.length > 0
      ? `
          <div class="editorial-menu-box">
            <div class="editorial-menu-title">${product.fillingsTitle || "Variedades disponibles"}</div>
            <div class="editorial-fillings-list">
              ${product.fillings.map(f => `
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
              <img src="${product.image}" alt="${product.imageAlt}" loading="lazy" width="560" height="420">
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
            <a href="${getWaUrl(product.whatsappQuery)}" target="_blank" rel="noopener" class="btn btn-primary">
              ${product.ctaLabel || "Consultar disponibilidad"}
            </a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  container.innerHTML = html;
}

/* ================= 7. GALERIA CON LIGHTBOX ================= */
function renderGallery() {
  const container = document.getElementById("galleryGrid");
  if (!container) return;

  let html = "";
  GALLERY.forEach((item, index) => {
    html += `
      <figure class="gallery-item fade-in-up delay-${(index % 3) + 1}" data-index="${index}" tabindex="0" role="button" aria-label="Ampliar fotografía: ${item.title}">
        <picture>
          <source srcset="${item.image.replace('.jpg', '.webp')}" type="image/webp">
          <img src="${item.image}" alt="${item.alt}" loading="lazy" width="400" height="300">
        </picture>
        <figcaption class="gallery-caption">
          <span>${item.title}</span>
          <span>${item.category}</span>
        </figcaption>
      </figure>
    `;
  });

  container.innerHTML = html;
}

function initLightbox() {
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImg");
  const modalCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxCloseBtn");
  const grid = document.getElementById("galleryGrid");

  if (!modal || !grid) return;

  const openLightboxItem = (item) => {
    const index = parseInt(item.getAttribute("data-index"), 10);
    const data = GALLERY[index];
    if (!data) return;

    modalImg.src = data.image;
    modalImg.alt = data.alt;
    modalCaption.textContent = `${data.title} — ${data.category}`;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
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

  const closeModal = () => {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
}

/* ================= 8. ZONAS DE ENTREGA ================= */
function renderDeliveryZones() {
  const container = document.getElementById("deliveryZonesContainer");
  if (!container || !CONFIG.deliveryZones) return;

  let html = "";
  CONFIG.deliveryZones.forEach(z => {
    html += `
      <div class="delivery-zone-row">
        <span class="delivery-zone-name">${z.name}</span>
        <span class="delivery-zone-note">${z.note}</span>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ================= 9. INCLINACION 3D SUTIL Y OPTIMIZADA ================= */
function initSubtleTilt() {
  // Desactivar si el usuario prefiere movimiento reducido o si es pantalla tactil
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 1025) return;

  const targets = document.querySelectorAll(".tilt-target");

  targets.forEach(el => {
    let frameId = null;

    el.addEventListener("mousemove", (e) => {
      if (frameId) cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Inclinacion maxima sutil y controlada: 4.5 grados
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
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll(".fade-in-up").forEach(el => el.classList.add("is-visible"));
    return;
  }

  const elements = document.querySelectorAll(".fade-in-up");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach(el => observer.observe(el));
}

/* ================= 11. FORMULARIO DE CONTACTO ================= */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("inputName").value.trim();
    const phone = document.getElementById("inputPhone").value.trim();
    const product = document.getElementById("selectProduct").value;
    const notes = document.getElementById("inputNotes").value.trim();

    if (!name || !phone) {
      alert("Por favor completa tu nombre y telefono de contacto.");
      return;
    }

    let message = `Hola Variedades Caseras, me comunico desde la pagina web.\n`;
    message += `Nombre: ${name}\n`;
    message += `Telefono: ${phone}\n`;
    if (product) message += `Producto de interes: ${product}\n`;
    if (notes) message += `Consulta: ${notes}\n`;
    message += `Queria consultar precio y disponibilidad.`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank");
  });
}

/* ================= 12. MODAL DE AVISOS LEGALES ================= */
function initLegalModal() {
  const modal = document.getElementById("legalModal");
  const openBtns = [
    document.getElementById("footerLegalLink"),
    document.getElementById("footerPrivacyLink"),
    document.getElementById("cookieLegalBtn")
  ].filter(Boolean);
  const closeBtn = document.getElementById("legalCloseBtn");
  const confirmBtn = document.getElementById("legalConfirmBtn");
  const backdrop = document.getElementById("legalModalBackdrop");

  if (!modal) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  openBtns.forEach(btn => btn.addEventListener("click", openModal));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (confirmBtn) confirmBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

/* ================= 14. BANNER DE COOKIES (COOKIS) ================= */
function initCookieBanner() {
  const banner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("cookieAcceptBtn");
  if (!banner || !acceptBtn) return;

  try {
    const hasConsent = localStorage.getItem("variedades_caseras_cookie_consent");
    if (!hasConsent) {
      setTimeout(() => {
        banner.classList.add("is-visible");
      }, 700);
    }
  } catch (e) {
    banner.classList.add("is-visible");
  }

  acceptBtn.addEventListener("click", () => {
    try {
      localStorage.setItem("variedades_caseras_cookie_consent", "accepted");
    } catch (e) {}
    banner.classList.remove("is-visible");
  });

  const configBtn = document.getElementById("openCookieConfigBtn");
  if (configBtn) {
    configBtn.addEventListener("click", () => {
      banner.classList.add("is-visible");
    });
  }
}

