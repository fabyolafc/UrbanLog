import React, { useState, useEffect, useCallback } from "react";
import { gerarDemoData, formatarHora } from "./utils";
import { CORES } from "./constants";
import Modal from "./Modal";
import Coluna from "./Coluna";
import MetricaCard from "./MetricaCard";
import Toast from "./Toast";
import { IconTruck, IconClock, IconCheck, IconAlert, IconPlus } from "./Icons";
import "./styles.css";

export default function App() {
  const [entregas, setEntregas] = useState(() => gerarDemoData());
  const [relogio, setRelogio] = useState(new Date().toLocaleTimeString("pt-BR"));
  const [modalAberto, setModalAberto] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const t = setInterval(() => setRelogio(new Date().toLocaleTimeString("pt-BR")), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setEntregas(prev => prev.map(e =>
        e.status === "caminho" && new Date() > e.horaoPrevisto
          ? { ...e, status: "atrasada" }
          : e
      ));
    }, 30000);
    return () => clearInterval(t);
  }, []);

  const addToast = useCallback((msg, sucesso = true) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, sucesso }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const confirmarEntrega = useCallback((eid) => {
    const agora = new Date();
    setEntregas(prev => prev.map(e =>
      e.id === eid ? { ...e, status: "entregue", horarioConclusao: agora } : e
    ));
    addToast(`Entrega ${eid} concluída às ${formatarHora(agora)}!`, true);
  }, [addToast]);

  const salvarEntrega = useCallback((nova) => {
    setEntregas(prev => [nova, ...prev]);
    setModalAberto(false);
    addToast(`Entrega ${nova.id} registrada!`, true);
  }, [addToast]);

  const caminho = entregas.filter(e => e.status === "caminho");
  const atrasadas = entregas.filter(e => e.status === "atrasada");
  const entregues = entregas.filter(e => e.status === "entregue");
  const total = entregas.length;
  const pct = total > 0 ? Math.round((entregues.length / total) * 100) : 0;

  return (
    <>
      {/* Header */}
      <header style={{
        background: CORES.azul, padding: "0 28px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: "-.5px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, background: CORES.laranja, borderRadius: "50%", animation: "pulsar 2s ease-in-out infinite" }} />
          UrbanLog
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "rgba(255,255,255,.5)", letterSpacing: 1 }}>
            {relogio}
          </span>
          <button
            onClick={() => setModalAberto(true)}
            style={{
              background: CORES.laranja, color: "#fff", border: "none", borderRadius: 6,
              padding: "8px 16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              transition: "background .2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = CORES.laranjaLight}
            onMouseLeave={e => e.currentTarget.style.background = CORES.laranja}
          >
            <IconPlus />
            Nova entrega
          </button>
        </div>
      </header>

      {/* Progresso */}
      <div style={{ padding: "16px 28px 0" }}>
        <div style={{ height: 4, background: "rgba(13,31,60,.1)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 4,
            background: `linear-gradient(90deg, ${CORES.azulLight}, ${CORES.verde})`,
            width: pct + "%", transition: "width .6s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#556677" }}>
          <span>Progresso do dia</span>
          <span>{entregues.length} de {total} entregue{entregues.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, padding: "16px 28px 0" }}>
        <MetricaCard label="Total hoje" valor={total} cor={CORES.azul} iconBg="rgba(136,153,170,.12)" icon={<IconTruck size={18} color="#556677" />} />
        <MetricaCard label="A caminho" valor={caminho.length} cor={CORES.azulLight} iconBg="rgba(43,79,138,.1)" icon={<IconClock size={18} color={CORES.azulLight} />} />
        <MetricaCard label="Entregue" valor={entregues.length} cor={CORES.verde} iconBg="rgba(39,174,96,.12)" icon={<IconCheck size={18} color={CORES.verde} />} />
        <MetricaCard label="Atrasadas" valor={atrasadas.length} cor={CORES.laranja} iconBg="rgba(242,100,25,.12)" icon={<IconAlert size={18} color={CORES.laranja} />} />
      </div>

      {/* Painel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, padding: "20px 28px 32px" }}>
        <Coluna titulo="A caminho" tipo="caminho" entregas={caminho} onConfirmar={confirmarEntrega} />
        <Coluna titulo="Atrasadas" tipo="atrasada" entregas={atrasadas} onConfirmar={confirmarEntrega} />
        <Coluna titulo="Entregue" tipo="entregue" entregas={entregues} onConfirmar={confirmarEntrega} />
      </div>

      {/* Modal */}
      {modalAberto && <Modal onClose={() => setModalAberto(false)} onSalvar={salvarEntrega} />}

      {/* Toasts */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, display: "flex", flexDirection: "column", gap: 10 }}>
        {toasts.map(t => (
          <Toast key={t.id} msg={t.msg} sucesso={t.sucesso} onDone={() => removeToast(t.id)} />
        ))}
      </div>
    </>
  );
}
