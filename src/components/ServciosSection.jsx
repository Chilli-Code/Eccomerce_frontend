import { useEffect, useRef } from "react";
import gsap from "gsap";

import { SplitText } from "gsap/SplitText";
import { TecnicoIcon, VentaIcon, AccesoriosIcon } from "../components/ui/Serviceicons";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(SplitText);

const services = [
  {
    num: "01",
    title: "Servicio Técnico",
    desc: "Reparación profesional de pantallas, baterías, cámaras y daños por agua. Diagnóstico gratuito en menos de 30 minutos.",
    tag: "Reparaciones",
    href: "/servicio_tecnico",
     icon: <TecnicoIcon />,
  },
  {
    num: "02",
    title: "Vende tu Celular",
    desc: "Cotizamos tu dispositivo al instante. Recibe el mejor precio del mercado y pago inmediato en efectivo o transferencia.",
    tag: "Valuación",
    href: "/phone_valuator",
    icon: <VentaIcon />,
  },
  {
    num: "03",
    title: "Accesorios & Protección",
    desc: "Fundas, cargadores MagSafe, protectores de pantalla y audífonos. Todo lo que tu iPhone necesita en un solo lugar.",
    tag: "Tienda",
    href: "/product",
    icon: <AccesoriosIcon />,
  },
];

const SCROLL_PER_CARD = 600; // px de scroll dedicado a cada card
const TOTAL_SCROLL    = SCROLL_PER_CARD * services.length;

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const stickyRef  = useRef(null);
  const titleRef   = useRef(null);
  const cardsRef   = useRef([]);
  const dotsRef    = useRef([]);
  const linesRef      = useRef([]);
  const indexRowsRef  = useRef([]);
  const manualIndexRef = useRef(null);

  const setActiveDot = (active) => {
    dotsRef.current.forEach((dot, i) => {
      if (!dot) return;
      dot.style.backgroundColor = i === active ? "#18181b" : "transparent";
      dot.style.transform = i === active ? "scale(1.5)" : "scale(1)";
    });
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      line.style.opacity   = i === active ? "1" : "0.2";
      line.style.transform = i === active ? "scaleX(1)" : "scaleX(0.3)";
    });
    indexRowsRef.current.forEach((row, i) => {
      if (!row) return;
      row.style.opacity = i === active ? "1" : "0.35";
      row.querySelector(".row-num").style.color    = i === active ? "#18181b" : "#d4d4d8";
      row.querySelector(".row-name").style.color   = i === active ? "#18181b" : "#71717a";
      row.querySelector(".row-arrow").style.opacity = i === active ? "1" : "0";
    });
  };


  useEffect(() => {
    const section = sectionRef.current;
    const sticky  = stickyRef.current;
    if (!section || !sticky) return;

    // ── Texto lateral ──
    const split = SplitText.create(titleRef.current, { type: "chars" });
    gsap.from(split.chars, {
      yPercent: 120,
      stagger: 0.035,
      ease: "power3.out",
      duration: 1,
      scrollTrigger: { trigger: section, start: "top 65%" },
    });



    // Inicializar todas las cards ocultas excepto la primera
cardsRef.current.forEach((card, i) => {
  if (!card) return;
  gsap.set(card, { yPercent: i === 0 ? 0 : 55, opacity: i === 0 ? 1 : 0 });
  card.style.pointerEvents = i === 0 ? "auto" : "none"; // ← agrega esto
});
    setActiveDot(0);

    // ── Una sola ScrollTrigger con scrub que controla todo ──
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${TOTAL_SCROLL}px`,
      pin: sticky,
      pinSpacing: false, // el section ya tiene la altura correcta
      scrub: 0.8,
      onUpdate(self) {
        const p = self.progress; // 0 → 1
        const cardProgress = p * services.length; // 0 → 3
        const activeIndex  = Math.min(Math.floor(cardProgress), services.length - 1);
        const localP       = cardProgress - Math.floor(cardProgress); // 0→1 dentro de cada card

        setActiveDot(activeIndex);

        cardsRef.current.forEach((card, i) => {
          if (!card) return;

          if (i < activeIndex) {
            // Ya pasó — fuera por arriba
            gsap.set(card, { yPercent: -45, opacity: 0 });
          } else if (i === activeIndex) {
            if (i === 0 && p < 1 / services.length) {
              // Primera card: ya está visible, sale en la segunda mitad de su turno
              const exitP = Math.max(0, (localP - 0.55) / 0.45);
              if (i < services.length - 1) {
                gsap.set(card, { yPercent: -45 * exitP, opacity: 1 - exitP });
              } else {
                gsap.set(card, { yPercent: 0, opacity: 1 });
              }
            } else {
              // Card activa: entra en primera mitad, sale en segunda
              const enterP = Math.min(1, localP / 0.45);
              const exitP  = i < services.length - 1
                ? Math.max(0, (localP - 0.55) / 0.45)
                : 0;
              gsap.set(card, {
                yPercent: 55 * (1 - enterP) - 45 * exitP,
                opacity:  enterP - exitP,
              });
            }
          } else {
            // Aún no llega — abajo esperando
            gsap.set(card, { yPercent: 55, opacity: 0 });
          }
          card.style.pointerEvents = parseFloat(card.style.opacity) < 0.1 ? "none" : "auto";
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      split.revert();
    };
  }, []);


  const handleSelectService = (index) => {
    manualIndexRef.current = index;
    setActiveDot(index);

    // Mostrar card seleccionada, ocultar las demás
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
if (i === index) {
  card.style.pointerEvents = "auto"; // ← agrega
  gsap.to(card, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power2.out" });
} else {
  card.style.pointerEvents = "none"; // ← agrega
  gsap.to(card, { yPercent: i < index ? -45 : 55, opacity: 0, duration: 0.35, ease: "power2.in" });
}
    });
  };

  return (
    <section
    id="services"
      ref={sectionRef}
      className="relative w-full bg-white"
      style={{ height: `calc(100vh + ${TOTAL_SCROLL}px)` }}
    >
      {/* Sticky viewport */}
      <div
        ref={stickyRef}
        className="h-screen flex items-center overflow-hidden"
        style={{ position: "sticky", top: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16 items-center">
        <div className="flex lg:hidden flex-col mb-1">
  <p className="text-xs font-bold tracking-[.4em] uppercase text-zinc-400 mb-2">
    Lo que hacemos
  </p>
  <h2 className="font-black uppercase tracking-tighter text-zinc-900 leading-none text-4xl">
    Nuestros<br />Servicios
  </h2>
</div>
                  <div className="hidden lg:flex flex-col items-start justify-center gap-4">
            <p className="text-xs font-bold tracking-[.4em] uppercase text-zinc-400">
              Lo que hacemos
            </p>
            <div style={{ overflow: "hidden" }}>
              <h2
                ref={titleRef}
                className="font-black uppercase tracking-tighter text-zinc-900 leading-[.9]"
                style={{ fontSize: "clamp(4rem, 8vw, 7.5rem)" }}
              >
                Nuestros<br />Servicios
              </h2>
            </div>
            <div className="w-16 h-px bg-zinc-300 mt-2" />
            <div className="flex flex-col gap-0 mt-2 w-full">
              {services.map((s, i) => (
                <div
                  key={i}
                  ref={(el) => (indexRowsRef.current[i] = el)}
                  onClick={() => handleSelectService(i)}
                  className="flex items-center gap-4 text-sm py-3 border-b border-zinc-100 cursor-pointer group transition-all duration-300"
                  style={{ opacity: i === 0 ? 1 : 0.35 }}
                >
                  <span className="row-num font-mono text-xs transition-colors duration-300" style={{ color: i === 0 ? "#18181b" : "#d4d4d8" }}>{s.num}</span>
                  <span className="row-name font-semibold flex-1 transition-colors duration-300" style={{ color: i === 0 ? "#18181b" : "#71717a" }}>{s.title}</span>
                  <span className="text-zinc-400 text-xs mr-2">{s.tag}</span>
                  <span className="row-arrow text-zinc-900 text-xs transition-opacity duration-300" style={{ opacity: i === 0 ? 1 : 0 }}>→</span>
                </div>
              ))}
            </div>
          </div>
                    {/* ── DERECHA: título ── */}
        <div className="relative" style={{ height: "420px" }}>
            {services.map((s, i) => (
              <div
                key={s.num}
                ref={(el) => (cardsRef.current[i] = el)}
                className="absolute inset-0 flex flex-col justify-between bg-zinc-50 border border-zinc-100 rounded-3xl p-8"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-zinc-400 border border-zinc-200 px-3 py-1 rounded-full">
                    {s.tag}
                  </span>

                  <span className="text-[5rem] font-bold leading-none text-zinc-100 select-none tabular-nums">
                    {s.num}
                  </span>

                </div>
                <div>
                                        <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight leading-tight">
                    {s.title}
                  </h3>
    {s.icon}  {/* ← agrega esto */}
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                    {s.desc}
                  </p>
                </div>
                <a
                  href={s.href}
                  className="self-start  flex items-center gap-2 text-sm font-semibold text-zinc-900 border border-zinc-300 px-5 py-2.5 rounded-full hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-200"
                >
                  Ver más <span>→</span>
                </a>
              </div>
            ))}

            {/* Indicadores */}
            <div className="absolute -bottom-10 right-0 flex items-center gap-4">
              {services.map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    ref={(el) => (dotsRef.current[i] = el)}
                    className="size-2.5 rounded-full border border-zinc-400 transition-all duration-300"
                    style={{ backgroundColor: i === 0 ? "#18181b" : "transparent", transform: i === 0 ? "scale(1.5)" : "scale(1)" }}
                  />
                  <span
                    ref={(el) => (linesRef.current[i] = el)}
                    className="h-px w-8 bg-zinc-900 origin-left transition-all duration-300"
                    style={{ opacity: i === 0 ? 1 : 0.2, transform: i === 0 ? "scaleX(1)" : "scaleX(0.3)" }}
                  />
                </div>
              ))}
            </div>
          </div>


          {/* ── IZQUIERDA: cards apiladas ── */}




        </div>
      </div>
    </section>
  );
};

export default ServicesSection;