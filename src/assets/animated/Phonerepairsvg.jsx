import { useEffect, useRef } from "react";
import gsap from "gsap";

const PhoneRepairSVG = () => {
  const cracksRef = useRef(null);
  const checkRef  = useRef(null);
  const sparkRef  = useRef([]);
  const toolRef   = useRef(null);

  useEffect(() => {
    // Estado inicial
    gsap.set(checkRef.current,  { scale: 0, opacity: 0, transformOrigin: "160px 155px" });
    gsap.set(sparkRef.current,  { opacity: 0, scale: 0, transformOrigin: "center" });
    gsap.set(toolRef.current,   { rotate: 0, transformOrigin: "252px 78px" });

    const loop = () => {
      const tl = gsap.timeline({ onComplete: () => {
        // Pausa 1s en estado "reparado" antes de reiniciar
        setTimeout(() => {
          gsap.to(checkRef.current,  { scale: 0, opacity: 0, duration: 0.3 });
          gsap.to(sparkRef.current,  { opacity: 0, scale: 0, duration: 0.3 });
          gsap.to(cracksRef.current, { opacity: 1, duration: 0.4, delay: 0.2, onComplete: loop });
        }, 1500);
      }});

      // 1. Destornillador entra girando
      tl.fromTo(toolRef.current,
        { x: 40, y: -40, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      )
      // 2. Herramienta "trabaja" — vibra
      .to(toolRef.current, { rotation: -8, duration: 0.12, ease: "power1.inOut", yoyo: true, repeat: 5 })
      // 3. Grietas desaparecen
      .to(cracksRef.current, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, "-=0.2")
      // 4. Herramienta sale
      .to(toolRef.current, { x: 40, y: -40, opacity: 0, duration: 0.4, ease: "power2.in" })
      // 5. Checkmark aparece
      .to(checkRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" })
      // 6. Destellos
      .to(sparkRef.current, {
        opacity: 1, scale: 1, duration: 0.3, stagger: 0.08, ease: "back.out(2)"
      }, "-=0.2");
    };

    loop();
    return () => gsap.killTweensOf([cracksRef.current, checkRef.current, toolRef.current, ...sparkRef.current]);
  }, []);

  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* ── Cuerpo del iPhone ── */}
      <rect x="95" y="40" width="130" height="240" rx="22" fill="#18181b"/>
      <rect x="103" y="52" width="114" height="216" rx="14" fill="#27272a"/>
      <rect x="108" y="57" width="104" height="200" rx="11" fill="#3f3f46" opacity="0.4"/>
      {/* Notch */}
      <rect x="138" y="44" width="44" height="10" rx="5" fill="#09090b"/>
      {/* Botón home / lateral */}
      <rect x="93" y="120" width="4" height="30" rx="2" fill="#3f3f46"/>

      {/* ── Grietas (se ocultan) ── */}
      <g ref={cracksRef}>
        <line x1="140" y1="70"  x2="195" y2="145" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="195" y1="145" x2="152" y2="205" stroke="#ef4444" strokeWidth="2"   strokeLinecap="round"/>
        <line x1="158" y1="85"  x2="125" y2="165" stroke="#ef4444" strokeWidth="2"   strokeLinecap="round"/>
        <line x1="172" y1="100" x2="205" y2="175" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <line x1="145" y1="155" x2="175" y2="135" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </g>

      {/* ── Checkmark (aparece al reparar) ── */}
      <g ref={checkRef}>
        <circle cx="160" cy="155" r="32" fill="#18181b" stroke="#34d399" strokeWidth="2.5"/>
        <path d="M147 155 l9 9 l17-17" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>

      {/* ── Destellos post-reparación ── */}
      <circle ref={(el) => (sparkRef.current[0] = el)} cx="218" cy="88"  r="5" fill="#34d399"/>
      <circle ref={(el) => (sparkRef.current[1] = el)} cx="98"  cy="195" r="4" fill="#34d399"/>
      <circle ref={(el) => (sparkRef.current[2] = el)} cx="228" cy="215" r="3.5" fill="#fbbf24"/>
      <circle ref={(el) => (sparkRef.current[3] = el)} cx="112" cy="90"  r="3" fill="#fbbf24"/>

      {/* ── Destornillador (entra y sale) ── */}
      <g ref={toolRef}>
        <rect x="248" y="28" width="8" height="50" rx="4" fill="#a1a1aa"/>
        <rect x="250" y="76" width="4" height="28" rx="1" fill="#71717a"/>
        <polygon points="250,103 254,103 252,118" fill="#52525b"/>
        {/* Mango */}
        <rect x="245" y="18" width="14" height="14" rx="4" fill="#e4e4e7"/>
        <rect x="248" y="21" width="8"  height="2"  rx="1" fill="#a1a1aa"/>
        <rect x="248" y="25" width="8"  height="2"  rx="1" fill="#a1a1aa"/>
      </g>
    </svg>
  );
};

export default PhoneRepairSVG;