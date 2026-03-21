import { useEffect, useRef,useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { getStoreSettings } from "../lib/api";
const LoaderHome = ({ onComplete }) => {
  const overlayRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
const [storeName, setStoreName] = useState(["Mobile", "Shop"]);

useEffect(() => {
  getStoreSettings()
    .then(data => {
      if (data?.storeName) {
        const words = data.storeName.trim().split(" ");
        if (words.length >= 2) {
          setStoreName([words.slice(0, -1).join(" "), words[words.length - 1]]);
        } else {
          setStoreName([data.storeName, ""]);
        }
      }

      if (data?.logoUrl) {
        setLogoUrl(data.logoUrl);
      }
    })
    .catch(() => {});
}, []);
  useEffect(() => {
    const overlay = overlayRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    if (!overlay || !line1 || !line2) return;

    // 🔒 BLOQUEAR SCROLL
    window.scrollTo(0, 0);
    window.__smoother?.scrollTo?.(0, false);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    gsap.set([line1, line2], { backgroundPosition: "0% 100%" });

    const tl = gsap.timeline({
      onComplete: () => {
        // 🔓 DESBLOQUEAR SCROLL
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";

        if (window.__smoother) {
          window.__smoother.paused(false);
          window.__smoother.refresh();
        }

        onComplete?.();
      },
    });

    tl.to(line1, { backgroundPosition: "0% 0%", duration: 1, ease: "none", delay: 0.5 });
    tl.to(line2, { backgroundPosition: "0% 0%", duration: 1, ease: "none" }, "-=0.5");
    tl.to(overlay, { opacity: 0, duration: 0.5, delay: 0.8, ease: "power2.inOut" });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.__smoother?.paused(false);
    };
  }, []);

  const textStyle = {
    textAlign: "center",
    textTransform: "uppercase",
    width: "100%",
    fontFamily: "impact01, Impact, 'Arial Black', sans-serif",
    fontSize: "clamp(3rem, 12vw, 8rem)",
    fontStyle: "italic",
    lineHeight: 1,
    color: "transparent",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    backgroundImage: "linear-gradient(0deg, #3a3a3a 50%, #fff 0)",
    backgroundSize: "100% 200%",
    backgroundPosition: "0% 100%",
  };

  return createPortal(
<div
  ref={overlayRef}
  style={{
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100dvh", // 🔹 cubre toda la pantalla en Android / Safari
    padding: "2em",
    backgroundColor: "#000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    overflow: "hidden",
  }}
>
      <h1 ref={line1Ref} style={textStyle}>
        {storeName[0]}
        </h1>
      <h1 ref={line2Ref} style={textStyle}>
        {storeName[1]}
      </h1>
    </div>,
    document.body
  );
};

export default LoaderHome;