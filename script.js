const views = Array.from(document.querySelectorAll("[data-view]"));
const links = Array.from(document.querySelectorAll("[data-view-link]"));
const navTabs = document.querySelector(".nav-tabs");
const navIndicator = document.querySelector(".nav-indicator");
const navLinks = navTabs ? Array.from(navTabs.querySelectorAll(".nav-link")) : [];

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function moveIndicator(target, { animate = true } = {}) {
  if (!navTabs || !navIndicator || !target) return;

  const tabsRect = navTabs.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const left = targetRect.left - tabsRect.left;
  const width = targetRect.width;

  if (!animate) {
    const prev = navIndicator.style.transition;
    navIndicator.style.transition = "none";
    navIndicator.style.transform = `translate3d(${left}px, 0, 0)`;
    navIndicator.style.width = `${width}px`;
    void navIndicator.offsetWidth;
    navIndicator.style.transition = prev;
  } else {
    navIndicator.style.transform = `translate3d(${left}px, 0, 0)`;
    navIndicator.style.width = `${width}px`;
  }

  navIndicator.classList.add("is-ready");
  navTabs.classList.add("indicator-ready");
}

function syncIndicator({ animate = true } = {}) {
  const active = navLinks.find((link) => link.classList.contains("is-active"));
  if (active) {
    moveIndicator(active, { animate });
  } else if (navIndicator && navTabs) {
    navIndicator.classList.remove("is-ready");
    navTabs.classList.remove("indicator-ready");
  }
}

function setActiveView(viewName, { animateIndicator = true } = {}) {
  const nextView = views.find((view) => view.dataset.view === viewName) || views[0];

  views.forEach((view) => {
    view.classList.toggle("is-active", view === nextView);
  });

  links.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.viewLink === nextView.dataset.view);
  });

  syncIndicator({ animate: animateIndicator });
}

function resetScroll() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function viewFromHash() {
  const hash = window.location.hash.replace("#", "");
  return hash || "home";
}

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const viewName = link.dataset.viewLink;
    const nextHash = viewName === "home" ? "#" : `#${viewName}`;

    resetScroll();
    setActiveView(viewName);
    window.history.pushState(null, "", nextHash);
  });
});

window.addEventListener("hashchange", () => {
  resetScroll();
  setActiveView(viewFromHash());
});

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

let resizeFrame = 0;
window.addEventListener("resize", () => {
  if (resizeFrame) cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => syncIndicator({ animate: false }));
});

window.addEventListener("load", () => {
  syncIndicator({ animate: false });
});

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => syncIndicator({ animate: false }));
}

setActiveView(viewFromHash(), { animateIndicator: false });
syncIndicator({ animate: false });
resetScroll();
requestAnimationFrame(resetScroll);
