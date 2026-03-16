import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "swiper/css";

const PLUS_CURSOR  = `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9Ii0xIC0xIDQyIDQyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcng9IjIwIiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTEyLjUgMjBoMTVNMjAgMTIuNXYxNSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEuNSIvPjwvc3ZnPg==") 20 20, zoom-in`;
const MINUS_CURSOR = `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9Ii0xIC0xIDQyIDQyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcng9IjIwIiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTEyLjUgMjBoMTUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48L3N2Zz4=") 20 20, zoom-out`;
const GRAB_CURSOR   = "grab";
const GRABBING_CURSOR = "grabbing";

// ── LIGHTBOX via portal ───────────────────────────────────
const Lightbox = ({ images, current, setCurrent, total, onClose, visible }) => {
  const [slideAnim, setSlideAnim]       = useState(null);
  const [displayIndex, setDisplayIndex] = useState(current);

  // Todo el estado de zoom/pan en refs — NUNCA setState durante movimiento
  const imgElRef    = useRef(null);
  const zoomedRef   = useRef(false);
  const posRef      = useRef({ x: 0, y: 0 });
  const dragRef     = useRef(null); // null | { startX, startY, startPosX, startPosY, moved }
  const overlayRef  = useRef(null);
  const [, tick]    = useState(0); // solo para forzar re-render en toggle zoom

  const setTransform = (x, y, scale, animated = false) => {
    if (!imgElRef.current) return;
    imgElRef.current.style.transition = animated
      ? "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)"
      : "none";
    imgElRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  };

  const goTo = (dir) => {
    if (zoomedRef.current) return;
    const next = dir === "next" ? displayIndex + 1 : displayIndex - 1;
    if (next < 0 || next >= total) return;
    setSlideAnim(dir === "next" ? "out-left" : "out-right");
    setTimeout(() => {
      setDisplayIndex(next);
      setCurrent(next);
      setSlideAnim(dir === "next" ? "in-right" : "in-left");
      setTimeout(() => setSlideAnim(null), 300);
    }, 200);
  };

  // Toggle zoom — directo al DOM
  const handleImgClick = (e) => {
    e.stopPropagation();
    if (dragRef.current?.moved) return;
    if (!zoomedRef.current) {
      zoomedRef.current = true;
      posRef.current = { x: 0, y: 0 };
      setTransform(0, 0, 2, true);
    } else {
      zoomedRef.current = false;
      posRef.current = { x: 0, y: 0 };
      setTransform(0, 0, 1, true);
    }
    tick(n => n + 1); // re-render para cursor y controles
  };

  // mousedown en overlay
  const handleMouseDown = (e) => {
    if (!zoomedRef.current) return;
    e.preventDefault();
    dragRef.current = {
      startX:    e.clientX,
      startY:    e.clientY,
      startPosX: posRef.current.x,
      startPosY: posRef.current.y,
      moved:     false,
    };
    // cursor grabbing inmediato
    if (overlayRef.current) overlayRef.current.style.cursor = GRABBING_CURSOR;
    if (imgElRef.current)   imgElRef.current.style.cursor   = GRABBING_CURSOR;
  };

  // mousemove — sin setState, puro DOM
  const handleMouseMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragRef.current.moved = true;
    const newX = dragRef.current.startPosX + dx;
    const newY = dragRef.current.startPosY + dy;
    posRef.current = { x: newX, y: newY };
    setTransform(newX, newY, 2, false); // sin animación durante drag
  };

  const handleMouseUp = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    if (overlayRef.current) overlayRef.current.style.cursor = zoomedRef.current ? GRAB_CURSOR : "default";
    if (imgElRef.current)   imgElRef.current.style.cursor   = zoomedRef.current ? MINUS_CURSOR : PLUS_CURSOR;
  };

  // Reset al cambiar imagen
  useEffect(() => {
    setDisplayIndex(current);
    zoomedRef.current = false;
    posRef.current = { x: 0, y: 0 };
    if (imgElRef.current) {
      imgElRef.current.style.transition = "none";
      imgElRef.current.style.transform  = "translate(0px,0px) scale(1)";
    }
    tick(n => n + 1);
  }, [current]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  goTo("prev");
      if (e.key === "ArrowRight") goTo("next");
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [displayIndex, total]);

  const slideTransform = () => {
    if (slideAnim === "out-left")  return "translateX(-60px)";
    if (slideAnim === "out-right") return "translateX(60px)";
    if (slideAnim === "in-right")  return "translateX(60px)";
    if (slideAnim === "in-left")   return "translateX(-60px)";
    return `translate(${posRef.current.x}px, ${posRef.current.y}px) scale(${zoomedRef.current ? 2 : 1})`;
  };

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: visible ? "#f0efed" : "rgba(240,239,237,0)",
        transition: "background-color 0.35s ease",
        cursor: zoomedRef.current ? GRAB_CURSOR : "default",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => e.stopPropagation()}
    >
      {/* X — único cierre */}
      <button
        className="absolute top-5 right-5 size-10 rounded-full border border-zinc-300 bg-white flex items-center justify-center hover:bg-zinc-100 transition-colors z-20"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.35s ease" }}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        <X size={15} className="text-zinc-800" />
      </button>

      {/* Imagen */}
      <div
        className="flex items-center justify-center w-full h-full"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.35s ease", pointerEvents: "none" }}
      >
        <img
          ref={imgElRef}
          src={images[displayIndex]}
          alt=""
          draggable={false}
          onClick={handleImgClick}
          style={{
            maxHeight: "85vh",
            height: "100%",
            width: "auto",
            maxWidth: "100%",
            objectFit: "contain",
            userSelect: "none",
            pointerEvents: "auto",
            transformOrigin: "center center",
            cursor: zoomedRef.current ? MINUS_CURSOR : PLUS_CURSOR,
            transform: slideTransform(),
            opacity: slideAnim ? 0 : 1,
            transition: slideAnim
              ? "transform 0.2s ease, opacity 0.2s ease"
              : "opacity 0.2s ease",
          }}
        />
      </div>

      {/* Controles — ocultos con zoom */}
      {!zoomedRef.current && (
        <div
          className="absolute bottom-6 left-8 flex items-center gap-2 z-20"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.35s ease" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => goTo("prev")} disabled={displayIndex === 0}
            className="size-10 rounded-full border border-zinc-300 bg-white flex items-center justify-center hover:bg-zinc-100 disabled:opacity-30 transition-colors">
            <ChevronLeft size={16} className="text-zinc-800" />
          </button>
          <button onClick={() => goTo("next")} disabled={displayIndex === total - 1}
            className="size-10 rounded-full border border-zinc-300 bg-white flex items-center justify-center hover:bg-zinc-100 disabled:opacity-30 transition-colors">
            <ChevronRight size={16} className="text-zinc-800" />
          </button>
          <span className="text-zinc-500 text-xs tracking-widest ml-1">{displayIndex + 1} / {total}</span>
        </div>
      )}
    </div>,
    document.body
  );
};

// ── GALLERY ───────────────────────────────────────────────
const Gallery = ({ images, bg }) => {
  const [current, setCurrent]               = useState(0);
  const [lightbox, setLightbox]             = useState(false);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [swiperRef, setSwiperRef]           = useState(null);
  const [isDragging, setIsDragging]         = useState(false);
  const total = images?.length || 0;

  const prev = useCallback(() => swiperRef?.slidePrev(), [swiperRef]);
  const next = useCallback(() => swiperRef?.slideNext(), [swiperRef]);

  const scrollPosRef = { current: 0 };

  const openLightbox = () => {
    // Guardar posición actual
    scrollPosRef.current = window.scrollY || window.pageYOffset;
    setLightbox(true);
    // Fijar el body en su posición actual
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    if (window.__smoother) window.__smoother.paused(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setLightboxVisible(true))
    );
  };

  const closeLightbox = () => {
    setLightboxVisible(false);
    setTimeout(() => {
      setLightbox(false);
      // Restaurar body
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      // Restaurar posición de scroll
      window.scrollTo(0, scrollPosRef.current);
      if (window.__smoother) window.__smoother.paused(false);
    }, 350);
  };

  if (!total) return null;

  return (
    <>
      <div className="w-full lg:sticky lg:top-0">
        <Swiper
          onSwiper={setSwiperRef}
          modules={[FreeMode]}
          slidesPerView={1.08}
          spaceBetween={4}
          freeMode={true}
          grabCursor={true}
          onSlideChange={(swiper) => setCurrent(swiper.activeIndex)}
          onTouchStart={() => setIsDragging(false)}
          onTouchMove={() => setIsDragging(true)}
          style={{ paddingLeft: "8px" }}
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="rounded-2xl overflow-hidden relative w-full"
                style={{ backgroundColor: bg, cursor: PLUS_CURSOR, aspectRatio: "3/4", maxHeight: "calc(100svh - 140px)" }}
                onClick={() => { if (!isDragging) openLightbox(); }}
              >
                <img
                  src={img}
                  alt=""
                  draggable={false}
                   className="w-full h-full object-contain pointer-events-none"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Controles */}
        <div className="flex items-center justify-between mt-3 px-4">
          <div className="flex items-center gap-2">
            <button onClick={prev} disabled={current === 0}
              className="size-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 disabled:opacity-30 transition-all">
              <ChevronLeft size={14} className="text-zinc-800" />
            </button>
            <button onClick={next} disabled={current === total - 1}
              className="size-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 disabled:opacity-30 transition-all">
              <ChevronRight size={14} className="text-zinc-800" />
            </button>
            <span className="text-xs text-zinc-400">{current + 1} / {total}</span>
          </div>
          <div className="flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => swiperRef?.slideTo(i)}
                className={`h-1 rounded-full transition-all duration-300 ${i === current ? "w-5 bg-zinc-900" : "w-1.5 bg-zinc-300"}`} />
            ))}
          </div>
        </div>
      </div>

      {lightbox && (
        <Lightbox
          images={images}
          current={current}
          setCurrent={setCurrent}
          total={total}
          onClose={closeLightbox}
          visible={lightboxVisible}
        />
      )}
    </>
  );
};

export default Gallery;