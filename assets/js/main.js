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

// Case studies: Loom walkthrough. The block stays hidden until data-loom holds
// a Loom share link or video id; the player loads only when asked for.
document.querySelectorAll(".walkthrough[data-loom]").forEach((block) => {
  const m = block.dataset.loom.trim().match(/(?:share|embed)\/([a-f0-9]+)/i) || block.dataset.loom.trim().match(/^([a-f0-9]{16,})$/i);
  if (!m) return;
  const id = m[1];
  const btn = block.querySelector(".walk-btn");
  const label = block.querySelector(".walk-label");
  const watchText = label.textContent;
  const player = block.querySelector(".walk-player");
  block.querySelector(".walk-link").href = `https://www.loom.com/share/${id}`;
  block.hidden = false;
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Close the video" : watchText;
    if (open && !player.firstChild) {
      const frame = document.createElement("iframe");
      frame.src = `https://www.loom.com/embed/${id}?autoplay=1`;
      frame.title = block.dataset.title || "Video walkthrough";
      frame.allow = "autoplay; fullscreen";
      frame.allowFullscreen = true;
      player.append(frame);
    }
    player.hidden = !open;
  });
});

// Home: dot field that is drawn toward the cursor and springs back.
// Keeps the same 24px grid as the static CSS dots, which stay as the fallback.
const field = document.querySelector(".dot-field");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (field && field.getContext && !reduceMotion.matches) {
  const ctx = field.getContext("2d");
  const STEP = 24;      // grid spacing, matches background-size in CSS
  const RADIUS = 130;   // how far the cursor reaches
  const PULL = 9;       // max displacement in px
  const EASE = 0.1;     // how quickly dots follow / settle

  let w = 0, h = 0, cols = 0, rows = 0, dpr = 1;
  let offX = new Float32Array(0), offY = new Float32Array(0);
  let pointer = null;   // {x, y} in viewport coords, or null when away
  let running = false;
  let ink = "#1d1d1b", baseAlpha = 0.1;

  const readColors = () => {
    const css = getComputedStyle(document.documentElement);
    ink = css.getPropertyValue("--ink").trim() || ink;
    const m = css.getPropertyValue("--dot").match(/[\d.]+\s*\)\s*$/);
    baseAlpha = m ? parseFloat(m[0]) : baseAlpha;
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    field.width = Math.round(w * dpr); field.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / STEP) + 1;
    rows = Math.ceil(h / STEP) + 2;
    offX = new Float32Array(cols * rows);
    offY = new Float32Array(cols * rows);
    draw();
  };

  // One frame: move each dot toward its target offset and paint it.
  // Returns true while any dot is still moving.
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = ink;
    const shift = window.scrollY % STEP; // dots scroll with the page
    let moving = false;
    for (let j = 0; j < rows; j++) {
      const y0 = STEP / 2 + j * STEP - shift;
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i;
        const x0 = STEP / 2 + i * STEP;
        let tx = 0, ty = 0, f = 0;
        if (pointer) {
          const dx = x0 - pointer.x, dy = y0 - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < RADIUS && d > 0.01) {
            f = (1 - d / RADIUS) ** 2;
            // Pull toward the cursor, never past it
            const m = Math.min(PULL * f, d * 0.5);
            tx = (-dx / d) * m;
            ty = (-dy / d) * m;
          }
        }
        offX[k] += (tx - offX[k]) * EASE;
        offY[k] += (ty - offY[k]) * EASE;
        if (Math.abs(tx - offX[k]) > 0.05 || Math.abs(ty - offY[k]) > 0.05) moving = true;

        const lift = Math.min(1, Math.hypot(offX[k], offY[k]) / PULL);
        ctx.globalAlpha = Math.min(1, baseAlpha * 1.2 + lift * 0.18);
        const r = 1 + lift * 0.35;
        ctx.beginPath();
        ctx.arc(x0 + offX[k], y0 + offY[k], r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    return moving;
  };

  const loop = () => {
    running = draw();
    if (running) requestAnimationFrame(loop);
  };
  const kick = () => { if (!running) { running = true; requestAnimationFrame(loop); } };

  const release = () => { pointer = null; kick(); };
  window.addEventListener("pointermove", (e) => { pointer = { x: e.clientX, y: e.clientY }; kick(); }, { passive: true });
  window.addEventListener("pointerout", (e) => { if (!e.relatedTarget) release(); });
  window.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") release(); });
  window.addEventListener("pointercancel", release);
  window.addEventListener("blur", release);
  window.addEventListener("scroll", kick, { passive: true });
  window.addEventListener("resize", resize);

  // Follow light/dark changes from the OS or the viewer's theme toggle
  const recolor = () => { readColors(); if (!running) draw(); };
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", recolor);
  new MutationObserver(recolor).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  readColors();
  document.body.classList.add("has-dot-field");
  resize();
}
