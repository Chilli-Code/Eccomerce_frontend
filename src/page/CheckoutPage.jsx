import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { addressApi, paymentApi, ordersApi } from "../lib/api";
import { notify } from "../lib/notify";
import StripePayment from "../components/StripePayment";
import { MapPin, CreditCard, ChevronRight, Truck, Shield, RotateCcw } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    items, 
    subtotal,     // ✅ Del contexto
    discount,     // ✅ Del contexto
    finalTotal,   // ✅ Del contexto
    appliedCoupon, // ✅ Del contexto
    clearCart 
  } = useCart();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("address");
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Colombia",
    type: "home",
    isDefault: false,
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (items.length === 0) {
      navigate("/mis-pedidos");
      return;
    }
    loadAddresses();
    loadPaymentMethods();
  }, [user, items]);

  const loadAddresses = async () => {
    try {
      const data = await addressApi.list();
      setAddresses(data);
      const defaultAddress = data.find(a => a.isDefault);
      if (defaultAddress) setSelectedAddress(defaultAddress);
      else if (data.length > 0) setSelectedAddress(data[0]);
    } catch (err) {
      console.error("Error loading addresses:", err);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const data = await paymentApi.list();
      setSavedCards(data);
      const defaultCard = data.find(c => c.isDefault);
      if (defaultCard) setSelectedCard(defaultCard);
      else if (data.length > 0) setSelectedCard(data[0]);
    } catch (err) {
      console.error("Error loading payment methods:", err);
    }
  };

  const saveAddress = async () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city) {
      notify.error("Completa los campos obligatorios");
      return;
    }
    try {
      const result = await addressApi.create(newAddress);
      setAddresses([...addresses, result]);
      setSelectedAddress(result);
      setShowAddressForm(false);
      setNewAddress({
        name: "", street: "", city: "", state: "", zipCode: "", country: "Colombia", type: "home", isDefault: false,
      });
      notify.success("Dirección guardada");
    } catch (err) {
      notify.error("Error al guardar dirección");
    }
  };

const handlePaymentSuccess = async (paymentIntent) => {
  setLoading(true);
  try {
    if (!selectedAddress) {
      notify.error("Selecciona una dirección de envío");
      setLoading(false);
      return;
    }

    const orderData = {
      addressId: selectedAddress.id,
      items: items.map(item => ({
        productId: item.id,
        variantId: item.variantId || undefined,
        quantity: item.qty,
        price: Number(item.price), // 👈 Convertir a número
        name: item.name,
      })),
      paymentMethod: paymentMethod,
      paymentToken: paymentIntent.id,
      couponCode: appliedCoupon?.code || undefined,
    };
    
    console.log("📦 Enviando orden:", orderData);
    
    const response = await fetch("http://192.168.0.16:3001/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("store_token")}`,
      },
      body: JSON.stringify(orderData),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      notify.success("¡Pedido realizado con éxito!");
      navigate("/mis-pedidos");
    } else {
      notify.error(result.error || "Error al procesar el pedido");
    }
  } catch (err) {
    console.error("Error:", err);
    notify.error("Error al procesar el pedido");
  } finally {
    setLoading(false);
  }
};

  const shipping = 0; // Calcular según dirección

  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl impact text-zinc-900 mb-2">Checkout</h1>
        <p className="text-zinc-400 mb-8">Completa los datos para finalizar tu compra</p>

        {/* Mostrar cupón aplicado */}
        {appliedCoupon && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-700">
              🎉 Cupón aplicado: <strong>{appliedCoupon.code}</strong> - 
              {appliedCoupon.type === "percentage" 
                ? ` ${appliedCoupon.value}% de descuento` 
                : ` $${appliedCoupon.value} de descuento`}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dirección de envío */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-zinc-400" />
                  <h2 className="text-lg font-bold text-zinc-900">Dirección de envío</h2>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-sm text-primary-600"
                >
                  {showAddressForm ? "Cancelar" : "+ Nueva dirección"}
                </button>
              </div>

              {showAddressForm ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nombre de la dirección (Ej: Casa, Oficina)"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Calle y número"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Ciudad"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="px-4 py-2 border border-zinc-200 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Departamento"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="px-4 py-2 border border-zinc-200 rounded-xl"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Código postal"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-zinc-600">Establecer como dirección principal</label>
                  </div>
                  <button
                    onClick={saveAddress}
                    className="w-full py-3 bg-zinc-900 text-white rounded-full font-medium"
                  >
                    Guardar dirección
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {addresses.length === 0 ? (
                    <p className="text-zinc-400 text-center py-4">No tienes direcciones guardadas</p>
                  ) : (
                    addresses.map(addr => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedAddress?.id === addr.id
                            ? "border-zinc-900 bg-zinc-50"
                            : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress?.id === addr.id}
                          onChange={() => setSelectedAddress(addr)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-semibold text-zinc-900">{addr.name}</p>
                          <p className="text-sm text-zinc-500">
                            {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                          </p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Método de pago */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-zinc-400" />
                <h2 className="text-lg font-bold text-zinc-900">Método de pago</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentMethod("stripe")}
                    className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                      paymentMethod === "stripe"
                        ? "border-zinc-900 bg-zinc-50 text-zinc-900"
                        : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                    }`}
                  >
                    Tarjeta de crédito/débito
                  </button>
                  <button
                    onClick={() => setPaymentMethod("bold")}
                    className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                      paymentMethod === "bold"
                        ? "border-zinc-900 bg-zinc-50 text-zinc-900"
                        : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                    }`}
                  >
                    BOLD (PSE, Nequi)
                  </button>
                </div>

                {paymentMethod === "stripe" && (
                  <StripePayment
                    amount={finalTotal}
                    onSuccess={handlePaymentSuccess}
                    onError={(error) => notify.error(error)}
                  />
                )}
                
                {paymentMethod === "bold" && (
                  <div className="p-4 bg-zinc-50 rounded-xl text-center">
                    <p className="text-zinc-500">Próximamente disponible</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-50 rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-zinc-900 mb-4">Resumen del pedido</h3>
              
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variantId}`} className="flex justify-between text-sm">
                    <span className="text-zinc-600">
                      {item.name} x{item.qty}
                    </span>
                    <span className="text-zinc-900 font-medium">
                      ${(item.price * item.qty).toLocaleString("es-CO")}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-zinc-200 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="text-zinc-700">${subtotal.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Envío</span>
                  <span className="text-zinc-700">Gratis</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento</span>
                    <span>-${discount.toLocaleString("es-CO")}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-200">
                  <span>Total</span>
                  <span>${finalTotal.toLocaleString("es-CO")}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Truck size={14} />
                  <span>Envío gratis en compras mayores a $50.000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} />
                  <span>Compra protegida</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={14} />
                  <span>Devolución gratuita 30 días</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}