import React, { useState } from "react";
import { IconUser, IconPin, IconCheck } from "./Icons";
import { CORES } from "./constants";
import { formatarHora, calcAtraso } from "./utils";

export default function EntregaCard({ entrega, onConfirmar, onEditar, onExcluir }) {
  const atrasada = entrega.status === "atrasada";
  const entregue = entrega.status === "entregue";
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff",
        borderRadius: 10,
        border: `1px solid rgba(13,31,60,${hover ? ".15" : ".08"})`,
        borderLeft: atrasada
          ? `3px solid ${CORES.laranja}`
          : entregue
          ? `3px solid ${CORES.verde}`
          : "1px solid rgba(13,31,60,.08)",
        padding: "14px 16px",
        opacity: entregue ? 0.82 : 1,
        transform: hover && !entregue ? "translateY(-2px)" : "none",
        boxShadow: hover ? "0 4px 16px rgba(13,31,60,.1)" : "none",
        transition: "all .2s ease",
        animation: "entrar .3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 12, flexWrap: "wrap" }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
          fontWeight: 500,
          color: CORES.azul,
          letterSpacing: ".3px",
        }}>
          {entrega.id}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {!entregue && (
            <button className="btn btn-success" onClick={() => onConfirmar(entrega.id)}>
              <IconCheck size={11} />
              Confirmar
            </button>
          )}
          {atrasada && (
            <span style={{
              background: "rgba(242,100,25,.12)",
              color: CORES.laranja,
              fontSize: 10,
              fontWeight: 500,
              padding: "3px 8px",
              borderRadius: 20,
              fontFamily: "'DM Mono', monospace",
              animation: "piscar 1.5s ease-in-out infinite",
              whiteSpace: "nowrap",
            }}>
              {calcAtraso(entrega.horaoPrevisto)}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {[
          { icon: <IconUser />, text: entrega.entregador },
          { icon: <IconPin />, text: entrega.destino },
        ].map(({ icon, text }, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#556677" }}>
            <span style={{ opacity: .5, display: "flex" }}>{icon}</span>
            {text}
          </div>
        ))}
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 10,
        borderTop: "1px solid rgba(13,31,60,.08)",
        flexWrap: "wrap",
        gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {entregue ? (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: CORES.verde }}>
              ✓ {formatarHora(entrega.horarioConclusao)}
            </span>
          ) : (
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              color: atrasada ? CORES.laranja : "#556677",
              fontWeight: atrasada ? 500 : 400,
            }}>
              {entrega.horarioTexto}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-secondary" onClick={() => onEditar && onEditar(entrega)}>
            Editar
          </button>
          <button className="btn btn-danger" onClick={() => onExcluir && onExcluir(entrega.id)}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
