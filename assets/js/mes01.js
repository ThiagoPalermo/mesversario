(() => {
  const CURRENT_MONTH = 1;

  // === Chamada de bloqueio (defensiva) ===
  try {
    if (typeof checkMonthAccess === "function") {
      checkMonthAccess(CURRENT_MONTH);
    }
  } catch (err) {
    console.warn("checkMonthAccess não disponível ou falhou:", err);
  }

  /* ===== CANVAS DE CORAÇÕES (se existir #heartCanvas) ===== */
  function initCanvasHearts() {
    const canvas = document.getElementById("heartCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let hearts = [];
    const heartImage = new Image();
    heartImage.crossOrigin = "anonymous";
    heartImage.src = "https://cdn-icons-png.flaticon.com/512/833/833472.png";

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function novoCoracao() {
      return {
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        size: Math.random() * 22 + 8,
        speed: Math.random() * 1.6 + 0.6,
        rot: (Math.random() - 0.5) * 0.02
      };
    }

    function desenhar() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!heartImage.complete) { requestAnimationFrame(desenhar); return; }

      hearts.forEach((h, i) => {
        ctx.save();
        ctx.translate(h.x + h.size / 2, h.y + h.size / 2);
        ctx.rotate(h.rot);
        ctx.drawImage(heartImage, -h.size / 2, -h.size / 2, h.size, h.size);
        ctx.restore();

        h.y += h.speed;
        h.x += Math.sin(h.y / 40) * 0.5;

        if (h.y - h.size > canvas.height) {
          hearts[i] = novoCoracao();
        }
      });

      requestAnimationFrame(desenhar);
    }

    hearts = Array.from({ length: 22 }, () => novoCoracao());
    desenhar();
  }

  /* ===== CARROSSEL (mes01: usa .slide e .prev/.next, com classe 'ativo') ===== */
  function initCarouselMes01(opts = {}) {
    const slideEls = Array.from(document.querySelectorAll(".slide"));
    if (slideEls.length === 0) return;

    const btnPrev = document.querySelector(".prev");
    const btnNext = document.querySelector(".next");

    let index = 0;
    const total = slideEls.length;
    let autoplayId = null;
    const delay = opts.delay || 5000;

    function show(i) {
      index = ((i % total) + total) % total;
      slideEls.forEach((s, idx) => {
        s.classList.toggle("ativo", idx === index);
      });
    }

    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    if (btnNext) btnNext.addEventListener("click", () => { next(); resetAuto(); });
    if (btnPrev) btnPrev.addEventListener("click", () => { prev(); resetAuto(); });

    function startAuto() {
      stopAuto();
      autoplayId = setInterval(next, delay);
    }
    function stopAuto() {
      if (autoplayId) { clearInterval(autoplayId); autoplayId = null; }
    }
    function resetAuto() { stopAuto(); startAuto(); }

    // pause on hover over any slide area
    slideEls.forEach(s => {
      s.addEventListener("mouseenter", stopAuto);
      s.addEventListener("mouseleave", startAuto);
    });

    show(0);
    startAuto();

    return { show, next, prev, startAuto, stopAuto };
  }

  /* ===== TEXTO DIGITADO ===== */
  function initTypingMes01() {
    const texto = `Meu amor, completamos o nosso primeiro mês juntos.
Cada detalhe, cada conversa, cada beijo e cada abraço… tudo permanece na minha memória com carinho, como se fosse a primeira vez. No momento em que te conheci, percebi que já estava apaixonado por você, e hoje eu não sei mais viver sem pensar em nós e em todos esses momentos que sempre serão especiais para mim.
Obrigado por estar comigo, por me fazer tão feliz, por fazer meus olhos brilharem só de lembrar de você e por deixar minha vida mais leve e mais bonita.
Esse é só o começo da nossa história. Tem muito mais para vivermos juntos.

Eu te amo! 💚💚💚💚`.trim();

    const campo = document.getElementById("textoDigitado");
    if (!campo) return;
    campo.innerHTML = "";
    let i = 0;
    const speed = 45;

    function step() {
      if (i < texto.length) {
        const ch = texto.charAt(i);
        if (ch === "\n") campo.innerHTML += "<br>";
        else campo.innerHTML += ch;
        i++;
        setTimeout(step, speed);
      }
    }
    step();
  }

  /* ===== MÚSICA (mes01 usa btn id 'btnMusica' e escreve texto no botão) ===== */
  function initAudioMes01() {
    const musica = document.getElementById("musica");
    const btnMusica = document.getElementById("btnMusica");
    if (!musica || !btnMusica) return;

    function updateLabel() {
      if (musica.paused) btnMusica.textContent = "▶ Tocar Música";
      else btnMusica.textContent = "⏸ Pausar Música";
    }

    btnMusica.addEventListener("click", () => {
      if (musica.paused) {
        musica.play().catch(() => {});
      } else {
        musica.pause();
      }
      updateLabel();
    });

    musica.addEventListener("play", updateLabel);
    musica.addEventListener("pause", updateLabel);
    setTimeout(updateLabel, 50);
  }

  /* ===== PARTICLES fallback: se não houver canvas, cria particulas simples ===== */
  function initParticlesFallback() {
    const container = document.querySelector(".particles-container");
    if (!container) return;

    function createParticle() {
      const p = document.createElement("div");
      p.className = "particle";
      const isFire = Math.random() < 0.5;
      p.classList.add(isFire ? "fire" : "water");
      p.style.left = Math.random() * 100 + "vw";
      p.style.animationDuration = 3 + Math.random() * 3 + "s";
      p.style.opacity = (0.3 + Math.random() * 0.7).toString();
      container.appendChild(p);
      setTimeout(() => p.remove(), 7000);
    }
    const id = setInterval(createParticle, 180);
    window.addEventListener("beforeunload", () => clearInterval(id));
  }

  /* ===== NAV ENTRE MESES ===== */
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

  /* ===== INICIALIZAÇÃO ===== */
  function initAll() {
    initCanvasHearts();
    initParticlesFallback(); // particles fallback will harmlessly do nothing if canvas exists
    initCarouselMes01();
    initTypingMes01();
    initAudioMes01();
    initMonthNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();