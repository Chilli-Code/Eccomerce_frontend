import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import gsap from "gsap";

const AuthDrawer = ({ open, onClose }) => {
  const drawerRef = useRef(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!drawerRef.current) return;
    gsap.to(drawerRef.current, {
      x: open ? "0%" : "100%",
      duration: open ? 0.45 : 0.35,
      ease: open ? "power3.out" : "power3.in",
    });
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/30 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full z-[70] bg-white flex flex-col shadow-2xl"
        style={{ width: "min(480px, 100vw)", transform: "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-end px-6 py-5">
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-zinc-700" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-8 py-6 flex flex-col">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            Inicia sesión o crea una cuenta
          </h2>
          <p className="text-zinc-500 text-sm mb-8">
            Ingresa tu correo para registrarte o iniciar sesión.
          </p>

          {/* Email */}
          <input
            type="email"
            placeholder="Correo electrónico *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-100 rounded-xl px-4 py-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 transition mb-4"
          />

          <button className="w-full bg-zinc-900 text-white font-bold py-4 rounded-full hover:bg-zinc-700 transition-colors text-sm mb-6">
            Continuar
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400">O</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          {/* Social buttons */}
          <div className="flex gap-3 mb-8">
            {/* Google */}
            <button className="flex-1 flex items-center justify-center gap-2 border border-zinc-200 rounded-full py-3.5 hover:bg-zinc-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            {/* Apple */}
            <button className="flex-1 flex items-center justify-center gap-2 border border-zinc-200 rounded-full py-3.5 hover:bg-zinc-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.29.07 2.18.74 2.94.8 1.12-.23 2.2-.91 3.39-.84 1.44.11 2.52.68 3.22 1.72-2.95 1.78-2.25 5.71.49 6.81-.57 1.56-1.32 3.1-2.04 4.39zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </button>
          </div>

          {/* Legal */}
          <p className="text-xs text-zinc-400 leading-relaxed mt-auto">
            Al continuar, aceptas nuestros{" "}
            <span className="text-zinc-900 underline cursor-pointer">Términos de servicio</span>{" "}
            y confirmas que has leído nuestra{" "}
            <span className="text-zinc-900 underline cursor-pointer">Política de privacidad</span>.
          </p>
        </div>
      </div>
    </>,
    document.body
  );
};

export default AuthDrawer;