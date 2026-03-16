import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../src/App.css";
gsap.registerPlugin(ScrollTrigger);

export default function ContactoHero() {
  const containerRef       = useRef(null);
  const heroImgRef         = useRef(null);
  const heroImgElementRef  = useRef(null);
  const heroMaskRef        = useRef(null);
  const heroGridOverlayRef = useRef(null);
  const marker1Ref         = useRef(null);
  const marker2Ref         = useRef(null);
  const marker3Ref         = useRef(null);
  const heroContentRef     = useRef(null);
  const progressBarRef     = useRef(null);
useEffect(() => {
  const heroContent     = heroContentRef.current;
  const heroImg         = heroImgRef.current;
  const heroImgElement  = heroImgElementRef.current;
  const heroMask        = heroMaskRef.current;
  const heroGridOverlay = heroGridOverlayRef.current;
  const marker1         = marker1Ref.current;
  const marker2         = marker2Ref.current;
  const marker3         = marker3Ref.current;
  const progressBar     = progressBarRef.current;

  const heroContentHeight       = heroContent.offsetHeight;
  const viewportHeight          = window.innerHeight;
  const heroContentMoveDistance = heroContentHeight - viewportHeight;

  const heroImgHeight       = heroImg.offsetHeight;
  const heroImgMoveDistance = heroImgHeight - viewportHeight;

  const ease = (x) => x * x * (3 - 2 * x);

  // Función para actualizar todos los valores según el progreso p
  function updateProgress(p) {
    progressBar.style.setProperty("--progress", p);
    gsap.set(heroContent, { y: -p * heroContentMoveDistance });

    let imgP;
    if      (p <= 0.45) imgP = ease(p / 0.45) * 0.65;
    else if (p <= 0.75) imgP = 0.65;
    else                imgP = 0.65 + ease((p - 0.75) / 0.25) * 0.35;
    gsap.set(heroImg, { y: imgP * heroImgMoveDistance });

    let maskScale, saturation, overlayOpacity;
    if      (p <= 0.4)  { maskScale = 2.5; saturation = 1; overlayOpacity = 0.35; }
    else if (p <= 0.5)  { const pp = ease((p - 0.4) / 0.1);  maskScale = 2.5 - pp * 1.5; saturation = 1 - pp;  overlayOpacity = 0.35 + pp * 0.35; }
    else if (p <= 0.75) { maskScale = 1;   saturation = 0; overlayOpacity = 0.7; }
    else if (p <= 0.85) { const pp = ease((p - 0.75) / 0.1); maskScale = 1 + pp * 1.5;   saturation = pp;       overlayOpacity = 0.7 - pp * 0.35; }
    else                { maskScale = 2.5; saturation = 1; overlayOpacity = 0.35; }

    gsap.set(heroMask,       { scale: maskScale });
    gsap.set(heroImgElement, { filter: `saturate(${saturation})` });
    heroImg.style.setProperty("--overlay-opacity", overlayOpacity);

    let gridOp;
    if      (p <= 0.475) gridOp = 0;
    else if (p <= 0.5)   gridOp = ease((p - 0.475) / 0.025);
    else if (p <= 0.75)  gridOp = 1;
    else if (p <= 0.775) gridOp = 1 - ease((p - 0.75) / 0.025);
    else                 gridOp = 0;
    gsap.set(heroGridOverlay, { opacity: gridOp });

    let m1;
    if      (p <= 0.5)   m1 = 0;
    else if (p <= 0.525) m1 = ease((p - 0.5) / 0.025);
    else if (p <= 0.7)   m1 = 1;
    else if (p <= 0.75)  m1 = 1 - ease((p - 0.7) / 0.05);
    else                 m1 = 0;
    gsap.set(marker1, { opacity: m1 });

    let m2;
    if      (p <= 0.55)  m2 = 0;
    else if (p <= 0.575) m2 = ease((p - 0.55) / 0.025);
    else if (p <= 0.7)   m2 = 1;
    else if (p <= 0.75)  m2 = 1 - ease((p - 0.7) / 0.05);
    else                 m2 = 0;
    gsap.set(marker2, { opacity: m2 });

    let m3;
    if      (p <= 0.575) m3 = 0;
    else if (p <= 0.6)   m3 = ease((p - 0.575) / 0.025);
    else if (p <= 0.7)   m3 = 1;
    else if (p <= 0.75)  m3 = 1 - ease((p - 0.7) / 0.05);
    else                 m3 = 0;
    gsap.set(marker3, { opacity: m3 });
  }

  // Set inicial para que al cargar esté en estado correcto
  updateProgress(0);

  const st = ScrollTrigger.create({
    trigger: ".contacto-hero-section",
    start: "top top",
    end: `+=${window.innerHeight * 4}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => updateProgress(self.progress),
  });

  return () => st.kill();
}, []);

  return (
    <>
      <section className="contacto-hero-section" ref={containerRef}>

        <div className="hero-img" ref={heroImgRef}>
          <img src="/images/hero-img.png" alt="Barranquilla" ref={heroImgElementRef} />
        </div>

        <div className="hero-mask" ref={heroMaskRef} />

        <div className="hero-grid-overlay" ref={heroGridOverlayRef}>
          <img src="/images/grid-overlay.svg" alt="" />
        </div>


        <div className="marker marker-2" ref={marker2Ref}>
          <span className="marker-icon" />
          <p className="marker-label">Sucursal El Prado</p>
        </div>


        <div className="hero-content" ref={heroContentRef}>

          <div className="content-block">
            <div className="content-copy">
              <span className="content-eyebrow">Barranquilla, Colombia</span>
              <h2>Estamos aquí para ayudarte</h2>
              <p>Atención personalizada para todo lo que necesites sobre tu iPhone o tu pedido.</p>
            </div>
          </div>
          <div className="content-block">
            <div className="content-copy">
              <span className="content-eyebrow">Atención al cliente</span>
              <h2>WhatsApp</h2>
              <p>Respuesta en menos de 1 hora. Cotizaciones, disponibilidad y seguimiento de pedidos.</p>
              <a className="content-cta" href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp →
              </a>
            </div>
          </div>
          <div className="content-block">
            <div className="content-copy">
              <span className="content-eyebrow">Visítanos</span>
              <h2>Nuestro local</h2>
              <p>Calle 35 #43-50, Centro Histórico, Barranquilla. Lun–Sáb 9am–7pm · Dom 10am–3pm.</p>
              <a className="content-cta" href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                Ver en Google Maps →
              </a>
            </div>
          </div>



          <div className="content-block">
            <div className="content-copy">
              <span className="content-eyebrow">Soporte & Postventa</span>
              <h2>Correo electrónico</h2>
              <p>Para garantías, devoluciones o soporte técnico. Respondemos en máximo 24 horas hábiles.</p>
              <a className="content-cta" href="mailto:soporte@mobileshop.co">
                soporte@mobileshop.co →
              </a>
            </div>
          </div>

        </div>

        <div className="progress-bar" ref={progressBarRef} />

      </section>
    </>
  );
}