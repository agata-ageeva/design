// Current year in footer
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

// Grid overlay: footer button or the "g" key shows the 12-column grid
const toggle = document.querySelector(".grid-toggle");
const setGrid = (on) => {
  document.body.classList.toggle("show-grid", on);
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(on));
    toggle.textContent = on ? "Hide grid" : "Show grid";
  }
  try { localStorage.setItem("show-grid", on ? "1" : "0"); } catch (e) {}
};
let saved = false;
try { saved = localStorage.getItem("show-grid") === "1"; } catch (e) {}
setGrid(saved);

toggle?.addEventListener("click", () => setGrid(!document.body.classList.contains("show-grid")));
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() !== "g" || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest("input, textarea, [contenteditable]")) return;
  setGrid(!document.body.classList.contains("show-grid"));
});
