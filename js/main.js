// ==========================
// HEADER
// Solo hace falta en navegadores sin scroll-driven animations:
// en los demás el fondo del header lo controla CSS.
// ==========================

const header = document.querySelector(".header");

if (!CSS.supports("animation-timeline: scroll()")) {
  window.addEventListener(
    "scroll",
    () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true }
  );
}

// ==========================
// MODO OSCURO
// La clase va en <html>; el script del <head> ya la ha puesto
// al cargar si tocaba. Aquí solo gestionamos el botón.
// ==========================

const root = document.documentElement;
const themeBtn = document.querySelector(".theme-btn");

function updateThemeButton() {
  const isDark = root.classList.contains("dark-mode");
  themeBtn.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
}

updateThemeButton();

themeBtn.addEventListener("click", () => {
  root.classList.toggle("dark-mode");

  try {
    localStorage.setItem("theme", root.classList.contains("dark-mode") ? "dark" : "light");
  } catch (error) {
    // Sin almacenamiento (modo privado): el cambio vale para esta visita
  }

  updateThemeButton();
});

// ==========================
// TONO POR PROYECTO
// Cuando un proyecto cruza la mitad de la pantalla, su data-tone
// pasa a <html> y las variables de color de toda la página cambian.
// ==========================

const toneSections = document.querySelectorAll("[data-tone]");

const toneObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const tone = entry.target.dataset.tone;

      if (entry.isIntersecting) {
        root.dataset.tone = tone;
      } else if (root.dataset.tone === tone) {
        delete root.dataset.tone;
      }
    });
  },
  // Franja estrecha en el centro de la pantalla: solo cuenta lo que está en medio
  { rootMargin: "-45% 0px -45% 0px" }
);

toneSections.forEach((section) => toneObserver.observe(section));

// ==========================
// MENÚ ACTIVO
// Marca en el menú la sección que se está viendo.
// ==========================

const navLinks = document.querySelectorAll(".nav-menu a");
const navSections = [...navLinks].map((link) => document.querySelector(link.hash));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        if (link.hash === "#" + entry.target.id) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

navSections.forEach((section) => {
  if (section) navObserver.observe(section);
});
