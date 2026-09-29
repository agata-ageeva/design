// Header border on scroll
const header = document.querySelector(".site-header");
if (header) {
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Fade-in on scroll (content stays visible if JS or IntersectionObserver is unavailable)
const revealEls = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px" }
  );
  revealEls.forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
}

// Current year in footer
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
