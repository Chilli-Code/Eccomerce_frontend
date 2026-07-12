import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Phone, MapPin, CreditCard, Plus, Edit2, Trash2, 
  Save, X, Home, Briefcase, Truck, ChevronRight, LogOut, Heart,
  Package, ShoppingBag, ShieldCheck
} from "lucide-react";
import AddressInput from "../components/AddressInput";
import LocationAutocomplete from "../components/LocationAutocomplete";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { addressApi, paymentApi, ordersApi, customerApi } from "../lib/api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout, refreshUser } = useAuth();
  const { wishlist } = useWishlist();
  const { items: cart } = useCart();
const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  // Estados para edición de perfil
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Verificación de email
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  // Direcciones
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Colombia",
    type: "home",
    isDefault: false,
  });

  // Métodos de pago
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    isDefault: false,
  });

    const loadOrders = async () => {
    if (!user?.id) return;
    try {
      setLoadingOrders(true);
      const userOrders = await ordersApi.getUserOrders(user.id);
      setOrders(userOrders);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Estadísticas
  const stats = {
    orders: orders.length,
    wishlist: wishlist.length,
    cart: cart?.length || 0,
  };

  // Cargar direcciones y métodos de pago
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      loadAddresses();
      loadPaymentMethods();
      loadOrders();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const data = await addressApi.list();
      setAddresses(data);
    } catch (err) {
      console.error("Error loading addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      setLoadingPayments(true);
      const data = await paymentApi.list();
      setPaymentMethods(data);
    } catch (err) {
      console.error("Error loading payment methods:", err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleUpdateProfile = async () => {
    const emailChanged = formData.email !== user.email;

    try {
      if (emailChanged) {
        setPendingEmail(formData.email);
        await customerApi.sendEmailCode(formData.email);
        setVerificationCode("");
        setVerifyError("");
        setShowEmailVerification(true);
      } else {
        await updateUser({
          name: formData.name,
          phone: formData.phone,
        });
        setEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleVerifyEmail = async () => {
    if (verificationCode.length !== 6) return;
    setVerifying(true);
    setVerifyError("");
    try {
      await customerApi.verifyEmailCode(verificationCode);
      await updateUser({
        name: formData.name,
        phone: formData.phone,
      });
      const newUser = { ...user, name: formData.name, phone: formData.phone, email: pendingEmail };
      refreshUser(newUser);
      setShowEmailVerification(false);
      setEditing(false);
    } catch (err) {
      setVerifyError(err.message || "Código incorrecto");
    } finally {
      setVerifying(false);
    }
  };

  const addAddress = async () => {
    if (!addressForm.street || !addressForm.city) return;
    try {
      await addressApi.create(addressForm);
      await loadAddresses();
      setAddressForm({
        name: "", street: "", city: "", state: "", zipCode: "", country: "Colombia", type: "home", isDefault: false,
      });
      setShowAddressForm(false);
    } catch (err) {
      console.error("Error adding address:", err);
    }
  };

  const updateAddress = async () => {
    if (!editingAddress || !addressForm.street || !addressForm.city) return;
    try {
      await addressApi.update(editingAddress.id, addressForm);
      await loadAddresses();
      setEditingAddress(null);
      setShowAddressForm(false);
    } catch (err) {
      console.error("Error updating address:", err);
    }
  };

  const deleteAddress = async (id) => {
    try {
      await addressApi.delete(id);
      await loadAddresses();
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const addPaymentMethod = async () => {
    if (!paymentForm.cardNumber || !paymentForm.cardName || !paymentForm.expiryDate) return;
    try {
      await paymentApi.create({
        cardNumber: paymentForm.cardNumber,
        cardName: paymentForm.cardName,
        expiryDate: paymentForm.expiryDate,
        isDefault: paymentForm.isDefault,
      });
      await loadPaymentMethods();
      setPaymentForm({ cardNumber: "", cardName: "", expiryDate: "", cvv: "", isDefault: false });
      setShowPaymentForm(false);
    } catch (err) {
      console.error("Error adding payment method:", err);
    }
  };

  const deletePaymentMethod = async (id) => {
    try {
      await paymentApi.delete(id);
      await loadPaymentMethods();
    } catch (err) {
      console.error("Error deleting payment method:", err);
    }
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case "home": return <Home size={16} />;
      case "work": return <Briefcase size={16} />;
      default: return <MapPin size={16} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <User size={48} className="mx-auto text-zinc-300 mb-4" />
          <p className="text-zinc-500 mb-2">Inicia sesión para ver tu perfil</p>
          <button onClick={() => navigate("/")} className="text-sm text-zinc-900 underline">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl impact text-zinc-900">Mi perfil</h1>
          <p className="text-zinc-400 text-sm mt-1">Gestiona tu información y preferencias</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar - Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-50 rounded-3xl p-6 sticky top-24">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-zinc-900 text-white flex items-center justify-center text-4xl font-bold mb-4">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-zinc-900">{user.name}</h2>
                <p className="text-sm text-zinc-400 mt-1">{user.email}</p>
                {user.phone && <p className="text-xs text-zinc-400 mt-0.5">{user.phone}</p>}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6 pt-4 border-t border-zinc-200">
                <div className="text-center">
                  <p className="text-xl font-bold text-zinc-900">{stats.orders}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Pedidos</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-zinc-900">{stats.wishlist}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Favoritos</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-zinc-900">{stats.cart}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Carrito</p>
                </div>
              </div>

              {/* Links rápidos */}
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/mis-pedidos")}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Package size={18} className="text-zinc-400" />
                    <span className="text-sm text-zinc-600">Mis pedidos</span>
                  </div>
                  <ChevronRight size={14} className="text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white transition-colors group mt-4 border-t border-zinc-200 pt-4"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={18} className="text-red-400" />
                    <span className="text-sm text-red-500">Cerrar sesión</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Información personal */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-zinc-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                    Información personal
                  </h3>
                </div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs text-zinc-400 hover:text-zinc-900 flex items-center gap-1"
                  >
                    <Edit2 size={12} /> Editar
                  </button>
                )}
              </div>

              {editing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Nombre completo</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Correo electrónico</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 py-2 rounded-full border border-zinc-200 text-sm font-medium hover:bg-zinc-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      className="flex-1 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-zinc-400" />
                    <span className="text-zinc-600">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-zinc-400" />
                      <span className="text-zinc-600">{user.phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Direcciones de envío */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-zinc-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                    Direcciones de envío
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressForm({ name: "", street: "", city: "", state: "", zipCode: "", country: "Colombia", type: "home", isDefault: false });
                    setShowAddressForm(true);
                  }}
                  className="text-xs text-zinc-400 hover:text-zinc-900 flex items-center gap-1"
                >
                  <Plus size={12} /> Agregar dirección
                </button>
              </div>

              {loadingAddresses ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : addresses.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-4">
                  No tienes direcciones guardadas
                </p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="flex items-start justify-between p-3 bg-zinc-50 rounded-xl">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center">
                          {getAddressIcon(addr.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-zinc-900">{addr.name}</p>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-zinc-900 text-white px-2 py-0.5 rounded-full">Principal</span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {addr.street}, {addr.city}{addr.state ? `, ${addr.state}` : ""} - {addr.zipCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingAddress(addr);
                            setAddressForm({
                              name: addr.name || "",
                              street: addr.street || "",
                              city: addr.city || "",
                              state: addr.state || "",
                              zipCode: addr.zipCode || "",
                              country: addr.country || "Colombia",
                              type: addr.type || "home",
                              isDefault: addr.isDefault || false,
                            });
                            setShowAddressForm(true);
                          }}
                          className="p-1 text-zinc-400 hover:text-zinc-900"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="p-1 text-zinc-400 hover:text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal de dirección (igual que antes) */}
              {showAddressForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                  <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-zinc-900">
                        {editingAddress ? "Editar dirección" : "Nueva dirección"}
                      </h3>
                      <button onClick={() => setShowAddressForm(false)} className="p-1">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Nombre de la dirección (Ej: Casa, Oficina)"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm"
                      />
                      <AddressInput
                        value={addressForm.street}
                        onChange={(val) => setAddressForm({ ...addressForm, street: val })}
                      />
                      <LocationAutocomplete
                        department={addressForm.state}
                        city={addressForm.city}
                        onDepartmentChange={(val) => setAddressForm({ ...addressForm, state: val })}
                        onCityChange={(val) => setAddressForm({ ...addressForm, city: val })}
                      />
                      <input
                        type="text"
                        placeholder="Código postal"
                        value={addressForm.zipCode}
                        onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                        className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={addressForm.isDefault}
                          onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <label className="text-sm text-zinc-600">Establecer como dirección principal</label>
                      </div>
                      <button
                        onClick={editingAddress ? updateAddress : addAddress}
                        className="w-full py-3 bg-zinc-900 text-white rounded-full text-sm font-bold mt-2"
                      >
                        {editingAddress ? "Actualizar dirección" : "Guardar dirección"}
                      </button>
                    </div>
                  </div>
                </div>
              )}


            </div>

            {/* Métodos de pago */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-zinc-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                    Métodos de pago
                  </h3>
                </div>
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="text-xs text-zinc-400 hover:text-zinc-900 flex items-center gap-1"
                >
                  <Plus size={12} /> Agregar tarjeta
                </button>
              </div>

              {loadingPayments ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : paymentMethods.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-4">
                  No tienes tarjetas guardadas
                </p>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((card) => (
                    <div key={card.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center">
                          <CreditCard size={16} className="text-zinc-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{card.cardNumber}</p>
                          <p className="text-xs text-zinc-500">{card.cardName} · Expira {card.expiryDate}</p>
                        </div>
                        {card.isDefault && (
                          <span className="text-[10px] bg-zinc-900 text-white px-2 py-0.5 rounded-full ml-2">Principal</span>
                        )}
                      </div>
                      <button
                        onClick={() => deletePaymentMethod(card.id)}
                        className="p-1 text-zinc-400 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal de tarjeta (igual que antes) */}

                            {showPaymentForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                  <div className="bg-white rounded-2xl w-full max-w-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-zinc-900">Agregar tarjeta</h3>
                      <button onClick={() => setShowPaymentForm(false)} className="p-1">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Número de tarjeta"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                        className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm"
                        maxLength={16}
                      />
                      <input
                        type="text"
                        placeholder="Nombre en la tarjeta"
                        value={paymentForm.cardName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
                        className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={paymentForm.expiryDate}
                          onChange={(e) => setPaymentForm({ ...paymentForm, expiryDate: e.target.value })}
                          className="px-4 py-2 border border-zinc-200 rounded-xl text-sm"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                          className="px-4 py-2 border border-zinc-200 rounded-xl text-sm"
                          maxLength={4}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={paymentForm.isDefault}
                          onChange={(e) => setPaymentForm({ ...paymentForm, isDefault: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <label className="text-sm text-zinc-600">Establecer como método principal</label>
                      </div>
                      <button
                        onClick={addPaymentMethod}
                        className="w-full py-3 bg-zinc-900 text-white rounded-full text-sm font-bold mt-2"
                      >
                        Guardar tarjeta
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal verificación email */}
      {showEmailVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Verifica tu nuevo email</h3>
            <p className="text-sm text-zinc-400 mb-1">Hemos enviado un código a</p>
            <p className="text-sm font-semibold text-zinc-900 mb-4">{pendingEmail}</p>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full text-center text-2xl tracking-[8px] px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 mb-4"
            />
            {verifyError && (
              <p className="text-sm text-red-500 mb-3">{verifyError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailVerification(false)}
                className="flex-1 py-2.5 rounded-full border border-zinc-200 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleVerifyEmail}
                disabled={verificationCode.length !== 6 || verifying}
                className="flex-1 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium disabled:opacity-50"
              >
                {verifying ? "Verificando..." : "Verificar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

