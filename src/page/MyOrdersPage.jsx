import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, ChevronRight, Truck, CheckCircle, Clock, XCircle, 
  Eye, Download, MapPin, Calendar, CreditCard, Search, Filter,
  ArrowLeft, ShoppingBag, RefreshCw
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ordersApi } from "../lib/api"
import { notify } from "../lib/notify";

// Configuración de estados (sin cambios)
// Configuración de estados CORREGIDA (coincide con el backend)
const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, color: "bg-amber-500", textColor: "text-amber-600", bgColor: "bg-amber-50" },
  processing: { label: "Procesando", icon: Clock, color: "bg-amber-500", textColor: "text-amber-600", bgColor: "bg-amber-50" },
  completed: { label: "Completado", icon: CheckCircle, color: "bg-green-500", textColor: "text-green-600", bgColor: "bg-green-50" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "bg-red-500", textColor: "text-red-600", bgColor: "bg-red-50" }
};

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
const [refreshing, setRefreshing] = useState(false);
  // Cargar pedidos desde el backend
  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

const fetchOrders = async () => {
    try {
        setRefreshing(true);
        const userOrders = await ordersApi.getUserOrders(user.id);
        setOrders(userOrders);
        notify.success("Pedidos actualizados");
    } catch (error) {
        console.error("Error fetching orders:", error);
        notify.error("Error al cargar los pedidos");
    } finally {
        setRefreshing(false);
        setLoading(false); // 👈 IMPORTANTE: También setear loading a false
    }
};
  const getStatusInfo = (status) => {
    return statusConfig[status] || statusConfig.pending;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Fecha no disponible";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  const filteredOrders = orders.filter(order => {
    if (filter !== "all" && order.status !== filter) return false;
    if (search && !order.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCancelOrder = async (orderId) => {
    if (!confirm("¿Estás seguro de que quieres cancelar este pedido?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        // Actualizar el estado local
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: "cancelled" } : order
        ));
        alert("Pedido cancelado exitosamente");
      } else {
        alert("Error al cancelar el pedido");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Error al cancelar el pedido");
    }
  };

  const handleReorder = (order) => {
    // Agregar los productos al carrito
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    order.items.forEach(item => {
      const existingItem = cart.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        cart.push({ ...item, quantity: item.quantity });
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/invoice`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `factura-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        alert("Error al descargar la factura");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Error al descargar la factura");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-24">
        <div className="text-center">
          <Package size={48} className="mx-auto text-zinc-300 mb-4" />
          <p className="text-zinc-500 mb-2">Inicia sesión para ver tus pedidos</p>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-zinc-900 underline"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header - SIN CAMBIOS */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-zinc-100 transition-colors lg:hidden"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-4xl impact text-zinc-900">Mis pedidos</h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Consulta el estado de tus compras y sigue tus envíos
          </p>
        </div>

        {/* Stats - SIN CAMBIOS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-zinc-900">{orders.length}</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Total pedidos</p>
          </div>
          <div className="bg-zinc-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-zinc-900">
              {orders.filter(o => o.status === "delivered").length}
            </p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Entregados</p>
          </div>
          <div className="bg-zinc-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-zinc-900">
              {orders.filter(o => o.status === "shipped").length}
            </p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">En camino</p>
          </div>
          <div className="bg-zinc-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-zinc-900">
              {formatPrice(orders.reduce((sum, o) => sum + (o.total || 0), 0))}
            </p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Total gastado</p>
          </div>
        </div>

        {/* Filtros y búsqueda - SIN CAMBIOS */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => {
              const config = statusConfig[status] || { label: status === "all" ? "Todos" : status };
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    filter === status
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {status === "all" ? "Todos" : config.label}
                </button>
              );
            })}
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por número de pedido..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-zinc-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        </div>

        {/* Lista de pedidos - SIN CAMBIOS EN EL DISEÑO */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-zinc-50 rounded-3xl">
            <Package size={48} className="mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-500 mb-2">No tienes pedidos {filter !== "all" ? `con estado "${statusConfig[filter]?.label}"` : ""}</p>
            <button
              onClick={() => navigate("/products")}
              className="text-sm text-zinc-900 underline"
            >
              Explorar productos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div
                  key={order.id}
                  className="bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Header del pedido - SIN CAMBIOS */}
                  <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs text-zinc-400 uppercase tracking-wider">N° Pedido</p>
                          <p className="text-sm font-semibold text-zinc-900 font-mono">{order.id?.slice(0, 8)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400 uppercase tracking-wider">Fecha</p>
                          <p className="text-sm text-zinc-600">{formatDate(order.date)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400 uppercase tracking-wider">Total</p>
                          <p className="text-sm font-bold text-zinc-900">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusInfo.bgColor}`}>
                          <StatusIcon size={12} className={statusInfo.textColor} />
                          <span className={`text-xs font-medium ${statusInfo.textColor}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="text-xs text-zinc-400 hover:text-zinc-900 flex items-center gap-1"
                        >
                          {selectedOrder?.id === order.id ? "Ver menos" : "Ver detalles"}
                          <ChevronRight size={12} className={selectedOrder?.id === order.id ? "rotate-90" : ""} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Productos - SIN CAMBIOS */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-12 h-12 bg-zinc-100 rounded-lg flex-shrink-0 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = "/images/placeholder.jpg"; }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-zinc-900">{item.name}</p>
                            <p className="text-xs text-zinc-400">
                              {item.quantity} x {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-zinc-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detalles expandidos - SIN CAMBIOS */}
                  {selectedOrder?.id === order.id && (
                    <div className="border-t border-zinc-100 bg-zinc-50/30 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Dirección de envío */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin size={14} className="text-zinc-400" />
                            <p className="text-xs font-bold uppercase text-zinc-500">Dirección de envío</p>
                          </div>
                          <p className="text-sm text-zinc-600">{order.address?.name || "Casa"}</p>
                          <p className="text-xs text-zinc-400">
                            {order.address?.street}, {order.address?.city}, {order.address?.state}
                          </p>
                        </div>

                        {/* Información de envío */}
                        {order.tracking && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Truck size={14} className="text-zinc-400" />
                              <p className="text-xs font-bold uppercase text-zinc-500">Información de envío</p>
                            </div>
                            <p className="text-sm text-zinc-600">
                              {order.tracking.carrier} · {order.tracking.number}
                            </p>
                            <p className="text-xs text-zinc-400">Estado: {order.tracking.status}</p>
                          </div>
                        )}

                        {/* Resumen de pago */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard size={14} className="text-zinc-400" />
                            <p className="text-xs font-bold uppercase text-zinc-500">Resumen de pago</p>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Subtotal</span>
                              <span className="text-zinc-700">{formatPrice(order.total - order.shipping + order.discount)}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between">
                                <span className="text-green-600">Descuento</span>
                                <span className="text-green-600">-{formatPrice(order.discount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Envío</span>
                              <span className="text-zinc-700">{order.shipping === 0 ? "Gratis" : formatPrice(order.shipping)}</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-zinc-200">
                              <span className="font-bold text-zinc-900">Total</span>
                              <span className="font-bold text-zinc-900">{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Acciones - CON FUNCIONALIDAD REAL */}
                        <div className="flex gap-2">
                          {(order.status === "pending" || order.status === "processing") && (
                            <button 
                              onClick={() => handleCancelOrder(order.id)}
                              className="flex-1 py-2 rounded-full border-2 border-zinc-200 text-sm font-medium hover:bg-zinc-50"
                            >
                              Cancelar pedido
                            </button>
                          )}
                          {order.status === "delivered" && (
                            <button 
                              onClick={() => handleReorder(order)}
                              className="flex-1 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 flex items-center justify-center gap-2"
                            >
                              <ShoppingBag size={14} /> Comprar de nuevo
                            </button>
                          )}
                          <button 
                            onClick={() => downloadInvoice(order.id)}
                            className="flex items-center justify-center gap-1 px-4 py-2 rounded-full border border-zinc-200 text-sm hover:bg-zinc-50"
                          >
                            <Download size={14} /> Factura
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Botón para actualizar - SIN CAMBIOS */}
        <div className="flex justify-center mt-8">
<button
    onClick={fetchOrders}
    disabled={refreshing}
    className="flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-200 text-sm hover:bg-zinc-50 transition-colors disabled:opacity-50"
>
    <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
    {refreshing ? "Actualizando..." : "Actualizar pedidos"}
</button>
        </div>
      </div>
    </div>
  );
}