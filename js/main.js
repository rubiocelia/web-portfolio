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
// Cada enlace se marca con su sección. Si el enlace apunta a otro sitio
// (Proyectos lleva al índice de todos los proyectos), data-section dice qué sección vigila.
const sectionId = (link) => link.dataset.section || link.hash.slice(1);
const navSections = [...navLinks].map((link) => document.getElementById(sectionId(link)));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      // En el inicio no se marca nada; en las demás secciones, su enlace
      navLinks.forEach((link) => {
        if (sectionId(link) === entry.target.id) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

// También observamos el inicio: al volver arriba, se quita el subrayado
const hero = document.querySelector("#inicio");

[hero, ...navSections].forEach((section) => {
  if (section) navObserver.observe(section);
});

// ==========================
// FILTROS DE PROYECTOS
// Cada botón muestra solo las tarjetas de su categoría (data-category).
// aria-pressed indica a lectores de pantalla qué filtro está activo.
// ==========================

const filterButtons = document.querySelectorAll(".filter-btn");
const projectItems = document.querySelectorAll(".project-grid li");
const filterStatus = document.querySelector("#filter-status");
const projectEmpty = document.querySelector(".project-empty");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visibles = 0;

    filterButtons.forEach((btn) => btn.setAttribute("aria-pressed", btn === button));

    projectItems.forEach((item) => {
      const show = filter === "todos" || item.dataset.category === filter;
      item.hidden = !show;
      if (show) visibles++;
    });

    // Si el filtro no tiene proyectos, se muestra el mensaje de "en marcha"
    projectEmpty.hidden = visibles > 0;
    filterStatus.textContent = visibles > 0 ? `Mostrando ${visibles} proyectos` : projectEmpty.textContent.trim();
  });
});

// ==========================
// ESQUEMA DE REJILLA
// Los botones cambian data-view en la figura y el CSS hace el resto.
// ==========================

document.querySelectorAll(".grid-demo").forEach((demo) => {
  const buttons = demo.querySelectorAll(".grid-demo-controls button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      demo.dataset.view = button.dataset.view;
      buttons.forEach((btn) => btn.setAttribute("aria-pressed", btn === button));
    });
  });
});
