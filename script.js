const views = Array.from(document.querySelectorAll("[data-view]"));
const links = Array.from(document.querySelectorAll("[data-view-link]"));

function setActiveView(viewName) {
  const nextView = views.find((view) => view.dataset.view === viewName) || views[0];

  views.forEach((view) => {
    view.classList.toggle("is-active", view === nextView);
  });

  links.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.viewLink === nextView.dataset.view);
  });
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

    setActiveView(viewName);
    window.history.pushState(null, "", nextHash);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
});

window.addEventListener("hashchange", () => {
  setActiveView(viewFromHash());
});

setActiveView(viewFromHash());
