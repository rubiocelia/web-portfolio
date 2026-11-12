// ==========================
// HEADER
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
  }

  updateThemeButton();
});

// ==========================
// TONO POR PROYECTO
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
  { rootMargin: "-45% 0px -45% 0px" }
);

toneSections.forEach((section) => toneObserver.observe(section));

// ==========================
// MENÚ ACTIVO
// ==========================

const navLinks = document.querySelectorAll(".nav-menu a");
const sectionId = (link) => link.dataset.section || link.hash.slice(1);
const navSections = [...navLinks].map((link) => document.getElementById(sectionId(link)));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

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

const hero = document.querySelector("#inicio");

[hero, ...navSections].forEach((section) => {
  if (section) navObserver.observe(section);
});

// ==========================
// FILTROS DE PROYECTOS
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

    projectEmpty.hidden = visibles > 0;
    filterStatus.textContent = visibles > 0 ? `Mostrando ${visibles} proyectos` : projectEmpty.textContent.trim();
  });
});

// ==========================
// ESQUEMA DE REJILLA
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
