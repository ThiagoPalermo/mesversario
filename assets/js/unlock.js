// CONFIGURAÇÃO DOS MESES LIBERADOS – você controla por aqui:
const releaseDates = {
  1: "2025-11-02",
  2: "2025-12-02",
  3: "2026-01-02",
  4: "2226-02-02",
  5: "2226-03-02",
  6: "2226-04-02",
  7: "2226-05-02",
  8: "2226-06-02",
  9: "2226-07-02",
  10: "2226-08-02",
  11: "2226-09-02",
  12: "2226-10-02",
};

// FUNÇÃO QUE VERIFICA SE UM MÊS ESTÁ LIBERADO
function checkMonthAccess(monthNumber) {
  const today = new Date();
  const release = new Date(releaseDates[monthNumber]);

  if (today < release) {
    // redireciona e salva mensagem para a página principal exibir
    localStorage.setItem("blockedMessage", "Ainda não é o momento! Espere até o nosso mêsversário 🥰");
    window.location.href = "index.html";
    return false;
  }

  return true;
}