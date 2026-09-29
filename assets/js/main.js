// Current year in footer
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
