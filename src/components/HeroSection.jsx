import { ArrowDown, Mail, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { carruselData } from "../assets/data";

const HeroSection = () => {
  const shopButtonRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const btn = shopButtonRef.current;
    const container = containerRef.current;
    if (!btn || !container) return;

    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    const maxOffset = 50;

    const getRect = () => container.getBoundingClientRect();

    function onMouseMove(e) {
      const rect = getRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      const nx = relX / (rect.width / 2);
      const ny = relY / (rect.height / 2);
      targetX = Math.max(-1, Math.min(1, nx)) * maxOffset;
      targetY = Math.max(-1, Math.min(1, ny)) * maxOffset;
      if (!rafId) rafId = requestAnimationFrame(animate);
    }

    function onMouseEnter(e) {
      onMouseMove(e);
    }

    function onMouseLeave() {
      targetX = 0;
      targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(animate);
    }

    function animate() {
      const style = btn.style;
      const cur = btn.__pos || { x: 0, y: 0 };

      cur.x += (targetX - cur.x) * 0.08;
      cur.y += (targetY - cur.y) * 0.08;

      style.transform = `translate(${cur.x}px, ${cur.y}px)`;
      btn.__pos = cur;

      const diff = Math.abs(targetX - cur.x) + Math.abs(targetY - cur.y);

      if (diff > 0.3) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
        if (targetX === 0 && targetY === 0) {
          style.transform = "";
          btn.__pos = { x: 0, y: 0 };
        }
      }
    }

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="bg-white py-12 min-h-[calc(100vh-120px)]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── COLUMNA IZQUIERDA ── */}
        <div className="flex flex-col space-y-4">

          {/* Tarjeta titular */}
          <div className="bg-zinc-900 h-[480px] flex flex-col justify-between p-8 rounded-3xl shadow-sm">
            <h2 className="text-6xl uppercase impact text-white leading-none">
              EL{" "}
              <img
                src="/svg/arrow.svg"
                alt=""
                className="inline-block w-40 ml-5"
              />{" "}
              <br />
              TELÉFONO <br /> QUE <br /> MERECES
            </h2>

            <p className="text-zinc-400 max-w-xs">
              Dispositivos insignia y accesorios curados, probados por entusiastas.
              Sin relleno — solo tecnología que vale la pena llevar.
            </p>
          </div>

          {/* Dos tarjetas pequeñas */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tarjeta 1 — flagship */}
            <div className="relative h-[230px] bg-zinc-800 rounded-3xl flex items-end p-3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80"
                alt="Teléfono insignia"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
              <span className="relative z-10 bg-zinc-900/70 backdrop-blur-sm text-white text-xs font-semibold tracking-widest uppercase px-2 py-1 rounded-full">
                #INSIGNIA
              </span>
            </div>

            {/* Tarjeta 2 — accesorios */}
            <div className="relative h-[230px] bg-zinc-700 rounded-3xl flex items-end p-3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80"
                alt="Accesorios inalámbricos"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
              <span className="relative z-10 bg-zinc-900/70 backdrop-blur-sm text-white text-xs font-semibold tracking-widest uppercase px-2 py-1 rounded-full">
                #INALÁMBRICO
              </span>
            </div>
          </div>
        </div>

        {/* ── COLUMNA DERECHA — carrusel con overlay ── */}
        <div
          ref={containerRef}
          className="relative hidden lg:flex bg-zinc-200 rounded-3xl overflow-hidden min-h-[740px]"
        >
          {/* Carrusel ocupa todo el espacio del div */}
          <Swiper
            modules={[Autoplay]}
            autoplay={{  delay: 5000, disableOnInteraction: false }}
            loop={true}
            speed={5000}
            slidesPerView={1}
            allowTouchMove={false}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            {carruselData.map((product, index) => (
              <SwiperSlide key={index} style={{ height: "100%" }}>
                <img
                  src={product.img}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Badge superior izquierdo */}
          <div className="absolute top-5 left-5 z-10 bg-zinc-900/80 backdrop-blur-sm text-white text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full flex items-center gap-2">
            <Zap size={12} className="text-yellow-400" />
            NUEVA TEMPORADA
          </div>

          {/* Botón magnético — CTA de compra */}
          <button
            ref={shopButtonRef}
            onClick={() => window.location.href = "/productos"}
            className="absolute bottom-80 right-45 z-10 size-20 flex flex-col justify-center items-center bg-zinc-800/80 backdrop-blur-md text-zinc-500 uppercase rounded-full border border-zinc-100 cursor-pointer hover:bg-white hover:text-zinc-900 transition-colors duration-300 leading-tight"
            style={{ willChange: "transform" }}
            aria-label="Ver todos los productos"
          >
            <span>VER</span>
            <span>TODO</span>
          </button>

          {/* Botones inferiores */}
          <div className="absolute bottom-4 right-4 z-10 flex space-x-3">
            <button className="group bg-white/90 backdrop-blur-sm cursor-pointer flex items-center gap-3 text-zinc-900 text-xs uppercase pl-4 pr-2 py-1.5 rounded-full hover:bg-zinc-900 hover:text-zinc-50 transition-all duration-200 font-semibold">
              Ver más
              <span className="size-8 bg-zinc-800 group-hover:bg-zinc-100 rounded-full flex items-center justify-center">
                <ArrowDown size={14} className="text-zinc-50 group-hover:text-zinc-800" />
              </span>
            </button>

            <a  href="/contact" className="border border-zinc-50/60 group backdrop-blur-sm cursor-pointer flex items-center gap-3 text-zinc-50 text-xs uppercase pl-4 pr-2 py-1.5 rounded-full hover:bg-zinc-900 transition-all duration-200 font-semibold">
              Contáctanos
              <span className="size-8 bg-zinc-50 rounded-full flex items-center justify-center">
                <Mail size={14} className="text-zinc-800" />
              </span>
            </a>
          </div>
        </div>

        {/* CTA móvil */}
        <div className="w-full lg:hidden bg-zinc-900 text-white uppercase p-4 flex items-center justify-center rounded-full font-bold tracking-widest text-sm">
          VER TODO
        </div>

      </div>
    </div>
  );
};

export default HeroSection;