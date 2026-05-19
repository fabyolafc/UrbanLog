import React, { useEffect } from "react";
import { IconCheck } from "./Icons";
import { CORES } from "./constants";

export default function Toast({ msg, sucesso, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="toast" style={{ borderLeft: `4px solid ${sucesso ? CORES.verde : CORES.laranja}` }}>
      <IconCheck size={16} />
      {msg}
    </div>
  );
}
