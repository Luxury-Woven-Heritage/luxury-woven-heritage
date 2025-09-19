document.addEventListener("DOMContentLoaded", () => {
  // ————————————————————————————————————————————————————————————————
  // Pré-initialisation (localStorage)
  // ————————————————————————————————————————————————————————————————
  const STORAGE_KEY = "productState";
  const INIT_FLAG_KEY = "productState:initialised";
  if (!localStorage.getItem(INIT_FLAG_KEY)) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(INIT_FLAG_KEY, "1");
  }

  // Valeurs par défaut
  const defaultState = {
    sleeveType: "short",
    colorKey: "sandy brown",
    fabricKey: "cotton silk",
    selectedSize: null,
    priceEUR: 1199
  };

  // Chargement état
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch {}
  let state = stored && typeof stored === "object"
    ? { ...defaultState, ...stored }
    : { ...defaultState };

  // ————————————————————————————————————————————————————————————————
  // Raccourcis DOM (sélecteurs robustes)
  // ————————————————————————————————————————————————————————————————
  const colorSelect =
    document.querySelector("#color-select")
    || document.querySelector(".details .field:nth-of-type(1) select")
    || document.querySelectorAll(".details select")[0];

  // Attention : sélecteur pour le tissu, vérifier l'id dans le HTML (devrait être #fabric-select)
  const fabricSelect =
    document.querySelector("#fabric-select")
    || document.querySelector(".details .field:nth-of-type(2) select")
    || document.querySelectorAll(".details select")[1];

  const titleEl = document.querySelector("#product-title") || document.querySelector(".title");
  const descEl  = document.querySelector("#description")   || document.querySelector(".subtle");
  const priceEl = document.querySelector("#price");

  const slidesTrack   = document.querySelector(".slides");
  const dotsContainer = document.querySelector(".carousel-dots");

  let shortBtn = document.querySelector("#btn-short");
  let longBtn  = document.querySelector("#btn-long");

  if (!shortBtn || !longBtn) {
    const splitContainer = document.querySelector(".split__container") || document.querySelector(".split");
    if (splitContainer) {
      const btns = Array.from(splitContainer.querySelectorAll("button.btn-secondary"));
      shortBtn = btns.find(b => /short/i.test(b.textContent || ""));
      longBtn  = btns.find(b => /long/i.test(b.textContent || ""));
    }
  }

  const sizeChipsWrap =
    document.getElementById("sizeChips")
    || document.querySelector(".chips__container")
    || (document.querySelector(".chips")?.querySelector(".chips__container") ? document.querySelector(".chips") : document.querySelector(".chips"));

  const addToCartBtn = document.querySelector(".add-to-cart");

  // ————————————————————————————————————————————————————————————————
  // Utilitaires
  // ————————————————————————————————————————————————————————————————
  const capWords = s => String(s || "").toLowerCase().replace(/\b\w/g, m => m.toUpperCase());
  const formatPrice = eur => Number(eur || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

  function saveState() {
    const toStore = {
      sleeveType: state.sleeveType,
      colorKey: state.colorKey,
      fabricKey: state.fabricKey,
      selectedSize: state.selectedSize,
      priceEUR: state.priceEUR
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }

  // ————————————————————————————————————————————————————————————————
  // Données produit
  // ————————————————————————————————————————————————————————————————
  const catalog = {
    short: { variants: {
      black: {
        images: [
          "./assets/images/short-sleeves-black.png",
          "./assets/images/short-sleeves-black-woman.jpg",
          "./assets/images/short-sleeves-black-man.jpg",
        ],
      },
      white: {
        images: [
          "./assets/images/short-sleeves-white.png",
          "./assets/images/short-sleeves-white-woman.jpg",
          "./assets/images/short-sleeves-white-man.jpg",
        ],
      },
      "sandy brown": {
        images: [
          "./assets/images/short-sleeves-sandy.png",
          "./assets/images/short-sleeves-sandy-woman.jpg",
          "./assets/images/short-sleeves-sandy-man.jpg",
        ],
      },
    }},
    long: { variants: {
      black: {
        images: [
          "./assets/images/long-sleeves-black.png",
          "./assets/images/long-sleeves-black-woman.jpg",
          "./assets/images/long-sleeves-black-man.jpg",
        ],
      },
      white: {
        images: [
          "./assets/images/long-sleeves-white.png",
          "./assets/images/long-sleeves-white-woman.jpg",
          "./assets/images/long-sleeves-white-man.jpg",
        ],
      },
      "sandy brown": {
        images: [
          "./assets/images/long-sleeves-sandy.png",
          "./assets/images/long-sleeves-sandy-woman.jpg",
          "./assets/images/long-sleeves-sandy-man.jpg",
        ],
      },
    }},
  };

  const fabricData = {
    "cotton silk": { nameSuffix: " - Cotton Silk", description: "Blend: 70% cotton, 30% silk. Soft hand‑feel with a subtle sheen. Breathable and lightweight." },
    "cotton pima": { nameSuffix: " - Cotton Pima", description: "Long‑staple cotton for extra softness and durability. Smooth surface, low pilling." },
    "cotton sea island": { nameSuffix: " - Cotton Sea Island", description: "Ultra‑long staple heritage cotton. Exceptional drape with a luxurious feel." },
  };

  // ————————————————————————————————————————————————————————————————
  // Pricing
  // ————————————————————————————————————————————————————————————————
  const BASE_PRICE = 1199;
  const FABRIC_UPCHARGE_EUR = {
    "cotton silk": 0,
    "cotton pima": 1000,
    "cotton sea island": 1500
  };
  const SLEEVE_UPCHARGE_EUR = { short: 0, long: 300 };

  function computePriceEUR({ sleeveType, fabricKey }) {
    return BASE_PRICE
      + (FABRIC_UPCHARGE_EUR[fabricKey] || 0)
      + (SLEEVE_UPCHARGE_EUR[sleeveType] || 0);
  }

  // ————————————————————————————————————————————————————————————————
  // Carousel
  // ————————————————————————————————————————————————————————————————
  let slideIndex = 0;

  function renderCarousel(images) {
    if (!slidesTrack || !dotsContainer) return;
    slidesTrack.innerHTML = (images || []).map(src => `<div class="slide"><img src="${src}" alt=""></div>`).join("");
    dotsContainer.innerHTML = (images || []).map((_, i) => `<button type="button" class="dot${i===slideIndex?" active":""}" aria-label="Slide ${i+1}"></button>`).join("");
    setupCarousel();
  }

  function setupCarousel() {
    if (!slidesTrack || !dotsContainer) return;
    const dots = dotsContainer.querySelectorAll(".dot");
    function updateCarousel() {
      slidesTrack.style.transform = `translateX(${-slideIndex * 100}%)`;
      dotsContainer.querySelector(".dot.active")?.classList.remove("active");
      dots[slideIndex]?.classList.add("active");
    }
    dots.forEach((dot, i) => dot.addEventListener("click", () => { slideIndex = i; updateCarousel(); }));
    updateCarousel();
  }

  // ————————————————————————————————————————————————————————————————
  // Titre/description
  // ————————————————————————————————————————————————————————————————
  function composeTitleAndDesc() {
    const fixedTitle = state.sleeveType === "short"
      ? "THE CLASSIC - SHORT SLEEVES"
      : "THE CLASSIC - LONG SLEEVES";
    const fabric = fabricData[state.fabricKey];
    const description = fabric?.description || "Premium cotton knit with a comfortable fit.";
    return { title: fixedTitle, description };
  }

  // ————————————————————————————————————————————————————————————————
  // Hydratation UI depuis l’état
  // ————————————————————————————————————————————————————————————————
  function hydrateFromState() {
    if (colorSelect)  colorSelect.value  = capWords(state.colorKey);
    if (fabricSelect) fabricSelect.value = capWords(state.fabricKey);

    const currentCatalog = catalog[state.sleeveType];
    const variant = currentCatalog?.variants?.[state.colorKey];
    if (variant?.images) renderCarousel(variant.images);

    const { title, description } = composeTitleAndDesc();
    if (titleEl) titleEl.textContent = title;
    if (descEl)  descEl.textContent  = description;

    state.priceEUR = computePriceEUR({ sleeveType: state.sleeveType, fabricKey: state.fabricKey });
    if (priceEl) priceEl.textContent = formatPrice(state.priceEUR);

    setSleeveButtonsUI();

    if (sizeChipsWrap) {
      const chips = sizeChipsWrap.matches(".chip") ? [sizeChipsWrap] : Array.from(sizeChipsWrap.querySelectorAll(".chip"));
      chips.forEach(ch => {
        const isSel = !!state.selectedSize && (ch.textContent || "").trim() === state.selectedSize;
        ch.classList.toggle("selected", isSel);
        ch.setAttribute("aria-pressed", String(isSel));
      });
    }

    // => MAJ bouton add to cart selon la taille choisie
    if (addToCartBtn) {
      if (!state.selectedSize) {
        addToCartBtn.setAttribute("disabled", "true");
      } else {
        addToCartBtn.removeAttribute("disabled");
      }
    }
  }

  function setSleeveButtonsUI() {
    if (!shortBtn || !longBtn) return;
    const isShort = state.sleeveType === "short";
    shortBtn.disabled = isShort;
    longBtn.disabled = !isShort;
    shortBtn.setAttribute("aria-pressed", String(isShort));
    longBtn.setAttribute("aria-pressed", String(!isShort));
    shortBtn.classList.toggle("is-active", isShort);
    longBtn.classList.toggle("is-active", !isShort);
  }

  // ————————————————————————————————————————————————————————————————
  // Listeners
  // ————————————————————————————————————————————————————————————————
  colorSelect?.addEventListener("change", (e) => {
    const val = String(e.target.value || "").trim().toLowerCase();
    state.colorKey = val;
    saveState();
    hydrateFromState();
  });

  fabricSelect?.addEventListener("change", (e) => {
    const val = String(e.target.value || "").trim().toLowerCase();
    state.fabricKey = val;
    saveState();
    hydrateFromState();
  });

  shortBtn?.addEventListener("click", () => {
    if (state.sleeveType === "short") return;
    state.sleeveType = "short";
    saveState();
    hydrateFromState();
  });

  longBtn?.addEventListener("click", () => {
    if (state.sleeveType === "long") return;
    state.sleeveType = "long";
    saveState();
    hydrateFromState();
  });

  // Délégation click sur chips tailles
  if (sizeChipsWrap) {
    sizeChipsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn || !sizeChipsWrap.contains(btn)) return;
      state.selectedSize = (btn.textContent || "").trim();
      saveState();

      const chips = sizeChipsWrap.matches(".chip") ? [sizeChipsWrap] : Array.from(sizeChipsWrap.querySelectorAll(".chip"));
      chips.forEach(ch => {
        const sel = ch === btn;
        ch.classList.toggle("selected", sel);
        ch.setAttribute("aria-pressed", String(sel));
      });

      // Mise à jour du bouton add to cart après selection de taille
      if (addToCartBtn) {
        if (!state.selectedSize) {
          addToCartBtn.setAttribute("disabled", "true");
        } else {
          addToCartBtn.removeAttribute("disabled");
        }
      }
    });
  }

  // ————————————————————————————————————————————————————————————————
  // Init stricte + 1ère hydratation
  // ————————————————————————————————————————————————————————————————
  state.sleeveType = "short";
  state.colorKey   = "sandy brown";
  state.fabricKey  = "cotton silk";
  state.selectedSize = null;
  state.priceEUR = computePriceEUR({ sleeveType: state.sleeveType, fabricKey: state.fabricKey });

  saveState();
  hydrateFromState();

  // ————————————————————————————————————————————————————————————————
  // Add to cart (démo)
  // ————————————————————————————————————————————————————————————————
  addToCartBtn?.addEventListener("click", () => {
    if (!state.selectedSize) {
      addToCartBtn.setAttribute("disabled", "true");
      return;
    }
    const payload = {
      productId: "sku-123",
      title: state.sleeveType === "short"
        ? "THE CLASSIC - SHORT SLEEVES"
        : "THE CLASSIC - LONG SLEEVES",
      sleeveType: state.sleeveType,
      colorKey: state.colorKey,
      fabricKey: state.fabricKey,
      size: state.selectedSize,
      qty: 1,
      priceEUR: state.priceEUR,
    };
    console.log("Add to cart payload:", payload);
    alert("Choix enregistré. Voir la console.");
  });

});
