import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ChevronLeft, ChevronRight, ArrowUp, ArrowDown} from "lucide-react";
import { testimonialsData } from "../assets/data";

const transforms = [
  { y: [10, 50, -10, 10],  r: [20, -10, -45, 20] },
  { y: [0, 47.5, -10, 15], r: [-25, 15, -45, 30] },
  { y: [0, 52.5, -10, 5],  r: [15, -5, -40, 60]  },
  { y: [0, 50, 30, -80],   r: [20, -10, 60, 5]   },
  { y: [0, 55, -15, 30],   r: [25, -15, 60, 95]  },
];

const PER_PAGE = 5;

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5 mb-3">
    {Array.from({ length: 5 }).map((_, s) => (
      <Star key={s} size={14}
        className={s < rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 fill-zinc-200"} />
    ))}
  </div>
);
const isMobile = window.innerWidth < 768;

const Testimonials = () => {
  const sectionRef  = useRef(null);
  const headerRef   = useRef(null);
  const cardsRef    = useRef([]);
  const stRef       = useRef(null);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(testimonialsData.length / PER_PAGE);
  const currentGroup = testimonialsData.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  // Posiciona cada card según el transforms
  const positionCard = useCallback((card, i, progress) => {
    const delay = i * (isMobile ? 0.10 : 0.1125);
    const cardProgress = Math.max(0, Math.min(progress - delay * 2, 1));

    if (cardProgress > 0) {
      const cardX     = gsap.utils.interpolate(25, -750, cardProgress);
      const yPos      = transforms[i].y;
      const rots      = transforms[i].r;
      const yProgress = cardProgress * 3;
      const yIndex    = Math.min(Math.floor(yProgress), yPos.length - 2);
      const yInterp   = yProgress - yIndex;
      const cardY     = gsap.utils.interpolate(yPos[yIndex], yPos[yIndex + 1], yInterp);
      const rot       = gsap.utils.interpolate(rots[yIndex], rots[yIndex + 1], yInterp);
      gsap.set(card, { xPercent: cardX, yPercent: cardY, rotation: rot, opacity: 1 });
    } else {
      gsap.set(card, { opacity: 0 });
    }
  }, []);
  

  // Monta ScrollTrigger para la página actual
  useEffect(() => {

    const section      = sectionRef.current;
    const header       = headerRef.current;
    const stickyHeight = window.innerHeight * (isMobile ? 4.5 : 6); // era 6

    // Reset cards a posición inicial
    cardsRef.current.forEach((card) => {
      if (card) gsap.set(card, { xPercent: 25, yPercent: 0, rotation: 0, opacity: 0 });
    });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${stickyHeight}px`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const maxTranslate = header.offsetWidth - window.innerWidth;
        gsap.set(header, { x: -progress * maxTranslate });
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          positionCard(card, i, progress);
        });
      },
    });

    stRef.current = st;
    return () => st.kill();
  }, [page]); // re-crea cuando cambia la página

  // Animación de cambio de página — cards salen y entran como flying cards
  const changePage = (dir) => {
    const next = page + dir;
    if (next < 0 || next >= totalPages) return;

    const cards = cardsRef.current.filter(Boolean);

    // Salen volando en la dirección opuesta
    gsap.to(cards, {
      xPercent: dir > 0 ? -200 : 200,
      yPercent: (i) => transforms[i]?.y[2] ?? 0,
      rotation: (i) => transforms[i]?.r[2] ?? 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: "power2.in",
      onComplete: () => {
        setPage(next);
        // Entran desde el lado contrario
        gsap.fromTo(cards,
          { xPercent: dir > 0 ? 200 : -200, opacity: 0, yPercent: 0, rotation: 0 },
          {
            xPercent: 0,
            yPercent: (i) => transforms[i]?.y[0] ?? 0,
            rotation: (i) => transforms[i]?.r[0] ?? 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
          }
        );
      },
    });
  };



  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-zinc-50"
      style={{ height: "100vh" }}
    >
      {/* Título horizontal */}
      <div ref={headerRef} className="absolute top-0 left-0 h-full flex items-center"
        style={{ width: "250vw", willChange: "transform" }}>
        <h2 className="impact text-zinc-900 whitespace-nowrap"
          style={{ fontSize: "22vw", lineHeight: 1, letterSpacing: "0.05em", fontWeight: 300 }}>
          Reseñas de clientes
        </h2>
      </div>
      {/* Flecha hacia arriba en la esquina izquierda */}
      <div className="absolute bottom-16 left-4 flex flex-col items-center gap-1 z-50">
        <span className="text-zinc-400 text-sm uppercase animate-pulse">Sube</span>
        <ArrowUp className="w-8 h-8 text-zinc-400 animate-bounce" />
      </div>

      {/* Flecha hacia abajo en la esquina derecha */}
      <div className="absolute bottom-16 right-4 flex flex-col items-center gap-1 z-50">
        <span className="text-zinc-400 text-sm uppercase animate-pulse">Baja</span>
        <ArrowDown className="w-8 h-8 text-zinc-400 animate-bounce" />
      </div>


      {/* Cards del grupo actual */}
      {currentGroup.map((t, i) => (
        <div key={`${page}-${t.id}`}
          ref={(el) => (cardsRef.current[i] = el)}
          className="absolute rounded-3xl overflow-hidden"
          style={{ top: "10%", left: "100%", width: 320, background: "#fff",
            border: "1px solid #f4f4f5", boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            willChange: "transform", opacity: 0, zIndex: 2, padding: "1.5rem" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #18181b, #52525b)" }}>
              {t.avatar}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-zinc-900 text-sm leading-tight">{t.name}</p>
              <p className="text-zinc-400 text-xs truncate">{t.location}</p>
            </div>
            {t.verified && (
              <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
                ✓ Verificado
              </span>
            )}
          </div>
          <StarRow rating={t.rating} />
          <p className="font-bold text-zinc-900 text-base mb-2 leading-tight">{t.title}</p>
          <p className="text-zinc-500 text-sm leading-relaxed mb-4">{t.comment}</p>
          <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
            <span className="text-[11px] text-zinc-400 uppercase tracking-widest">{t.product}</span>
            <span className="text-[11px] text-zinc-400">{t.date}</span>
          </div>
        </div>
      ))}

      {/* Controles de paginación — esquina inferior */}
      {totalPages > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
          <button onClick={() => changePage(-1)} disabled={page === 0}
            className="p-2.5 rounded-full bg-white border border-zinc-200 shadow-sm hover:bg-zinc-900 hover:text-white hover:border-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <ChevronLeft size={16} />
          </button>

          <div className="flex gap-2 items-center">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => changePage(i - page)}
                className={`rounded-full transition-all duration-300 ${
                  i === page ? "bg-zinc-900 w-6 h-2" : "bg-zinc-300 w-2 h-2"
                }`} />
            ))}
          </div>

          <button onClick={() => changePage(1)} disabled={page >= totalPages - 1}
            className="p-2.5 rounded-full bg-white border border-zinc-200 shadow-sm hover:bg-zinc-900 hover:text-white hover:border-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
};

export default Testimonials;