document.addEventListener("DOMContentLoaded", () => {

  /* ----------------------------------------------
     CONFIGURAÇÕES INICIAIS
  ---------------------------------------------- */

  const monthButtons = document.querySelectorAll('.grid button');
  const dataInicio = new Date(2025, 8, 2); // 02/09/2025
  const mensagemBloqueado = "Ainda não é o momento! Espere até o nosso mêsversário 🥰";

  const modal = document.getElementById('modal');
  const modalTexto = document.getElementById('modal-texto');
  const fechar = document.getElementById('fechar');


  /* ----------------------------------------------
     FUNÇÃO PARA LIBERAR OU BLOQUEAR MESES
  ---------------------------------------------- */

  function liberarMeses() {
    const hoje = new Date();

    monthButtons.forEach((btn, index) => {

      btn.disabled = false;

      const dataLiberacao = new Date(dataInicio);
      dataLiberacao.setMonth(dataInicio.getMonth() + (index + 1));
      dataLiberacao.setDate(2);

      const anoL = dataLiberacao.getFullYear();
      const mesL = dataLiberacao.getMonth();
      const diaL = 2;

      const liberado =
        (hoje.getFullYear() > anoL) ||
        (hoje.getFullYear() === anoL && hoje.getMonth() > mesL) ||
        (hoje.getFullYear() === anoL && hoje.getMonth() === mesL && hoje.getDate() >= diaL);

      if (liberado) {
        btn.classList.add('unlocked', 'animado');
        btn.classList.remove('bloqueado');
        setTimeout(() => btn.classList.remove('animado'), 800);
      } else {
        btn.classList.add('bloqueado');
        btn.classList.remove('unlocked');
      }

      /* ------------------------------------------
         CLIQUE DO BOTÃO
      ------------------------------------------- */

      btn.addEventListener('click', () => {
        if (btn.classList.contains('bloqueado')) {
          alert(mensagemBloqueado);
          return;
        }

        const texto = btn.innerText.trim();

        if (texto === "0.1")   { window.location.href = "mes01.html"; return; }
        if (texto === "0.2")   { window.location.href = "mes02.html"; return; }
        if (texto === "0.3")   { window.location.href = "mes03.html"; return; }
        if (texto === "0.4")   { window.location.href = "mes04.html"; return; }
        if (texto === "0.5")   { window.location.href = "mes05.html"; return; }
        if (texto === "0.6")   { window.location.href = "mes06.html"; return; }
        if (texto === "0.7")   { window.location.href = "mes07.html"; return; }
        if (texto === "0.8")   { window.location.href = "mes08.html"; return; }
        if (texto === "0.9")   { window.location.href = "mes09.html"; return; }
        if (texto === "0.10")  { window.location.href = "mes10.html"; return; }
        if (texto === "0.11")  { window.location.href = "mes11.html"; return; }
        if (texto === "01 ano 💚") { window.location.href = "mes12.html"; return; }

        abrirModal(btn.innerText);
      });

    });
  }


  /* ----------------------------------------------
     MODAL
  ---------------------------------------------- */

  function abrirModal(texto) {
    modalTexto.innerText = `Você desbloqueou o ${texto}! ❤️`;
    modal.style.display = 'flex';
  }

  fechar.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });


  /* ----------------------------------------------
     INICIAR O SISTEMA
  ---------------------------------------------- */

  liberarMeses();


  /* ----------------------------------------------
     EXIBIR AVISO DE BLOQUEIO ENTRE PÁGINAS
     (AGORA SUPER VISÍVEL!)
  ---------------------------------------------- */

  const msg = localStorage.getItem("blockedMessage");
  if (msg) {
    const box = document.getElementById("blocked-warning");

    if (box) {
      box.textContent = msg;
      box.classList.add("blocked-box");  // garante o estilo grande
      box.style.display = "block";       // aparece com destaque
    }

    localStorage.removeItem("blockedMessage");
  }

});