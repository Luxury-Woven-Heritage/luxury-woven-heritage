// js/product.js
document.addEventListener("DOMContentLoaded", () => {
  // 0) Etat courant
  let sleeveType = "short"; // "short" au chargement, donc bouton Short grisé
  let colorKey = "sandy brown"; // sera surchargé par la valeur du select

  // 1) Modèle de variantes par type de manche
  const catalog = {
    short: {
      variants: {
        black: {
          title: "Short Sleeve - Black",
          description: "Soft premium cotton. Regular fit. Color: Black.",
          images: [
            "./assets/images/short-sleeves-black.png",
            "./assets/images/short-sleeves-black-woman.jpg",
            "./assets/images/short-sleeves-black-man.jpg",
          ],
        },
        white: {
          title: "Short Sleeve - White",
          description: "Soft premium cotton. Regular fit. Color: White.",
          images: [
            "./assets/images/short-sleeves-white.png",
            "./assets/images/short-sleeves-white-woman.jpg",
            "./assets/images/short-sleeves-white-man.jpg",
          ],
        },
        "sandy brown": {
          title: "Short Sleeve - Sandy Brown",
          description: "Soft premium cotton. Regular fit. Color: Sandy Brown.",
          images: [
            "./assets/images/short-sleeves-sandy.png",
            "./assets/images/short-sleeves-sandy-woman.jpg",
            "./assets/images/short-sleeves-sandy-man.jpg",
          ],
        },
      },
    },
    long: {
      variants: {
        black: {
          title: "Long Sleeve - Black",
          description: "Soft premium cotton. Regular fit. Color: Black.",
          images: [
            "./assets/images/long-sleeves-black.png",
            "./assets/images/long-sleeves-black-woman.jpg",
            "./assets/images/long-sleeves-black-man.jpg",
          ],
        },
        white: {
          title: "Long Sleeve - White",
          description: "Soft premium cotton. Regular fit. Color: White.",
          images: [
            "./assets/images/long-sleeves-white.png",
            "./assets/images/long-sleeves-white-woman.jpg",
            "./assets/images/long-sleeves-white-man.jpg",
          ],
        },
        "sandy brown": {
          title: "Long Sleeve - Sandy Brown",
          description: "Soft premium cotton. Regular fit. Color: Sandy Brown.",
          images: [
            "./assets/images/long-sleeves-sandy.png",
            "./assets/images/long-sleeves-sandy-woman.jpg",
            "./assets/images/long-sleeves-sandy-man.jpg",
          ],
        },
      },
    },
  };

  // 2) Sélecteurs DOM
  const colorSelect = document.querySelector("#color-select") || document.querySelector("select");
  const titleEl = document.querySelector(".title");
  const descEl = document.querySelector("#description") || document.querySelector(".subtle");
  const slidesTrack = document.querySelector(".slides");
  const dotsContainer = document.querySelector(".carousel-dots");
  const shortBtn = document.querySelector(".btn-secondary:nth-child(1)"); // "Short sleeves"
  const longBtn = document.querySelector(".btn-secondary:nth-child(2)");  // "Long sleeves"

  // 3) Helpers UI manches: active/désactive
  function setSleeveButtonsUI() {
    if (!shortBtn || !longBtn) return;
    if (sleeveType === "short") {
      shortBtn.disabled = true;
      shortBtn.setAttribute("aria-pressed", "true");
      longBtn.disabled = false;
      longBtn.setAttribute("aria-pressed", "false");
      shortBtn.classList.add("is-active");
      longBtn.classList.remove("is-active");
    } else {
      longBtn.disabled = true;
      longBtn.setAttribute("aria-pressed", "true");
      shortBtn.disabled = false;
      shortBtn.setAttribute("aria-pressed", "false");
      longBtn.classList.add("is-active");
      shortBtn.classList.remove("is-active");
    }
  }

  // 3bis) Optionnel: style pour le bouton actif/grisé (ajoute au CSS)
  // .btn-secondary[disabled] { opacity: 0.5; cursor: not-allowed; }
  // .btn-secondary.is-active { border-color: #000; background: #ebeced; }

  // 4) Carousel rendering
  function renderCarousel(images) {
    if (!slidesTrack || !dotsContainer) return;
    slidesTrack.innerHTML = images
      .map(
        (src) => `
        <div class="slide">
          <img src="${src}" alt="">
        </div>`
      )
      .join("");

    dotsContainer.innerHTML = images
      .map((_, i) => `<span class="dot${i === 0 ? " active" : ""}"></span>`)
      .join("");

    setupCarousel();
  }

  function setupCarousel() {
    const dots = dotsContainer.querySelectorAll(".dot");
    let index = 0;

    function updateCarousel() {
      slidesTrack.style.transform = `translateX(${-index * 100}%)`;
      dotsContainer.querySelector(".dot.active")?.classList.remove("active");
      dots[index]?.classList.add("active");
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        index = i;
        updateCarousel();
      });
    });

    updateCarousel();
  }

  // 5) Hydratation selon état (manches + couleur)
  function hydrateFromState() {
    const currentCatalog = catalog[sleeveType];
    if (!currentCatalog) return;
    const variant = currentCatalog.variants[colorKey];
    if (!variant) return;
    if (titleEl) titleEl.textContent = variant.title;
    if (descEl) descEl.textContent = variant.description;
    renderCarousel(variant.images);
    setSleeveButtonsUI();
  }

  // 6) Handlers UI
  colorSelect?.addEventListener("change", (e) => {
    colorKey = String(e.target.value).trim().toLowerCase();
    hydrateFromState();
  });

  shortBtn?.addEventListener("click", () => {
    if (sleeveType === "short") return;
    sleeveType = "short";
    hydrateFromState();
  });

  longBtn?.addEventListener("click", () => {
    if (sleeveType === "long") return;
    sleeveType = "long";
    hydrateFromState();
  });

  // 7) Init
  colorKey = (colorSelect?.value || "Sandy Brown").toLowerCase();
  sleeveType = "short"; // page détaillant "short sleeves"
  hydrateFromState();
});
