// js/product.js
document.addEventListener("DOMContentLoaded", () => {
  // ————————————————————————————————————————————————————————————————
  // Pré-initialisation
  // ————————————————————————————————————————————————————————————————
  const STORAGE_KEY = "productState";
  const INIT_FLAG_KEY = "productState:initialised";
  if (!localStorage.getItem(INIT_FLAG_KEY)) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(INIT_FLAG_KEY, "1");
  }

  // Valeurs par défaut au premier affichage
  const defaultState = {
    sleeveType: "short",        // manches courtes
    colorKey: "sandy brown",    // couleur sable
    fabricKey: "cotton silk",   // tissu par défaut
    selectedSize: null,         // aucune taille pré-sélectionnée
    priceEUR: 1199              // Short + Cotton Silk
  };

  // ————————————————————————————————————————————————————————————————
  // Chargement et normalisation de l'état
  // ————————————————————————————————————————————————————————————————
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch {}
  let state = stored && typeof stored === "object"
    ? { ...defaultState, ...stored }
    : { ...defaultState };

  // ————————————————————————————————————————————————————————————————
  // Raccourcis DOM
  // ————————————————————————————————————————————————————————————————
  const colorSelect  = document.querySelector("#color-select")  || document.querySelectorAll("select")[0];
  const fabricSelect = document.querySelector("#fabric-select") || document.querySelectorAll("select")[1];
  const titleEl = document.querySelector("#product-title") || document.querySelector(".title");
  const descEl  = document.querySelector("#description")   || document.querySelector(".subtle");
  const priceEl = document.querySelector("#price");
  const slidesTrack   = document.querySelector(".slides");
  const dotsContainer = document.querySelector(".carousel-dots");
  const shortBtn = document.querySelector("#btn-short");
  const longBtn  = document.querySelector("#btn-long");
  const sizeChipsWrap = document.getElementById("sizeChips");
  const addToCartBtn = document.querySelector(".add-to-cart");

  // Nettoyage des chips de tailles
  if (sizeChipsWrap) {
    sizeChipsWrap.querySelectorAll(".chip").forEach(ch => {
      ch.classList.remove("selected");
      ch.setAttribute("aria-pressed", "false");
    });
  }

  // Sauvegarde de l'état "métier"
  function saveState() {
    const toStore = {
      sleeveType: state.sleeveType,
      colorKey: state.colorKey,
      fabricKey: state.fabricKey,
      selectedSize: state.selectedSize,
      priceEUR: state.priceEUR
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    console.log("State saved:", toStore);
  }

  // Utilitaires
  const capWords = s => s.replace(/\b\w/g, m => m.toUpperCase());
  const formatPrice = eur => eur.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

  // ————————————————————————————————————————————————————————————————
  // Données produit (short / long)
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
  // Règles de prix € 
  // ————————————————————————————————————————————————————————————————
  const BASE_PRICE = 1199; // Short + Cotton Silk
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
  // UI sleeves
  // ————————————————————————————————————————————————————————————————
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
  // Carousel
  // ————————————————————————————————————————————————————————————————
  let slideIndex = 0;
  function renderCarousel(images) {
    if (!slidesTrack || !dotsContainer) return;
    slidesTrack.innerHTML = images.map(src => `<div class="slide"><img src="${src}" alt=""></div>`).join("");
    dotsContainer.innerHTML = images.map((_, i) => `<button type="button" class="dot${i===slideIndex?" active":""}" aria-label="Slide ${i+1}"></button>`).join("");
    setupCarousel();
  }
  function setupCarousel() {
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
  function composeTitleAndDesc(variant) {
    // Il n'y a que 2 sortes de titres (courts ou longs)
    const fixedTitle = state.sleeveType === "short"
      ? "THE CLASSIC - SHORT SLEEVES"
      : "THE CLASSIC - LONG SLEEVES";

    // Description issue du tissu (sinon description de base c à dire Cotton Silk)
    const fabric = fabricData[state.fabricKey];
    const description = fabric?.description ? fabric.description : variant.baseDescription;

    return { title: fixedTitle, description };
  }

  // ————————————————————————————————————————————————————————————————
  // Hydratation
  // ————————————————————————————————————————————————————————————————
  function hydrateFromState() {
    if (colorSelect)  colorSelect.value  = capWords(state.colorKey);
    if (fabricSelect) fabricSelect.value = capWords(state.fabricKey);

    const currentCatalog = catalog[state.sleeveType];
    if (!currentCatalog) return;
    const variant = currentCatalog.variants[state.colorKey];
    if (!variant) return;

    const { title, description } = composeTitleAndDesc(variant);
    titleEl && (titleEl.textContent = title);
    descEl  && (descEl.textContent  = description);

    // Prix dynamique
    state.priceEUR = computePriceEUR({ sleeveType: state.sleeveType, fabricKey: state.fabricKey });
    if (priceEl) priceEl.textContent = formatPrice(state.priceEUR);

    renderCarousel(variant.images);
    setSleeveButtonsUI();

    if (sizeChipsWrap) {
      sizeChipsWrap.querySelectorAll(".chip").forEach(ch => {
        const isSel = !!state.selectedSize && ch.textContent.trim() === state.selectedSize;
        ch.classList.toggle("selected", isSel);
        ch.setAttribute("aria-pressed", String(isSel));
      });
    }
  }

  // ————————————————————————————————————————————————————————————————
  // Listeners
  // ————————————————————————————————————————————————————————————————
  colorSelect?.addEventListener("change", (e) => {
    state.colorKey = String(e.target.value).trim().toLowerCase();
    saveState();
    hydrateFromState();
  });
  fabricSelect?.addEventListener("change", (e) => {
    state.fabricKey = String(e.target.value).trim().toLowerCase();
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
  if (sizeChipsWrap) {
    sizeChipsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      state.selectedSize = btn.textContent.trim();
      saveState();
      sizeChipsWrap.querySelectorAll(".chip").forEach(ch => {
        const sel = ch === btn;
        ch.classList.toggle("selected", sel);
        ch.setAttribute("aria-pressed", String(sel));
      });
    });
  }

  // ————————————————————————————————————————————————————————————————
  // Init stricte
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
      const addToCartBtn = document.getElementById("addToCartBtn");
      addToCartBtn.setAttribute("disabled", true);
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



/* POUR LA NAVBAR APRES
const openMenuButton = document.getElementById("openMenuButton");

openMenuButton.addEventListener('click', function(e){
  const navbarMenu = document.getElementById("menuContainer");
  navbarMenu.setAttribute("class", "navbarContainer--showed")
  const html = document.querySelector("html");
  html.setAttribute("class", "yOverflowHidden");
});

const closeMenuButton = document.getElementById("closeMenuButton");

closeMenuButton.addEventListener('click', function(e){
  const navbarMenu = document.getElementById("menuContainer");
  navbarMenu.setAttribute("class", "navbarContainer--hidden")
  const html = document.querySelector("html");
  html.removeAttribute("class", "yOverflowHidden");
});
*/