import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wrench, Battery, Droplets, Shield, ChevronRight, Smartphone } from "lucide-react";
import PhoneRepairSVG from "../assets/animated/Phonerepairsvg";

const SERVICIOS = [
  {
    icon: Smartphone,
    titulo: "Cambio de Pantalla",
    desc: "Pantallas originales Apple. Garantía de 6 meses en partes y mano de obra.",
    tiempo: "1–2 horas",
    desde: "$180.000",
  },
  {
    icon: Battery,
    titulo: "Cambio de Batería",
    desc: "Batería certificada. Recupera el 100% de rendimiento de tu iPhone.",
    tiempo: "45 min",
    desde: "$120.000",
  },
  {
    icon: Droplets,
    titulo: "Daño por Agua",
    desc: "Limpieza ultrasónica y diagnóstico completo. Recuperamos tu equipo.",
    tiempo: "24–48 horas",
    desde: "$90.000",
  },
  {
    icon: Shield,
    titulo: "Diagnóstico Gratis",
    desc: "Revisamos tu iPhone sin costo. Solo pagas si decides reparar.",
    tiempo: "20 min",
    desde: "Gratis",
  },
];

// PhoneAnimation moved to PhoneRepairSVG.jsx
const PhoneAnimation = () => (
  <div className="relative w-64 h-64 mx-auto">
    <PhoneRepairSVG />
  </div>
);

const ServicioTecnico = () => {
  const sectionRef  = useRef(null);
  const titleRef    = useRef(null);
  const cardsRef    = useRef([]);
  const [activeIdx, setActiveIdx] = useState(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(titleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: titleRef.current, start: "top 80%", once: true }
      }
    );

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: i * 0.1,
          scrollTrigger: { trigger: card, start: "top 85%", once: true }
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={titleRef} className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-3">Servicio Técnico</p>
            <h2 className="text-zinc-900 leading-none mb-6"
              style={{ fontFamily: "Impact, sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "-0.02em", fontStyle: "italic" }}>
              REPARAMOS<br />TU iPHONE
            </h2>
            <p className="text-zinc-500 text-lg leading-relaxed mb-8 max-w-md">
              Técnicos certificados Apple. Repuestos originales. Garantía escrita en cada reparación.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"/>
                Diagnóstico gratuito
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"/>
                Garantía 6 meses
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"/>
                Mismo día
              </div>
            </div>
          </div>

          {/* Ilustración animada */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-zinc-100" style={{ transform: "scale(1.2)" }}/>
              <PhoneAnimation />
              {/* Tools flotando */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg rotate-12">
                <Wrench size={22} className="text-white"/>
              </div>
              <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg -rotate-6">
                <Shield size={18} className="text-white"/>
              </div>
            </div>
          </div>
        </div>

        {/* Cards servicios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICIOS.map((s, i) => {
            const Icon = s.icon;
            const isActive = activeIdx === i;
            return (
              <div
                key={s.titulo}
                ref={(el) => (cardsRef.current[i] = el)}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-300 opacity-0 ${
                  isActive ? "bg-zinc-900 text-white shadow-2xl scale-[1.02]" : "bg-zinc-50 text-zinc-900"
                }`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  isActive ? "bg-white/10" : "bg-zinc-200"
                }`}>
                  <Icon size={20} className={isActive ? "text-white" : "text-zinc-700"}/>
                </div>

                <p className="font-thin text-lg mb-2 leading-tight font-" style={{ fontFamily: "Impact, sans-serif", letterSpacing: "-0.01em" }}>
                  {s.titulo}
                </p>
                <p className={`text-sm leading-relaxed mb-5 transition-colors ${isActive ? "text-zinc-400" : "text-zinc-500"}`}>
                  {s.desc}
                </p>

                <div className="flex items-end justify-between">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${isActive ? "text-zinc-500" : "text-zinc-400"}`}>
                      Desde
                    </p>
                    <p className={`text-xl font-black ${isActive ? "text-white" : "text-zinc-900"}`}
                      style={{ fontFamily: "Impact, sans-serif" }}>
                      {s.desde}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${isActive ? "text-zinc-400" : "text-zinc-400"}`}>
                    <span>{s.tiempo}</span>
                    <ChevronRight size={12}/>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute top-5 right-5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a href="#contacto"
            className="inline-flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-zinc-700 transition-all">
            Agendar reparación
            <ChevronRight size={16}/>
          </a>
          <p className="text-xs text-zinc-400 mt-3">Sin cita previa · Lunes a Sábado 9am–7pm</p>
        </div>

      </div>
    </section>
  );
};

export default ServicioTecnico;