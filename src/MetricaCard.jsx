import React from "react";

export default function MetricaCard({ label, valor, cor, iconBg, icon }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 10,
      padding: "16px 20px",
      border: "1px solid rgba(13,31,60,.08)",
      display: "flex",
      alignItems: "center",
      gap: 14,
      transition: "box-shadow .2s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(13,31,60,.1)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#556677", textTransform: "uppercase", letterSpacing: .8, fontWeight: 500, marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 700, color: cor, lineHeight: 1 }}>
          {valor}
        </div>
      </div>
    </div>
  );
}
