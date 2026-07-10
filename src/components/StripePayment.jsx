import { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ordersApi, settingsApi } from "../lib/api";
import { notify } from "../lib/notify";

// Cargar Stripe con la publishable key del admin
let stripePromise;
const getStripe = (publishableKey) => {
    if (!stripePromise && publishableKey) {
        stripePromise = loadStripe(publishableKey);
    }
    return stripePromise;
};

// Componente interno del formulario de pago
const CheckoutForm = ({ amount, onSuccess, onError, settings }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const hasCreatedIntent = useRef(false); // 👈 Evitar múltiples llamadas

    useEffect(() => {
        // Crear PaymentIntent en el backend solo una vez
        if (!hasCreatedIntent.current && amount > 0) {
            hasCreatedIntent.current = true;
            const createPaymentIntent = async () => {
                try {
                    console.log("💰 Creando PaymentIntent para amount:", amount);
                    const response = await ordersApi.createPaymentIntent({
                        amount: amount,
                        currency: "cop",
                    });
                    setClientSecret(response.clientSecret);
                } catch (err) {
                    console.error("Error creating payment intent:", err);
                    onError?.("Error al iniciar el pago");
                }
            };
            createPaymentIntent();
        }
    }, [amount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setLoading(true);
        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (error) {
                onError?.(error.message);
            } else if (paymentIntent.status === "succeeded") {
                onSuccess?.(paymentIntent);
            }
        } catch (err) {
            onError?.(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border border-zinc-200 rounded-xl p-4">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#1f2937",
                                "::placeholder": { color: "#9ca3af" },
                                fontFamily: "system-ui, -apple-system, sans-serif",
                            },
                        },
                    }}
                />
            </div>
            <button
                type="submit"
                disabled={!stripe || loading || !clientSecret || amount <= 0}
                className="w-full py-3 bg-zinc-900 text-white rounded-full font-bold hover:bg-zinc-700 disabled:opacity-50 transition-colors"
            >
                {loading ? "Procesando..." : `Pagar $${amount.toLocaleString("es-CO")}`}
            </button>
        </form>
    );
};

// Componente principal
export default function StripePayment({ amount, onSuccess, onError }) {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await settingsApi.get();
                console.log("🔍 Settings cargadas:", data);
                setSettings(data);
            } catch (err) {
                console.error("Error loading settings:", err);
                onError?.("Error al cargar configuración de pagos");
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    if (loading) {
        return <div className="text-center py-4 text-zinc-500">Cargando...</div>;
    }

    if (!settings?.stripeEnabled || !settings?.stripeKey) {
        return (
            <div className="text-center py-4 text-amber-600 bg-amber-50 rounded-xl">
                ⚠️ Stripe no está configurado. Contacta al administrador.
            </div>
        );
    }

    // Validar que amount es válido
    if (amount <= 0) {
        return (
            <div className="text-center py-4 text-red-600 bg-red-50 rounded-xl">
                ⚠️ El monto a pagar es inválido. Verifica tu carrito.
            </div>
        );
    }

    const stripePromise = getStripe(settings.stripeKey);

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm 
                amount={amount} 
                onSuccess={onSuccess} 
                onError={onError}
                settings={settings}
            />
        </Elements>
    );
}