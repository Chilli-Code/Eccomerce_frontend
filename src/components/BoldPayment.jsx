import { useState, useEffect } from "react";
import { ordersApi, settingsApi } from "../lib/api";
import { notify } from "../lib/notify";

export default function BoldPayment({ amount, checkoutData, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await settingsApi.get();
        setSettings(data);
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setSettingsLoading(false);
      }
    };
    load();
  }, []);

  if (settingsLoading) {
    return <div className="text-center py-4 text-zinc-500">Cargando...</div>;
  }

  if (!settings?.boldEnabled) {
    return (
      <div className="text-center py-4 text-amber-600 bg-amber-50 rounded-xl">
        ⚠️ BOLD no está configurado. Contacta al administrador.
      </div>
    );
  }

  if (amount <= 0) {
    return (
      <div className="text-center py-4 text-red-600 bg-red-50 rounded-xl">
        ⚠️ El monto a pagar es inválido.
      </div>
    );
  }

  const handleBoldPayment = async () => {
    setLoading(true);
    try {
      const redirectUrl = window.location.origin;

      const result = await ordersApi.createBoldCheckout({
        ...checkoutData,
        redirectUrl,
      });

      if (result?.url) {
        window.location.href = result.url;
      } else {
        throw new Error("No se recibió URL de pago");
      }
    } catch (err) {
      console.error("Bold error:", err);
      onError?.(err.message || "Error al iniciar pago Bold");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <p className="text-sm text-blue-700">
          Serás redirigido a Bold para pagar con PSE, Nequi, o tarjeta.
        </p>
      </div>
      <button
        onClick={handleBoldPayment}
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Redirigiendo a Bold..." : `Pagar $${amount.toLocaleString("es-CO")} con Bold`}
      </button>
    </div>
  );
}
