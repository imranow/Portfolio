(() => {
  document.documentElement.classList.add("js");

  const els = Array.from(document.querySelectorAll("[data-reveal]"));
  if (els.length === 0) return;

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (reduceMotion?.matches) {
    for (const el of els) el.classList.add("is-visible");
    return;
  }

  // Lightweight stagger so the page feels intentional on first load.
  els.forEach((el, idx) => {
    const delayMs = Math.min(idx * 70, 350);
    el.style.setProperty("--reveal-delay", `${delayMs}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    for (const el of els) el.classList.add("is-visible");
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.15 }
  );

  for (const el of els) io.observe(el);
})();

