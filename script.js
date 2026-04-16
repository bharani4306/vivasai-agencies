(() => {
  // TODO: Replace these placeholders with real business details.
  // - phoneNumber: digits only with country code, ex: "919876543210"
  // - whatsappNumber: digits only with country code, ex: "919876543210"
  const config = {
    // From vivasaiagencies.com (update if your business numbers change)
    phoneNumber: "9600945746",
    whatsappNumber: "9600945746"
  };

  const getDigitsOnly = (value) => String(value || "").replace(/\D/g, "");

  const setBodyLang = (mode) => {
    document.body.dataset.lang = mode;
    localStorage.setItem("vivasai_lang", mode);
  };

  const initLanguageToggle = () => {
    const saved = localStorage.getItem("vivasai_lang");
    const initial = saved === "en" || saved === "ta" || saved === "both" ? saved : "both";
    setBodyLang(initial);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-lang");
        setBodyLang(mode);
        document.querySelectorAll(".lang-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    });

    // Ensure active button matches state.
    document.querySelectorAll(".lang-btn").forEach((b) => {
      const mode = b.getAttribute("data-lang");
      if (mode === initial) b.classList.add("is-active");
    });
  };

  const initMobileNav = () => {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  };

  const initCallLinks = () => {
    const phone = getDigitsOnly(config.phoneNumber);
    document.querySelectorAll('a[data-action="call"]').forEach((a) => {
      if (!phone) {
        // Disable broken placeholder links until user sets config.
        a.setAttribute("href", "#");
        a.addEventListener("click", (e) => {
          e.preventDefault();
          alert("Please set `phoneNumber` in `script.js` to enable Call buttons.");
        });
        return;
      }
      a.setAttribute("href", `tel:${phone}`);
    });
  };

  const openWhatsApp = (message) => {
    let whatsapp = getDigitsOnly(config.whatsappNumber);

    // WhatsApp `wa.me` usually needs country code (India: 91).
    // If the user entered 10-digit local number, prefix 91.
    if (whatsapp.length === 10) whatsapp = `91${whatsapp}`;
    if (!whatsapp) {
      alert("Please set `whatsappNumber` in `script.js` to enable WhatsApp buttons.");
      return;
    }
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const initWhatsAppButtons = () => {
    document.querySelectorAll('a[data-action="whatsapp"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();

        const product = a.getAttribute("data-product") || "";
        const category = a.getAttribute("data-category") || "";
        const msg = buildWhatsAppMessage({ product, category });

        openWhatsApp(msg);
      });
    });
  };

  const buildWhatsAppMessage = ({ product, category }) => {
    const city = "Kumbakonam";
    const p = product ? product : "Tractor / Equipment";
    const c = category ? category : "General Enquiry";

    // Keep message short and farm-user friendly.
    const en = `Hi VIVASAI AGENCIES, I'm interested in: ${p}\nCategory: ${c}\nCity: ${city}\nPlease share price & availability.`;
    const ta = `வணக்கம், விவசாய் ஏஜென்சீஸ்.\nஎனக்கு தேவையானது: ${p}\nவகை: ${c}\nஇடம்: ${city}\nவிலை மற்றும் கிடைப்புத் தகவல் தெரிவிக்கவும்.`;

    return `${en}\n\n${ta}`;
  };

  const initEnquiryButtons = () => {
    document.querySelectorAll(".enquiry-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const product = btn.getAttribute("data-product") || "";
        const category = btn.getAttribute("data-category") || "";
        const msg = buildWhatsAppMessage({ product, category });
        e.preventDefault();

        openWhatsApp(msg);
      });
    });
  };

  const initContactForm = () => {
    const form = document.querySelector("#contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector('input[name="name"]')?.value?.trim() || "";
      const mobile = form.querySelector('input[name="mobile"]')?.value?.trim() || "";
      const category = form.querySelector('select[name="category"]')?.value?.trim() || "General Enquiry";
      const message = form.querySelector('textarea[name="message"]')?.value?.trim() || "";

      const p = message ? message : "Tractor / Equipment / Service";
      const city = "Kumbakonam";

      const en = `Hi VIVASAI AGENCIES,\nName: ${name}\nMobile: ${mobile}\nCategory: ${category}\nCity: ${city}\nMessage: ${p}\n\nPlease share price & availability.`;
      const ta = `வணக்கம், விவசாய் ஏஜென்சீஸ்.\nபெயர்: ${name}\nமொபைல்: ${mobile}\nவகை: ${category}\nஇடம்: ${city}\nசெய்தி: ${p}\n\nவிலை மற்றும் கிடைப்புத் தகவல் தெரிவிக்கவும்.`;

      const combinedMessage = `${en}\n\n${ta}`;

      openWhatsApp(combinedMessage);
    });
  };

  const initFaqAccordion = () => {
    const items = document.querySelectorAll(".faq-item");
    if (!items || items.length === 0) return;

    items.forEach((item) => {
      const toggle = item.querySelector(".faq-toggle");
      if (!toggle) return;

      toggle.addEventListener("click", () => {
        const currentlyOpen = item.classList.contains("is-open");

        // Keep it clean: allow only one open at a time.
        items.forEach((i) => i.classList.remove("is-open"));
        items.forEach((i) => {
          const t = i.querySelector(".faq-toggle");
          if (t) t.setAttribute("aria-expanded", "false");
        });

        if (!currentlyOpen) {
          item.classList.add("is-open");
          toggle.setAttribute("aria-expanded", "true");
        }
      });
    });
  };

  const initLightbox = () => {
    const backdrop = document.querySelector("#lightbox-backdrop");
    const img = document.querySelector("#lightbox-img");
    const title = document.querySelector("#lightbox-title");
    const closeBtn = document.querySelector("[data-close-lightbox]");

    if (!backdrop || !img || !title || !closeBtn) return;

    const open = ({ src, caption }) => {
      img.src = src;
      img.alt = caption || "Image";
      title.textContent = caption || "Image";
      backdrop.classList.add("is-open");
      backdrop.setAttribute("aria-hidden", "false");
    };

    const close = () => {
      backdrop.classList.remove("is-open");
      backdrop.setAttribute("aria-hidden", "true");
      img.src = "";
    };

    document.querySelectorAll("[data-lightbox][data-large]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const src = btn.getAttribute("data-large");
        const caption = btn.getAttribute("data-caption") || "";
        if (!src) return;
        open({ src, caption });
      });
    });

    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && backdrop.classList.contains("is-open")) close();
    });
  };

  const initProductSearch = () => {
    const input = document.querySelector("#product-search-input");
    if (!input) return;

    const cards = document.querySelectorAll(".product-card");
    const getHaystack = (card) => (card.getAttribute("data-search") || card.innerText || "").toLowerCase();

    const apply = () => {
      const q = input.value.trim().toLowerCase();
      cards.forEach((card) => {
        const hay = getHaystack(card);
        const shouldShow = !q || hay.includes(q);
        card.classList.toggle("is-hidden", !shouldShow);
      });
    };

    input.addEventListener("input", apply);
    apply();
  };

  initLanguageToggle();
  initMobileNav();
  initCallLinks();
  initWhatsAppButtons();
  initEnquiryButtons();
  initContactForm();
  initLightbox();
  initFaqAccordion();
  initProductSearch();
})();

