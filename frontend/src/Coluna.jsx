import React from "react";
import { IconClock, IconAlert, IconCheck, IconBox } from "./Icons";
import EntregaCard from "./EntregaCard";
import { CORES } from "./constants";

export default function Coluna({ titulo, tipo, entregas, onConfirmar, onEditar, onExcluir }) {
  const configs = {
    caminho: { cor: CORES.azulLight, bg: "rgba(43,79,138,.08)", badgeBg: CORES.azulLight },
    atrasada: { cor: CORES.laranja, bg: "rgba(242,100,25,.08)", badgeBg: CORES.laranja },
    entregue: { cor: CORES.verde, bg: "rgba(39,174,96,.08)", badgeBg: CORES.verde },
  };
  const c = configs[tipo];
  const icons = { caminho: <IconClock size={14} />, atrasada: <IconAlert size={14} />, entregue: <IconCheck size={14} /> };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        borderRadius: 8,
        background: c.bg,
        marginBottom: 4,
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: c.cor,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          {icons[tipo]}
          {titulo}
        </div>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          fontWeight: 500,
          padding: "2px 8px",
          borderRadius: 20,
          background: c.badgeBg,
          color: "#fff",
        }}>
          {entregas.length}
        </span>
      </div>

      {entregas.length === 0 ? (
        <div style={{
          padding: "24px 0",
          textAlign: "center",
          color: CORES.cinza,
          fontSize: 12,
          border: "1.5px dashed rgba(13,31,60,.1)",
          borderRadius: 10,
        }}>
          <div style={{ marginBottom: 8, opacity: .35 }}><IconBox /></div>
          {tipo === "atrasada" ? "Nenhum atraso 👍" : tipo === "caminho" ? "Nenhuma em trânsito" : "Nenhuma concluída ainda"}
        </div>
      ) : (
        entregas.map(e => (
          <EntregaCard
            key={e.id}
            entrega={e}
            onConfirmar={onConfirmar}
            onEditar={onEditar}
            onExcluir={onExcluir}
          />
        ))
      )}
    </div>
  );
}
