import React, { useState } from "react";
import { gerarId } from "./utils";
import { CORES } from "./constants";

export default function Modal({ onClose, onSalvar }) {
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() + 45);
  const [form, setForm] = useState({
    id: gerarId(),
    entregador: "",
    destino: "",
    horario: agora.toTimeString().slice(0, 5),
  });
  const [btnHover, setBtnHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSalvar = () => {
    if (!form.entregador || !form.destino || !form.horario) return;
    const [h, m] = form.horario.split(":").map(Number);
    const prev = new Date();
    prev.setHours(h, m, 0, 0);
    onSalvar({
      id: form.id || gerarId(),
      entregador: form.entregador,
      destino: form.destino,
      horaoPrevisto: prev,
      horarioTexto: form.horario,
      status: new Date() > prev ? "atrasada" : "caminho",
      horarioConclusao: null,
    });
  };

  const inputStyle = {
    border: "1px solid rgba(13,31,60,.12)",
    borderRadius: 7,
    padding: "9px 12px",
    fontSize: 14,
    color: CORES.azul,
    background: "#F0F4F8",
    outline: "none",
    width: "100%",
    transition: "border-color .2s, background .2s",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(13,31,60,.5)",
        backdropFilter: "blur(3px)",
        zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "28px 32px",
          width: 420,
          maxWidth: "95vw",
          boxShadow: "0 20px 60px rgba(13,31,60,.25)",
          animation: "modalIn .25s ease",
        }}
      >
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 18, fontWeight: 700, color: CORES.azul,
          marginBottom: 20,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ width: 6, height: 24, background: CORES.laranja, borderRadius: 3, display: "inline-block" }} />
          Registrar nova entrega
        </div>

        {[
          { label: "ID do pedido", key: "id", ph: "Ex: UL-001" },
          { label: "Entregador", key: "entregador", ph: "Nome do entregador" },
          { label: "Destino", key: "destino", ph: "Rua, bairro ou referência" },
        ].map(({ label, key, ph }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: .7, color: "#556677", fontWeight: 500, marginBottom: 5 }}>{label}</div>
            <input
              value={form[key]}
              onChange={set(key)}
              placeholder={ph}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = CORES.azulLight; e.target.style.background = "#fff"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(13,31,60,.12)"; e.target.style.background = "#F0F4F8"; }}
            />
          </div>
        ))}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: .7, color: "#556677", fontWeight: 500, marginBottom: 5 }}>Horário previsto</div>
          <input
            type="time"
            value={form.horario}
            onChange={set("horario")}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = CORES.azulLight; e.target.style.background = "#fff"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(13,31,60,.12)"; e.target.style.background = "#F0F4F8"; }}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onMouseEnter={() => setCancelHover(true)}
            onMouseLeave={() => setCancelHover(false)}
            onClick={onClose}
            style={{
              flex: 1, background: cancelHover ? "#E8EEF4" : "#F0F4F8",
              border: "1px solid rgba(13,31,60,.12)",
              borderRadius: 7, padding: 10,
              fontSize: 14, fontWeight: 500, color: "#556677",
              cursor: "pointer", transition: "all .2s", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancelar
          </button>
          <button
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            onClick={handleSalvar}
            style={{
              flex: 2,
              background: btnHover ? CORES.azulMid : CORES.azul,
              border: "none", borderRadius: 7, padding: 10,
              fontSize: 14, fontWeight: 500, color: "#fff",
              cursor: "pointer", transition: "all .2s", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Registrar entrega
          </button>
        </div>
      </div>
    </div>
  );
}
