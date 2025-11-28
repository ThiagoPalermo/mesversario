(() => {
  const CURRENT_MONTH = 2;

  // === Chamada de bloqueio (defensiva) ===
  try {
    if (typeof checkMonthAccess === "function") {
      checkMonthAccess(CURRENT_MONTH);
    }
  } catch (err) {
    console.warn("checkMonthAccess não disponível ou falhou:", err);
  }

  // === TYPING (digitação letra-a-letra) ===
  const typingText = `
Engraçado como o sol e a chuva formam algo tão lindo quanto o arco-íris, né?
Acho que podemos dizer o mesmo de nós dois… porque juntos formamos o amor mais bonito que eu já vi.

Você é água, e eu sou fogo... elementos diferentes, mas que se completam de um jeito único.
E eu quero viver e explorar o mundo inteiro com você.

Quero estar contigo pra todo o sempre, Filipinho. 💧🔥

O primeiro tema retrata o preto e verde.
O preto era minha vida amorosa antes de você e de repente apareceu um verdinho na minha vida.

Agora somos Gota e Faísca... o que será que nos aguarda mês quem vem?
`.trim();

  function initTyping(targetId = "typed-text", speed = 38) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.textContent = "";
    let idx = 0;
    function step() {
      if (idx <= typingText.length - 1) {
        el.textContent += typingText.charAt(idx);
        idx++;
        setTimeout(step, speed);
      }
    }
    step();
  }

  // === CARROSSEL ROBUSTO ===
  function initCarousel(opts = {}) {
    const slidesWrapper = document.querySelector(".slides");
    if (!slidesWrapper) return;

    const slideEls = Array.from(slidesWrapper.querySelectorAll(".slide"));
    if (slideEls.length === 0) return;

    slidesWrapper.style.display = "flex";
    slidesWrapper.style.transition = "transform 0.6s ease";
    slidesWrapper.style.willChange = "transform";

    slideEls.forEach(s => {
      s.style.flex = "0 0 100%";
      s.style.maxWidth = "100%";
      s.style.boxSizing = "border-box";
    });

    let index = 0;
    const total = slideEls.length;
    let autoplayId = null;
    const autoplayDelay = opts.autoplayDelay || 5000;

    function show(i) {
      index = ((i % total) + total) % total;
      slidesWrapper.style.transform = `translateX(-${index * 100}%)`;
    }

    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    const btnNext = document.getElementById("next");
    const btnPrev = document.getElementById("prev");
    if (btnNext) btnNext.addEventListener("click", () => { next(); resetAuto(); });
    if (btnPrev) btnPrev.addEventListener("click", () => { prev(); resetAuto(); });

    function startAuto() {
      stopAuto();
      autoplayId = setInterval(next, autoplayDelay);
    }
    function stopAuto() {
      if (autoplayId) {
        clearInterval(autoplayId);
        autoplayId = null;
      }
    }
    function resetAuto() {
      stopAuto();
      startAuto();
    }

    show(0);
    startAuto();

    slidesWrapper.addEventListener("mouseenter", stopAuto);
    slidesWrapper.addEventListener("mouseleave", startAuto);

      /* =====================================
       SUPORTE A SWIPE (DESLIZAR) — IGUAL INSTAGRAM
    ===================================== */
    let startX = 0;
    let isDragging = false;
    let diffX = 0;

    function startDrag(x) {
      startX = x;
      isDragging = true;
      stopAuto(); // pausa autoplay enquanto arrasta
    }

    function moveDrag(x) {
      if (!isDragging) return;
      diffX = x - startX;

      // acompanha o dedo (arraste suave)
      slidesWrapper.style.transition = "none";
      slidesWrapper.style.transform =
        `translateX(calc(-${index * 100}% + ${diffX}px))`;
    }

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;

      slidesWrapper.style.transition = "transform 0.45s ease";

      // sensibilidade (mínimo para trocar o slide)
      const threshold = 50;

      if (diffX > threshold) {
        prev(); // deslizou para a direita → volta slide
      } else if (diffX < -threshold) {
        next(); // deslizou para a esquerda → avança slide
      } else {
        // volta para a posição original caso não tenha sido forte o bastante
        show(index);
      }

      diffX = 0;
      startAuto(); // retoma autoplay
    }

    // TOUCH (celular)
    slidesWrapper.addEventListener("touchstart", e => {
      startDrag(e.touches[0].clientX);
    });

    slidesWrapper.addEventListener("touchmove", e => {
      moveDrag(e.touches[0].clientX);
    });

    slidesWrapper.addEventListener("touchend", endDrag);

    // MOUSE (desktop)
    slidesWrapper.addEventListener("mousedown", e => {
      startDrag(e.clientX);
    });

    slidesWrapper.addEventListener("mousemove", e => {
      if (isDragging) moveDrag(e.clientX);
    });

    slidesWrapper.addEventListener("mouseup", endDrag);
    slidesWrapper.addEventListener("mouseleave", () => {
      if (isDragging) endDrag();
    });

    return { show, next, prev, startAuto, stopAuto };
  }

  // === MÚSICA PLAY/PAUSE + ÍCONE ===
  function initAudio() {
    const musica = document.getElementById("musica");
    const btnMusica = document.getElementById("music-btn");
    const icon = document.getElementById("icon");
    if (!musica || !btnMusica || !icon) return;

    function sync() {
      if (musica.paused) icon.classList.add("muted");
      else icon.classList.remove("muted");
    }

    btnMusica.addEventListener("click", () => {
      if (musica.paused) {
        musica.play().catch(() => {/* autoplay blocked */});
      } else {
        musica.pause();
      }
      sync();
    });

    musica.addEventListener("play", sync);
    musica.addEventListener("pause", sync);
    setTimeout(sync, 50);
  }

  // === PARTICLES (defensivo) ===
  function initParticles() {
    const container = document.querySelector(".particles-container");
    if (!container) return;
    function createParticle() {
      const p = document.createElement("div");
      p.className = "particle";
      const isFire = Math.random() < 0.5;
      p.classList.add(isFire ? "fire" : "water");
      p.style.left = Math.random() * 100 + "vw";
      p.style.animationDuration = 3 + Math.random() * 3 + "s";
      p.style.opacity = (0.3 + Math.random() * 0.8).toString();
      container.appendChild(p);
      setTimeout(() => p.remove(), 6500);
    }
    const id = setInterval(createParticle, 180);
    window.addEventListener("beforeunload", () => clearInterval(id));
  }

  // === NAV ENTRE MESES (prev/next) - defensivo ===
  function initMonthNav(current = CURRENT_MONTH) {
  const prevBtn = document.getElementById("prevMes");
  const nextBtn = document.getElementById("nextMes");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const prev = current - 1;
      if (prev >= 1) window.location.href = `mes0${prev}.html`;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const nxt = current + 1;

      // checa se está liberado ANTES de navegar
      if (typeof checkMonthAccess === "function") {
        const allowed = checkMonthAccess(nxt);
        if (!allowed) return; // bloqueia e redireciona pro index
      }

      window.location.href = `mes0${nxt}.html`;
    });
  }
}

  // === INICIALIZAÇÃO quando DOM estiver pronto ===
  function initAll() {
    initTyping();
    initCarousel();
    initAudio();
    initParticles();
    initMonthNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

})(); // fim IIFE