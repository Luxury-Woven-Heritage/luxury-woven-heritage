const slides = document.querySelector(".slides");
const dots = document.querySelectorAll(".dot");
let index = 0;

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    index = i;
    updateCarousel();
  });
});

function updateCarousel() {
  slides.style.transform = `translateX(${-index * 100}%)`;
  document.querySelector(".dot.active")?.classList.remove("active");
  dots[index].classList.add("active");
}