import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ordersApi } from "../lib/api";
import { notify } from "../lib/notify";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function BoldCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const confirm = async () => {
      const orderId = searchParams.get("orderId");
      const boldStatus = searchParams.get("status");

      if (!orderId) {
        setStatus("error");
        setError("No se encontró la orden");
        return;
      }

      if (boldStatus === "failed" || boldStatus === "expired" || boldStatus === "cancelled") {
        setStatus("failed");
        notify.error("El pago fue cancelado o falló");
        return;
      }

      try {
        const result = await ordersApi.confirmBoldPayment(orderId);

        if (result.success) {
          setStatus("success");
          notify.success("¡Pago confirmado!");
        } else {
          setStatus("failed");
          setError(`Estado: ${result.status}`);
        }
      } catch (err) {
        console.error("Bold callback error:", err);
        setStatus("error");
        setError(err.message || "Error al confirmar el pago");
      }
    };

    confirm();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        {status === "loading" && (
          <div>
            <Loader2 size={48} className="mx-auto animate-spin text-blue-600 mb-4" />
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Verificando pago...</h1>
            <p className="text-zinc-500">Por favor espera mientras confirmamos tu pago.</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">¡Pago exitoso!</h1>
            <p className="text-zinc-500 mb-6">Tu pedido ha sido confirmado.</p>
            <button
              onClick={() => navigate("/mis-pedidos")}
              className="px-8 py-3 bg-zinc-900 text-white rounded-full font-bold hover:bg-zinc-700"
            >
              Ver mis pedidos
            </button>
          </div>
        )}

        {(status === "failed" || status === "error") && (
          <div>
            <XCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Pago no completado</h1>
            <p className="text-zinc-500 mb-6">{error || "El pago no pudo ser procesado. Intenta de nuevo."}</p>
            <button
              onClick={() => navigate("/checkout")}
              className="px-8 py-3 bg-zinc-900 text-white rounded-full font-bold hover:bg-zinc-700"
            >
              Volver al checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
