import { useState, useEffect, useRef } from "react";

const VIA_TYPES = [
  { value: "Calle", label: "Calle" },
  { value: "Cra", label: "Carrera" },
  { value: "Av", label: "Avenida" },
  { value: "Tv", label: "Transversal" },
  { value: "Dg", label: "Diagonal" },
  { value: "Circ", label: "Circular" },
];

const STREET_REGEX = /^(Calle|Cra|Av|Tv|Dg|Circ)\s+(.+?)\s*#\s*(.+?)\s*-\s*(.+?)(?:,\s*(.+))?$/i;

export default function AddressInput({ value, onChange, className = "" }) {
  const [parts, setParts] = useState(() => parseAddress(value || ""));
  const lastEmitted = useRef("");

  useEffect(() => {
    if (value !== lastEmitted.current) {
      setParts(parseAddress(value || ""));
    }
  }, [value]);

  function parseAddress(addr) {
    const match = addr.match(STREET_REGEX);
    if (match) {
      return {
        viaType: match[1],
        name: match[2],
        num1: match[3],
        num2: match[4],
        complement: match[5] || "",
      };
    }
    const simple = addr.split(",")[0] || addr;
    return { viaType: "Calle", name: simple, num1: "", num2: "", complement: "" };
  }

  function buildAddress(p) {
    let addr = `${p.viaType} ${p.name}`;
    if (p.num1) addr += ` #${p.num1}`;
    if (p.num2) addr += `-${p.num2}`;
    if (p.complement) addr += `, ${p.complement}`;
    return addr;
  }

  function update(field, val) {
    const next = { ...parts, [field]: val };
    setParts(next);
    const built = buildAddress(next);
    lastEmitted.current = built;
    onChange(built);
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={parts.viaType}
          onChange={e => update("viaType", e.target.value)}
          className="px-3 py-2 border border-zinc-200 rounded-xl text-sm bg-white min-w-[90px]"
        >
          {VIA_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={parts.name}
          onChange={e => update("name", e.target.value)}
          placeholder="N° de vía (ej: 82, 82E)"
          className="flex-1 min-w-[120px] px-3 py-2 border border-zinc-200 rounded-xl text-sm"
        />
        <div className="flex items-center gap-1 flex-nowrap">
          <span className="text-sm text-zinc-400 font-medium">#</span>
          <input
            type="text"
            value={parts.num1}
            onChange={e => update("num1", e.target.value)}
            placeholder="Placa (ej: 26, 26C)"
            className="w-[110px] px-3 py-2 border border-zinc-200 rounded-xl text-sm"
          />
          <span className="text-sm text-zinc-400">-</span>
          <input
            type="text"
            value={parts.num2}
            onChange={e => update("num2", e.target.value)}
            placeholder="N° (ej: 163, 01)"
            className="w-[110px] px-3 py-2 border border-zinc-200 rounded-xl text-sm"
          />
        </div>
      </div>
      <input
        type="text"
        value={parts.complement}
        onChange={e => update("complement", e.target.value)}
        placeholder="Complemento (apto, piso, etc.) — opcional"
        className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm"
      />
    </div>
  );
}
