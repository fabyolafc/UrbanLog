let _contador = 1;
export function gerarId() {
  return `UL-${String(_contador++).padStart(3, "0")}`;
}

export function formatarHora(date) {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function calcAtraso(previsto) {
  const min = Math.floor((Date.now() - previsto.getTime()) / 60000);
  if (min >= 60) return `+${Math.floor(min / 60)}h ${min % 60}m`;
  return `+${min}min`;
}

export function gerarDemoData() {
  const agora = new Date();
  const mk = (ent, dest, offsetMin, status) => {
    const prev = new Date(agora.getTime() + offsetMin * 60000);
    const auto = offsetMin < 0 ? "atrasada" : "caminho";
    return {
      id: gerarId(),
      entregador: ent,
      destino: dest,
      horaoPrevisto: prev,
      horarioTexto: prev.toTimeString().slice(0, 5),
      status: status || auto,
      horarioConclusao: null,
    };
  };
  const lista = [
    mk("Carlos Silva", "Av. Paulista, 1500", 40),
    mk("Marcos Souza", "Rua Oscar Freire, 700", -18),
    mk("Ana Lima", "Marginal Tietê, 500", -6),
    mk("João Ferreira", "Alameda Santos, 800", 55),
    mk("Rita Oliveira", "Rua Augusta, 1200", -32),
    mk("Paulo Santos", "Av. Faria Lima, 3500", 22),
  ];
  lista[3].status = "entregue";
  lista[3].horarioConclusao = new Date(agora.getTime() - 8 * 60000);
  return lista;
}
