const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
// ==========================
// PROJECT CAROUSELS
// ==========================

function setupCarousel(category, prev, next) {
  const carousel = document.querySelector(category + " .design-carousel");
  const prevBtn = document.querySelector(prev);
  const nextBtn = document.querySelector(next);

  if (!carousel || !prevBtn || !nextBtn) return;

  const scrollAmount = 380;

  nextBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  prevBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });
}

// Carrusel diseño
setupCarousel(".design-projects", ".design-prev", ".design-next");

// Carrusel webs publicadas
setupCarousel(".web-projects", ".web-prev", ".web-next");

// Carrusel proyectos propios
setupCarousel(".personal-projects", ".personal-prev", ".personal-next");
