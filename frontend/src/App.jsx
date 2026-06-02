
import React, { useState, useEffect, useCallback } from "react";
import { formatarHora } from "./utils";
import { CORES } from "./constants";
import Modal from "./Modal";
import Coluna from "./Coluna";
import MetricaCard from "./MetricaCard";
import Toast from "./Toast";
import { IconTruck, IconClock, IconCheck, IconAlert, IconPlus } from "./Icons";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function App() {
  const [entregas, setEntregas] = useState([]);
  const [relogio, setRelogio] = useState(new Date().toLocaleTimeString("pt-BR"));
  const [modalAberto, setModalAberto] = useState(false);
  const [entregaEditando, setEntregaEditando] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const t = setInterval(() => setRelogio(new Date().toLocaleTimeString("pt-BR")), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/entregas`)
      .then(r => r.json())
      .then(list => {
        const parsed = list.map(e => ({
          ...e,
          horaoPrevisto: e.horaoPrevisto ? new Date(e.horaoPrevisto) : null,
          horarioConclusao: e.horarioConclusao ? new Date(e.horarioConclusao) : null,
        }));
        setEntregas(parsed);
      })
      .catch(() => {});
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

  const abrirModal = useCallback((entrega = null) => {
    setEntregaEditando(entrega);
    setModalAberto(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setEntregaEditando(null);
  }, []);

  const salvarEntrega = useCallback((nova) => {
    const editingId = entregaEditando?.id;
    const isEdit = Boolean(editingId);
    if (isEdit) {
      fetch(`${API_URL}/entregas/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nova),
      })
        .then(r => r.json())
        .then(updated => {
          updated.horaoPrevisto = updated.horaoPrevisto ? new Date(updated.horaoPrevisto) : null;
          updated.horarioConclusao = updated.horarioConclusao ? new Date(updated.horarioConclusao) : null;
          setEntregas(prev => prev.map(e => e.id === updated.id ? updated : e));
          fecharModal();
          addToast(`Entrega ${updated.id} atualizada!`, true);
        })
        .catch(() => addToast('Erro ao atualizar entrega', false));
      return;
    }

    fetch(`${API_URL}/entregas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nova),
    })
      .then(r => r.json())
      .then(created => {
        created.horaoPrevisto = created.horaoPrevisto ? new Date(created.horaoPrevisto) : null;
        created.horarioConclusao = created.horarioConclusao ? new Date(created.horarioConclusao) : null;
        setEntregas(prev => [created, ...prev]);
        fecharModal();
        addToast(`Entrega ${created.id} registrada!`, true);
      })
      .catch(() => addToast('Erro ao registrar entrega', false));
  }, [addToast, entregaEditando, fecharModal]);

  const excluirEntrega = useCallback((eid) => {
    fetch(`${API_URL}/entregas/${eid}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('delete failed');
        setEntregas(prev => prev.filter(e => e.id !== eid));
        addToast(`Entrega ${eid} excluída!`, true);
      })
      .catch(() => addToast('Erro ao excluir entrega', false));
  }, [addToast]);

  const confirmarEntrega = useCallback((eid) => {
    const agora = new Date();
    fetch(`${API_URL}/entregas/${eid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'entregue', horarioConclusao: agora }),
    })
      .then(r => r.json())
      .then(updated => {
        updated.horaoPrevisto = updated.horaoPrevisto ? new Date(updated.horaoPrevisto) : null;
        updated.horarioConclusao = updated.horarioConclusao ? new Date(updated.horarioConclusao) : null;
        setEntregas(prev => prev.map(e => e.id === eid ? updated : e));
        addToast(`Entrega ${eid} concluída às ${formatarHora(agora)}!`, true);
      })
      .catch(() => addToast('Erro ao confirmar entrega', false));
  }, [addToast]);

  const caminho = entregas.filter(e => e.status === "caminho");
  const atrasadas = entregas.filter(e => e.status === "atrasada");
  const entregues = entregas.filter(e => e.status === "entregue");
  const total = entregas.length;
  const pct = total > 0 ? Math.round((entregues.length / total) * 100) : 0;

  return (
    <>
      {/* Header */}
      <header className="appHeader">
        <div className="appHeaderBrand">
          <img src="/logo.png" alt="UrbanLon" className="headerLogo" />
          <div className="appHeaderBrandTitle">
            <div className="brandPulse" />
            UrbanLog
          </div>
        </div>
        <div className="appHeaderActions">
          <span className="appHeaderClock">
            {relogio}
          </span>
          <button className="btn btn-primary" onClick={() => abrirModal()}>
            <IconPlus />
            Nova entrega
          </button>
        </div>
      </header>

      {/* Progresso */}
      <div className="progressSection">
        <div className="progressTrack">
          <div className="progressFill" style={{ "--fill-width": pct + "%" }} />
        </div>
        <div className="progressInfo">
          <span>Progresso do dia</span>
          <span>{entregues.length} de {total} entregue{entregues.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Métricas */}
      <div className="metricsGrid">
        <MetricaCard label="Total hoje" valor={total} cor={CORES.azul} iconBg="rgba(136,153,170,.12)" icon={<IconTruck size={18} color="#556677" />} />
        <MetricaCard label="A caminho" valor={caminho.length} cor={CORES.azulLight} iconBg="rgba(43,79,138,.1)" icon={<IconClock size={18} color={CORES.azulLight} />} />
        <MetricaCard label="Entregue" valor={entregues.length} cor={CORES.verde} iconBg="rgba(39,174,96,.12)" icon={<IconCheck size={18} color={CORES.verde} />} />
        <MetricaCard label="Atrasadas" valor={atrasadas.length} cor={CORES.laranja} iconBg="rgba(242,100,25,.12)" icon={<IconAlert size={18} color={CORES.laranja} />} />
      </div>

      {/* Painel */}
      <div className="panelGrid">
        <Coluna titulo="A caminho" tipo="caminho" entregas={caminho} onConfirmar={confirmarEntrega} onEditar={abrirModal} onExcluir={excluirEntrega} />
        <Coluna titulo="Atrasadas" tipo="atrasada" entregas={atrasadas} onConfirmar={confirmarEntrega} onEditar={abrirModal} onExcluir={excluirEntrega} />
        <Coluna titulo="Entregue" tipo="entregue" entregas={entregues} onConfirmar={confirmarEntrega} onEditar={abrirModal} onExcluir={excluirEntrega} />
      </div>

      {/* Modal */}
      {modalAberto && <Modal entrega={entregaEditando} onClose={fecharModal} onSalvar={salvarEntrega} />}

      {/* Toasts */}
      <div className="toastWrapper">
        {toasts.map(t => (
          <Toast key={t.id} msg={t.msg} sucesso={t.sucesso} onDone={() => removeToast(t.id)} />
        ))}
      </div>
    </>
  );
}
