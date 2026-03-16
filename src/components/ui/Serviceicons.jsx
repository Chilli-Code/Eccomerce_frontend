// ── ServiceIcons.jsx ──
// SVGs animados con CSS para cada servicio
// Uso: import { TecnicoIcon, VentaIcon, AccesoriosIcon } from "./ServiceIcons";

export const TecnicoIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .wrench-body { transform-origin: 12px 40px; animation: wrench-rotate 2.5s ease-in-out infinite; }
      @keyframes wrench-rotate {
        0%, 100% { transform: rotate(0deg); }
        20%       { transform: rotate(-18deg); }
        40%       { transform: rotate(12deg); }
        60%       { transform: rotate(-8deg); }
        80%       { transform: rotate(4deg); }
      }
      .screen-flicker { animation: flicker 3s ease-in-out infinite; }
      @keyframes flicker {
        0%, 90%, 100% { opacity: 1; }
        92%            { opacity: 0.3; }
        94%            { opacity: 1; }
        96%            { opacity: 0.2; }
        98%            { opacity: 1; }
      }
      .crack-draw { stroke-dasharray: 30; stroke-dashoffset: 30; animation: draw-crack 2s ease forwards 0.5s; }
      @keyframes draw-crack {
        to { stroke-dashoffset: 0; }
      }
    `}</style>

    {/* Phone body */}
    <rect x="10" y="4" width="24" height="38" rx="4" fill="#e4e4e7" stroke="#18181b" strokeWidth="1.5"/>
    {/* Screen */}
    <rect x="13" y="9" width="18" height="24" rx="2" fill="#18181b" className="screen-flicker"/>
    {/* Home button */}
    <circle cx="22" cy="37" r="2" fill="#a1a1aa"/>
    {/* Crack */}
    <path className="crack-draw" d="M18 11 L22 20 L19 26 L24 33" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

    {/* Wrench */}
    <g className="wrench-body">
      <path d="M8 44 L20 28" stroke="#18181b" strokeWidth="3" strokeLinecap="round"/>
      <path d="M6 40 Q4 36 8 34 Q12 32 14 36 Q10 35 10 38 Z" fill="#18181b"/>
      <rect x="19" y="24" width="4" height="6" rx="1" fill="#18181b" transform="rotate(-35 21 27)"/>
    </g>
  </svg>
);

export const VentaIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .coin-float {
        animation: coin-up 2s ease-in-out infinite;
        transform-origin: 38px 20px;
      }
      .coin-float-2 { animation: coin-up 2s ease-in-out infinite 0.3s; transform-origin: 44px 14px; }
      .coin-float-3 { animation: coin-up 2s ease-in-out infinite 0.6s; transform-origin: 32px 14px; }
      @keyframes coin-up {
        0%   { transform: translateY(0px); opacity: 1; }
        60%  { transform: translateY(-10px); opacity: 0.6; }
        100% { transform: translateY(-18px); opacity: 0; }
      }
      .arrow-bounce { animation: bounce-up 1.5s ease-in-out infinite; }
      @keyframes bounce-up {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(-4px); }
      }
    `}</style>

    {/* Phone */}
    <rect x="8" y="8" width="22" height="36" rx="4" fill="#e4e4e7" stroke="#18181b" strokeWidth="1.5"/>
    <rect x="11" y="13" width="16" height="20" rx="2" fill="#18181b"/>
    <circle cx="19" cy="38" r="2" fill="#a1a1aa"/>

    {/* Arrow up on screen */}
    <g className="arrow-bounce">
      <path d="M19 28 L19 18 M15 22 L19 18 L23 22" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>

    {/* Coins floating */}
    <g className="coin-float">
      <circle cx="38" cy="20" r="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      <text x="35.5" y="23.5" fontSize="7" fill="#92400e" fontWeight="bold">$</text>
    </g>
    <g className="coin-float-2">
      <circle cx="44" cy="14" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      <text x="41.5" y="17.5" fontSize="6" fill="#92400e" fontWeight="bold">$</text>
    </g>
    <g className="coin-float-3">
      <circle cx="32" cy="14" r="3.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      <text x="30" y="17" fontSize="5" fill="#92400e" fontWeight="bold">$</text>
    </g>
  </svg>
);

export const AccesoriosIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .cable-draw {
        stroke-dasharray: 60;
        stroke-dashoffset: 60;
        animation: draw-cable 1.8s ease-in-out infinite alternate;
      }
      @keyframes draw-cable {
        to { stroke-dashoffset: 0; }
      }
      .bolt-pulse { animation: bolt 2s ease-in-out infinite; transform-origin: 38px 24px; }
      @keyframes bolt {
        0%, 100% { opacity: 0.4; transform: scale(0.9); }
        50%       { opacity: 1;   transform: scale(1.1); }
      }
      .case-wiggle { animation: wiggle 3s ease-in-out infinite; transform-origin: 14px 26px; }
      @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25%       { transform: rotate(-3deg); }
        75%       { transform: rotate(3deg); }
      }
    `}</style>

    {/* Phone case */}
    <g className="case-wiggle">
      <rect x="4" y="10" width="20" height="32" rx="5" fill="none" stroke="#18181b" strokeWidth="2"/>
      <rect x="7" y="13" width="14" height="26" rx="3" fill="#e4e4e7"/>
      {/* Camera cutout */}
      <circle cx="14" cy="17" r="3" fill="#18181b"/>
      <circle cx="14" cy="17" r="1.5" fill="#3f3f46"/>
    </g>

    {/* Cable */}
    <path
      className="cable-draw"
      d="M24 38 Q32 38 34 32 Q36 26 38 26"
      stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" fill="none"
    />

    {/* Charger plug */}
    <rect x="35" y="22" width="8" height="6" rx="2" fill="#18181b"/>
    <rect x="37" y="20" width="2" height="2" rx="0.5" fill="#18181b"/>
    <rect x="41" y="20" width="2" height="2" rx="0.5" fill="#18181b"/>

    {/* Lightning bolt */}
    <g className="bolt-pulse">
      <path d="M40 14 L36 22 L39 22 L35 30 L43 20 L40 20 Z" fill="#fbbf24"/>
    </g>
  </svg>
);