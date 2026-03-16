import { useState } from "react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const QUESTIONS = [
  {
    id: "model",
    question: "¿Qué modelo es tu iPhone?",
    type: "select",
    options: ["iPhone 11", "iPhone 12", "iPhone 12 Pro", "iPhone 13", "iPhone 13 Pro", "iPhone 14", "iPhone 14 Pro", "iPhone 15", "iPhone 15 Pro"],
  },
  {
    id: "storage",
    question: "¿Cuánta capacidad tiene?",
    type: "select",
    options: ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"],
  },
  {
    id: "screen",
    question: "¿Cómo está la pantalla?",
    type: "scale",
    labels: ["Rota / inutilizable", "Rayones leves", "Perfecta"],
  },
  {
    id: "body",
    question: "¿Cómo está el cuerpo del equipo?",
    type: "scale",
    labels: ["Muy golpeado", "Algunos golpes", "Como nuevo"],
  },
  {
    id: "battery",
    question: "¿Cuál es el estado de la batería?",
    type: "select",
    options: ["Menos del 80%", "80% – 85%", "86% – 90%", "91% – 95%", "96% – 100%"],
  },
  {
    id: "faceid",
    question: "¿Funciona el Face ID / Touch ID?",
    type: "bool",
  },
  {
    id: "icloud",
    question: "¿Tiene cuenta iCloud vinculada?",
    type: "bool",
    hint: "Sin cuenta iCloud el precio es mayor, ya que no hay bloqueo de activación.",
  },
  {
    id: "accessories",
    question: "¿Tienes la caja y accesorios originales?",
    type: "bool",
  },
];

// Base prices per model (COP)
const BASE_PRICES = {
  "iPhone 11":      900000,
  "iPhone 12":     1100000,
  "iPhone 12 Pro": 1350000,
  "iPhone 13":     1500000,
  "iPhone 13 Pro": 1800000,
  "iPhone 14":     2100000,
  "iPhone 14 Pro": 2600000,
  "iPhone 15":     2900000,
  "iPhone 15 Pro": 3500000,
};

const STORAGE_BONUS = { "64 GB": 0, "128 GB": 80000, "256 GB": 180000, "512 GB": 320000, "1 TB": 500000 };
const BATTERY_MULT  = { "Menos del 80%": 0.65, "80% – 85%": 0.75, "86% – 90%": 0.85, "91% – 95%": 0.92, "96% – 100%": 1.0 };

function calcPrice(answers) {
  const base    = BASE_PRICES[answers.model] || 1000000;
  const storage = STORAGE_BONUS[answers.storage] || 0;
  let   price   = base + storage;

  // Screen (scale 1-10, index 0-9 mapped 1-10)
  const screenScore = (answers.screen || 5) / 10;
  price *= 0.6 + screenScore * 0.4;

  // Body
  const bodyScore = (answers.body || 5) / 10;
  price *= 0.7 + bodyScore * 0.3;

  // Battery
  price *= BATTERY_MULT[answers.battery] || 0.8;

  // Booleans
  if (answers.faceid === false)      price *= 0.80;
  if (answers.icloud === true)       price *= 0.85;
  if (answers.accessories === true)  price *= 1.05;

  return Math.round(price / 10000) * 10000; // round to 10k
}

const fmt = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

// ── Scale input ──────────────────────────────────────────────
const ScaleInput = ({ value, onChange, labels }) => {
  const ticks = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <div className="w-full">
      <div className="flex justify-between mb-3">
        {ticks.map((t) => (
          <button key={t} onClick={() => onChange(t)}
            className="flex flex-col items-center gap-1.5 group"
            style={{ width: "9%" }}>
            <span className={`w-full h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 ${
              value === t
                ? "bg-zinc-900 text-white scale-110 shadow-lg"
                : value && value > t
                  ? "bg-zinc-200 text-zinc-600"
                  : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
            }`}>{t}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-zinc-400 px-0.5">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
        <span>{labels[2]}</span>
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────
const PhoneValuator = () => {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone]       = useState(false);
  const cardRef               = useRef(null);

  const q = QUESTIONS[step];

  const animateNext = (fn) => {
    if (!cardRef.current) { fn(); return; }
    gsap.to(cardRef.current, { x: -30, opacity: 0, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        fn();
        gsap.fromTo(cardRef.current, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
      }
    });
  };

  const answer = (val) => {
    const next = { ...answers, [q.id]: val };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      animateNext(() => setStep((s) => s + 1));
    } else {
      animateNext(() => setDone(true));
    }
  };

  const reset = () => {
    animateNext(() => { setStep(0); setAnswers({}); setDone(false); });
  };

  const price = done ? calcPrice(answers) : 0;
  const progress = ((step) / QUESTIONS.length) * 100;

  return (
    <section className="bg-zinc-50 py-20 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">Vende tu iPhone</p>
          <h2 className="text-4xl font-black text-zinc-900 leading-tight" style={{ fontFamily: "Impact, sans-serif", letterSpacing: "-0.02em" }}>
            ¿CUÁNTO VALE<br />TU CELULAR?
          </h2>
          <p className="text-zinc-500 text-sm mt-2">Responde {QUESTIONS.length} preguntas y te decimos el precio de compra.</p>
        </div>

        {/* Card */}
        <div ref={cardRef} className="bg-white rounded-3xl border border-zinc-100 shadow-xl overflow-hidden">

          {/* Progress bar */}
          {!done && (
            <div className="h-1 bg-zinc-100 w-full">
              <div className="h-full bg-zinc-900 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }} />
            </div>
          )}

          <div className="p-8">
            {!done ? (
              <>
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-bold bg-zinc-900 text-white px-2.5 py-1 rounded-full">
                    {step + 1} / {QUESTIONS.length}
                  </span>
                  {q.hint && (
                    <span className="text-xs text-zinc-400 italic">{q.hint}</span>
                  )}
                </div>

                {/* Question */}
                <p className="text-xl font-bold text-zinc-900 mb-6 leading-snug">{q.question}</p>

                {/* Inputs */}
                {q.type === "select" && (
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt) => (
                      <button key={opt} onClick={() => answer(opt)}
                        className="text-left px-5 py-3.5 rounded-2xl border border-zinc-200 text-sm font-medium text-zinc-700 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-150">
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === "scale" && (
                  <div className="mt-2">
                    <ScaleInput
                      value={answers[q.id]}
                      onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                      labels={q.labels}
                    />
                    <button
                      disabled={!answers[q.id]}
                      onClick={() => answer(answers[q.id])}
                      className="mt-6 w-full py-3.5 rounded-2xl bg-zinc-900 text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition-all">
                      Continuar →
                    </button>
                  </div>
                )}

                {q.type === "bool" && (
                  <div className="flex gap-3">
                    {[{ label: "Sí ✓", val: true }, { label: "No ✗", val: false }].map(({ label, val }) => (
                      <button key={label} onClick={() => answer(val)}
                        className="flex-1 py-4 rounded-2xl border border-zinc-200 text-sm font-bold text-zinc-700 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-150">
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // ── Resultado ──
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                  ✓ Valoración completada
                </div>

                <p className="text-zinc-500 text-sm mb-2">Tu {answers.model} vale aproximadamente</p>
                <p className="text-5xl font-black text-zinc-900 mb-1" style={{ fontFamily: "Impact, sans-serif", letterSpacing: "-0.02em" }}>
                  {fmt(price)}
                </p>
                <p className="text-xs text-zinc-400 mb-8">Precio estimado de compra. Sujeto a revisión física del equipo.</p>

                {/* Resumen */}
                <div className="text-left bg-zinc-50 rounded-2xl p-5 mb-6 space-y-2">
                  {QUESTIONS.map((q) => (
                    <div key={q.id} className="flex justify-between text-sm">
                      <span className="text-zinc-400">{q.question.replace("¿", "").replace("?", "")}</span>
                      <span className="font-semibold text-zinc-900">
                        {q.type === "bool"
                          ? answers[q.id] ? "Sí" : "No"
                          : q.type === "scale"
                            ? `${answers[q.id]} / 10`
                            : answers[q.id]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={reset}
                    className="flex-1 py-3.5 rounded-2xl border border-zinc-200 text-sm font-bold text-zinc-600 hover:border-zinc-400 transition-all">
                    Volver a calcular
                  </button>
                  <button
                    className="flex-1 py-3.5 rounded-2xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-all">
                    Contactar tienda →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nota */}
        <p className="text-center text-xs text-zinc-400 mt-5">
          El precio final se confirma tras inspección física en tienda. Precios en COP.
        </p>
      </div>
    </section>
  );
};

export default PhoneValuator;