(() => {
  document.documentElement.classList.add("js");

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const isMobile = window.innerWidth < 980;

  // =====================================================
  // SCROLL REVEAL — staggered, smooth entrance
  // =====================================================
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));

  if (reduceMotion?.matches) {
    for (const el of revealEls) el.classList.add("is-visible");
  } else if (revealEls.length) {
    revealEls.forEach((el, idx) => {
      el.style.setProperty("--reveal-delay", `${Math.min(idx * 80, 400)}ms`);
    });

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        },
        { threshold: 0.12 }
      );
      for (const el of revealEls) io.observe(el);
    } else {
      for (const el of revealEls) el.classList.add("is-visible");
    }
  }

  // =====================================================
  // INTERACTIVE GRADIENT — blobs follow mouse in hero
  // =====================================================
  if (!reduceMotion?.matches && !isMobile) {
    const blobs = document.querySelectorAll(".hero-gradient .blob");
    const hero = document.querySelector(".hero");

    if (blobs.length && hero) {
      const speeds = [0.03, 0.02, 0.025];

      hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        blobs.forEach((blob, i) => {
          const speed = speeds[i] || 0.02;
          const moveX = x * rect.width * speed;
          const moveY = y * rect.height * speed;
          blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
      });

      hero.addEventListener("mouseleave", () => {
        blobs.forEach((blob) => {
          blob.style.transform = "translate(0, 0)";
        });
      });
    }
  }

  // =====================================================
  // CURSOR GLOW — soft glow follows cursor (desktop only)
  // =====================================================
  if (!reduceMotion?.matches && !isMobile) {
    const glow = document.querySelector(".cursor-glow");
    if (glow) {
      let active = false;

      document.addEventListener("mousemove", (e) => {
        if (!active) {
          glow.classList.add("is-active");
          active = true;
        }
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      });

      document.addEventListener("mouseleave", () => {
        glow.classList.remove("is-active");
        active = false;
      });
    }
  }

  // =====================================================
  // HEADER SCROLL — subtle shrink on scroll
  // =====================================================
  const header = document.querySelector(".site-header");
  if (header) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 60) {
            header.style.borderBottomColor = "rgba(0,0,0,0.1)";
          } else {
            header.style.borderBottomColor = "";
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
})();
