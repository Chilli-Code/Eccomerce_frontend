import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { storeAuth } from "../lib/api.js";
import UserProfile from "./auth/UserProfile";
import { useAuth } from "../context/AuthContext";

const AuthDrawer = ({ open, onClose, onAuthSuccess }) => {
  const drawerRef = useRef(null);
  const { user, login, logout } = useAuth();
const [drawerTitle, setDrawerTitle] = useState(null);
  const [step,     setStep]     = useState("email");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [code,     setCode]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
  if (open) {
    window.__smoother?.paused(true);
  } else {
    window.__smoother?.paused(false);
  }
}, [open]);
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

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("email"); setEmail(""); setPassword(""); setConfirm("");
        setName(""); setPhone(""); setCode(""); setError("");
      }, 400);
    }
  }, [open]);

  const handleCheckEmail = async () => {
    if (!email.trim()) return;
    setError(""); setLoading(true);
    try {
      const data = await storeAuth.checkEmail(email);
      if (!data.exists)           setStep("register");
      else if (!data.hasPassword) setStep("create-password");
      else                        setStep("login");
    } catch { setError("Error de conexión"); }
    finally { setLoading(false); }
  };

  const handleLogin = async () => {
    
    if (!password.trim()) return;
    setError(""); setLoading(true);
    try {
      const data = await storeAuth.login(email, password);
       console.log("🟣 AuthDrawer - login exitoso:", data.user);
      login(data.user, data.token);
      onAuthSuccess?.(data.user);
       onClose();
    } catch (err) { setError(err.message || "Credenciales incorrectas"); }
    finally { setLoading(false); }
  };

  const handleSendCode = async () => {
    if (!name.trim() || !password.trim()) return setError("Nombre y contraseña son obligatorios");
    if (password !== confirm)             return setError("Las contraseñas no coinciden");
    if (password.length < 6)             return setError("La contraseña debe tener al menos 6 caracteres");
    setError(""); setLoading(true);
    try {
      await storeAuth.sendCode({ email, name, phone, password });
      setStep("verify");
    } catch (err) { setError(err.message || "Error al enviar código"); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    if (code.length !== 6) return setError("El código debe tener 6 dígitos");
    setError(""); setLoading(true);
    try {
      const data = await storeAuth.verifyCode(email, code);
      login(data.user, data.token);
    } catch (err) { setError(err.message || "Código incorrecto"); }
    finally { setLoading(false); }
  };

  const handleSetPassword = async () => {
    if (password !== confirm) return setError("Las contraseñas no coinciden");
    if (code.length !== 6)   return setError("Ingresa el código de verificación");
    setError(""); setLoading(true);
    try {
      const data = await storeAuth.setPassword(email, password, code);
      console.log("🟣 AuthDrawer - setPassword exitoso:", data.user);
      login(data.user, data.token);
        onAuthSuccess?.(data.user);
        onClose();
    } catch (err) { setError(err.message || "Error"); }
    finally { setLoading(false); }
  };

  const handleSendVerification = async () => {
    setLoading(true);
    try {
      await storeAuth.sendVerification(email);
    } catch (err) { setError(err.message || "Error al enviar código"); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const inputClass = "w-full bg-zinc-100 rounded-xl px-4 py-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 transition mb-3";
  const btnClass   = "w-full bg-zinc-900 text-white font-bold py-4 rounded-full hover:bg-zinc-700 transition-colors text-sm disabled:opacity-40";

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/30 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />

      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full z-[70] bg-white flex flex-col shadow-2xl"
        style={{ width: "min(480px, 100vw)", transform: "translateX(100%)" }}
      >
<div className="flex items-center justify-between px-6 py-5">
  {drawerTitle ? (
    <h2 className="text-lg font-bold text-zinc-900">{drawerTitle}</h2>
  ) : (
    <div /> // espacio vacío para mantener la X a la derecha
  )}
  <button onClick={onClose} className="size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
    <X size={16} className="text-zinc-700" />
  </button>
</div>

        <div className="flex-1 px-8 py-4 flex flex-col overflow-y-auto" data-scroll="false">

          {user ? (
            <UserProfile user={user} onLogout={handleLogout} onSetDrawerTitle={setDrawerTitle} />
          ) : (
            <>
              {step === "email" && (
                <>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">Inicia sesión o crea una cuenta</h2>
                  <p className="text-zinc-500 text-sm mb-8">Ingresa tu correo para continuar.</p>
                  <input type="email" placeholder="Correo electrónico *" value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleCheckEmail()}
                    className={inputClass} />
                  {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl mb-3">{error}</p>}
                  <button onClick={handleCheckEmail} disabled={loading || !email.trim()} className={btnClass}>
                    {loading ? "Verificando…" : "Continuar"}
                  </button>
                </>
              )}

              {step === "login" && (
                <>
                  <button onClick={() => setStep("email")} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-900 mb-6 transition-colors">
                    <ArrowLeft size={12} /> {email}
                  </button>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">Bienvenido de vuelta</h2>
                  <p className="text-zinc-500 text-sm mb-8">Ingresa tu contraseña para continuar.</p>
                  <input type="password" placeholder="Contraseña *" value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    className={inputClass} />
                  {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl mb-3">{error}</p>}
                  <button onClick={handleLogin} disabled={loading || !password.trim()} className={`${btnClass} mb-4`}>
                    {loading ? "Iniciando sesión…" : "Iniciar sesión"}
                  </button>
                  <button onClick={() => setStep("register")} className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors text-center">
                    ¿No tienes cuenta? <span className="font-bold text-zinc-900 underline">Regístrate</span>
                  </button>
                </>
              )}

              {step === "create-password" && (
                <>
                  <button onClick={() => setStep("email")} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-900 mb-6 transition-colors">
                    <ArrowLeft size={12} /> {email}
                  </button>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">Crea tu contraseña</h2>
                  <p className="text-zinc-500 text-sm mb-6">
                    Encontramos tu cuenta. Verifica tu identidad con el código que enviamos a <strong>{email}</strong>.
                  </p>
                  <input type="password" placeholder="Nueva contraseña *" value={password}
                    onChange={e => setPassword(e.target.value)} className={inputClass} />
                  <input type="password" placeholder="Confirmar contraseña *" value={confirm}
                    onChange={e => setConfirm(e.target.value)} className={inputClass} />
                  <input type="text" placeholder="Código de verificación" value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className={`${inputClass} text-center tracking-widest`} maxLength={6} />
                  {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl mb-3">{error}</p>}
                  <button onClick={handleSetPassword} disabled={loading || !password.trim() || code.length !== 6} className={`${btnClass} mb-3`}>
                    {loading ? "Guardando…" : "Crear contraseña e iniciar sesión"}
                  </button>
                  <button onClick={handleSendVerification} disabled={loading}
                    className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors text-center">
                    {loading ? "Enviando…" : "Enviar código →"}
                  </button>
                </>
              )}

              {step === "register" && (
                <>
                  <button onClick={() => setStep("email")} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-900 mb-6 transition-colors">
                    <ArrowLeft size={12} /> {email}
                  </button>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">Crear cuenta</h2>
                  <p className="text-zinc-500 text-sm mb-6">Completa tus datos para registrarte.</p>
                  <input type="text"     placeholder="Nombre completo *"     value={name}     onChange={e => setName(e.target.value)}     className={inputClass} />
                  <input type="tel"      placeholder="Teléfono (opcional)"    value={phone}    onChange={e => setPhone(e.target.value)}    className={inputClass} />
                  <input type="password" placeholder="Contraseña *"           value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
                  <input type="password" placeholder="Confirmar contraseña *" value={confirm}  onChange={e => setConfirm(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSendCode()} className={inputClass} />
                  {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl mb-3">{error}</p>}
                  <button onClick={handleSendCode} disabled={loading || !name.trim() || !password.trim()} className={`${btnClass} mb-4`}>
                    {loading ? "Enviando código…" : "Continuar"}
                  </button>
                  <button onClick={() => setStep("login")} className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors text-center">
                    ¿Ya tienes cuenta? <span className="font-bold text-zinc-900 underline">Inicia sesión</span>
                  </button>
                </>
              )}

              {step === "verify" && (
                <>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">Verifica tu correo</h2>
                  <p className="text-zinc-500 text-sm mb-2">Enviamos un código de 6 dígitos a:</p>
                  <p className="font-semibold text-zinc-900 text-sm mb-6">{email}</p>
                  {import.meta.env.DEV && (
                    <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-xl mb-4">
                      📧 Revisa tu correo — el código también se muestra en la terminal del backend
                    </p>
                  )}
                  <input type="text" placeholder="000000" value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onKeyDown={e => e.key === "Enter" && handleVerify()}
                    className="w-full bg-zinc-100 rounded-xl px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition mb-3"
                    maxLength={6} />
                  {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl mb-3">{error}</p>}
                  <button onClick={handleVerify} disabled={loading || code.length !== 6} className={`${btnClass} mb-4`}>
                    {loading ? "Verificando…" : "Verificar y crear cuenta"}
                  </button>
                  <button onClick={handleSendCode} disabled={loading} className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors text-center">
                    ¿No recibiste el código? <span className="font-bold text-zinc-900 underline">Reenviar</span>
                  </button>
                </>
              )}

              <p className="text-xs text-zinc-400 leading-relaxed mt-auto pt-6">
                Al continuar, aceptas nuestros{" "}
                <span className="text-zinc-900 underline cursor-pointer">Términos de servicio</span>{" "}
                y confirmas que has leído nuestra{" "}
                <span className="text-zinc-900 underline cursor-pointer">Política de privacidad</span>.
              </p>
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default AuthDrawer;