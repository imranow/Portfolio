(() => {
  document.documentElement.classList.add("js");

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const isMobile = window.innerWidth < 980;

  // =====================================================
  // PAGE ENTRANCE — curtain lift, then hero choreography
  // =====================================================
  function triggerEntrance() {
    document.body.classList.add("is-loaded");

    // After body fades in, trigger hero word cascade
    setTimeout(() => {
      const heroCopy = document.querySelector(".hero-copy");
      const heroTitle = document.querySelector(".hero-title");
      if (heroCopy) heroCopy.classList.add("is-visible");
      if (heroTitle) heroTitle.classList.add("is-visible");

      // Also reveal the hero-art
      const heroArt = document.querySelector(".hero-art");
      if (heroArt) heroArt.classList.add("is-visible");
    }, 200);
  }

  if (reduceMotion?.matches) {
    // Instantly show everything
    document.body.classList.add("is-loaded");
    document.querySelectorAll("[data-reveal]").forEach(el => el.classList.add("is-visible"));
    document.querySelector(".hero-title")?.classList.add("is-visible");
    document.querySelector(".hero-copy")?.classList.add("is-visible");
    document.querySelectorAll(".section-alt").forEach(el => el.classList.add("line-visible"));
  } else {
    // Wait for fonts then trigger entrance
    if (document.fonts) {
      document.fonts.ready.then(triggerEntrance);
    } else {
      window.addEventListener("load", triggerEntrance);
    }
    // Safety timeout
    setTimeout(() => {
      if (!document.body.classList.contains("is-loaded")) triggerEntrance();
    }, 1500);
  }

  // =====================================================
  // SPLIT-TEXT HERO — stagger word delays
  // =====================================================
  if (!reduceMotion?.matches) {
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      const words = heroTitle.querySelectorAll(".word");
      words.forEach((word, i) => {
        word.style.transitionDelay = `${200 + i * 50}ms`;
      });
    }
  }

  // =====================================================
  // SCROLL REVEAL — staggered, smooth entrance
  // =====================================================
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  // Exclude hero-copy and hero-art from IO (handled by entrance choreography)
  const ioRevealEls = revealEls.filter(
    el => !el.classList.contains("hero-copy") && !el.classList.contains("hero-art")
  );

  if (reduceMotion?.matches) {
    for (const el of revealEls) el.classList.add("is-visible");
  } else if (ioRevealEls.length) {
    ioRevealEls.forEach((el, idx) => {
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
      for (const el of ioRevealEls) io.observe(el);
    } else {
      for (const el of ioRevealEls) el.classList.add("is-visible");
    }
  }

  // =====================================================
  // SECTION DIVIDER LINES — grow from left on scroll
  // =====================================================
  if (!reduceMotion?.matches && "IntersectionObserver" in window) {
    const sectionAlts = document.querySelectorAll(".section-alt");
    const lineIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("line-visible");
          lineIO.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );
    sectionAlts.forEach(el => lineIO.observe(el));
  }

  // =====================================================
  // LENIS SMOOTH SCROLL
  // =====================================================
  if (!reduceMotion?.matches && typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
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
        const x = (e.clientX - rect.left) / rect.width - 0.5;
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
  // 3D TILT CARDS — perspective + glare on hover
  // =====================================================
  if (!reduceMotion?.matches && !isMobile) {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
      let ticking = false;

      card.addEventListener("mousemove", (e) => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;

          const rotateX = (0.5 - y) * 8;   // max ±4 degrees
          const rotateY = (x - 0.5) * 8;

          card.style.transition = "box-shadow 280ms ease, border-color 200ms ease";
          card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
          card.style.setProperty("--mx", `${x * 100}%`);
          card.style.setProperty("--my", `${y * 100}%`);

          ticking = false;
        });
      });

      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 400ms cubic-bezier(0.16,1,0.3,1), box-shadow 280ms ease, border-color 200ms ease";
        card.style.transform = "";
      });
    });
  }

  // =====================================================
  // MAGNETIC BUTTONS — shift toward cursor
  // =====================================================
  if (!reduceMotion?.matches && !isMobile) {
    const magneticEls = document.querySelectorAll(".btn, .nav-cta");

    magneticEls.forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        btn.style.setProperty("--mag-x", (deltaX * 0.15).toFixed(1));
        btn.style.setProperty("--mag-y", (deltaY * 0.15).toFixed(1));
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.setProperty("--mag-x", "0");
        btn.style.setProperty("--mag-y", "0");
      });
    });
  }

  // =====================================================
  // HEADER SCROLL — subtle border on scroll
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
