import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, MessageSquare, Plus, ChevronRight, Clock, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ticketsApi } from "../lib/api";
import { notify } from "../lib/notify";

const STATUS_COLORS = {
  open: { bg: "bg-blue-50", text: "text-blue-600", icon: Clock, label: "Abierto" },
  in_progress: { bg: "bg-amber-50", text: "text-amber-600", icon: Loader2, label: "En proceso" },
  resolved: { bg: "bg-green-50", text: "text-green-600", icon: CheckCircle, label: "Resuelto" },
  closed: { bg: "bg-gray-50", text: "text-gray-500", icon: AlertCircle, label: "Cerrado" },
};

const PRIORITY_LABELS = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

// Componente: Formulario para nuevo ticket
const NewTicketForm = ({ onBack, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    priority: "medium",
    message: "",
  });

  const handleSubmit = async () => {
    if (!form.subject.trim() || !form.message.trim()) {
      notify.error("Asunto y mensaje son obligatorios");
      return;
    }
    setLoading(true);
    try {
      await ticketsApi.create({
        customerId: user.id,
        subject: form.subject,
        priority: form.priority,
        message: form.message,
      });
      notify.success("Ticket creado");
      onSuccess?.();
    } catch (err) {
      notify.error("Error al crear ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 mb-6">
        <ArrowLeft size={16} /> Volver
      </button>
      <h2 className="text-2xl font-bold text-zinc-900 mb-2">Nuevo ticket</h2>
      <p className="text-zinc-400 mb-6">Describe tu problema y te ayudaremos</p>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-zinc-900 block mb-2">Asunto *</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Ej: Mi pedido no ha llegado"
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>
        
        <div>
          <label className="text-sm font-bold text-zinc-900 block mb-2">Prioridad</label>
          <div className="flex gap-2">
            {["low", "medium", "high"].map(p => (
              <button
                key={p}
                onClick={() => setForm({ ...form, priority: p })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  form.priority === p
                    ? p === "high" ? "bg-red-500 text-white" : p === "medium" ? "bg-amber-500 text-white" : "bg-gray-500 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {p === "low" ? "Baja" : p === "medium" ? "Media" : "Alta"}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-bold text-zinc-900 block mb-2">Descripción *</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            placeholder="Describe tu problema con detalle..."
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
          />
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-zinc-900 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar ticket"}
        </button>
      </div>
    </div>
  );
};

// Componente: Detalle del ticket
const TicketDetailView = ({ ticketId, onBack }) => {
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const data = await ticketsApi.get(ticketId);
      setTicket(data);
      setMessages(data.messages || []);
    } catch (err) {
      notify.error("Error al cargar ticket");
      onBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await ticketsApi.addMessage(ticketId, newMessage);
      await loadTicket();
      setNewMessage("");
    } catch (err) {
      notify.error("Error al enviar mensaje");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!ticket) return null;

  const statusConfig = STATUS_COLORS[ticket.status] || STATUS_COLORS.open;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Header fijo */}
      <div className="flex-shrink-0">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 mb-4">
          <ArrowLeft size={16} /> Volver
        </button>
        
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-mono text-xs text-zinc-400">#{ticket.id?.slice(0, 8)}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
              <StatusIcon size={12} className="inline mr-1" />
              {statusConfig.label}
            </span>
            <span className="text-xs text-zinc-400">{PRIORITY_LABELS[ticket.priority] || "Media"}</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900">{ticket.subject}</h2>
          <p className="text-xs text-zinc-400 mt-1">Creado {formatDate(ticket.createdAt)}</p>
        </div>
      </div>
      
      {/* Chat scrollable */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              msg.sender === "customer" 
                ? "bg-zinc-900 text-white rounded-tr-sm"
                : "bg-zinc-100 text-zinc-700 rounded-tl-sm"
            }`}>
              <p className="text-sm">{msg.message}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === "customer" ? "text-zinc-400" : "text-zinc-400"}`}>
                {msg.sender === "customer" ? "Tú" : "Soporte"} · {formatDate(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Responder fijo */}
      {ticket.status !== "resolved" && (
        <div className="flex-shrink-0 border-t border-zinc-100 pt-4">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
            rows={3}
            placeholder="Escribe tu respuesta... (Enter para enviar)"
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim()}
            className="mt-3 px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Send size={14} />
            {sending ? "Enviando..." : "Responder"}
          </button>
        </div>
      )}
    </div>
  );
};
// Componente: Lista de tickets
const TicketList = ({ tickets, onSelectTicket, onNewTicket }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
    });
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-50 rounded-2xl">
        <MessageSquare size={48} className="mx-auto text-zinc-300 mb-4" />
        <p className="text-zinc-500 mb-2">No tienes tickets de soporte</p>
        <button
          onClick={onNewTicket}
          className="text-sm text-zinc-900 underline"
        >
          Crear nuevo ticket
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const statusConfig = STATUS_COLORS[ticket.status] || STATUS_COLORS.open;
        const StatusIcon = statusConfig.icon;
        const lastMessage = ticket.messages?.[0];
        
        return (
          <div
            key={ticket.id}
            onClick={() => onSelectTicket(ticket.id)}
            className="bg-white border border-zinc-100 rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-mono text-xs text-zinc-400">
                    #{ticket.id?.slice(0, 8)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                    <StatusIcon size={12} className="inline mr-1" />
                    {statusConfig.label}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                  {ticket.subject}
                </h3>
                {lastMessage && (
                  <p className="text-sm text-zinc-500 line-clamp-1">
                    {lastMessage.message}
                  </p>
                )}
                <p className="text-xs text-zinc-400 mt-2">
                  {formatDate(ticket.createdAt)}
                </p>
              </div>
              <ChevronRight size={20} className="text-zinc-300 group-hover:text-zinc-900 transition-colors ml-4 flex-shrink-0" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Página principal
export default function SupportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // list, new, detail
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    loadTickets();
  }, [user]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketsApi.list();
      const userTickets = data.filter(t => t.customerId === user.id);
      setTickets(userTickets);
    } catch (err) {
      notify.error("Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTicket = (id) => {
    setSelectedTicketId(id);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedTicketId(null);
    loadTickets(); // Recargar para actualizar estados
  };

  const handleNewTicket = () => {
    setView("new");
  };

  if (loading && view === "list") {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16">
        <div className="max-w-4xl mt-32mx-auto px-4 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-10 pb-16">
      <div className="max-w-4xl mt-10 mx-auto px-4">
        <h1 className="text-4xl impact text-zinc-900 mb-2">Soporte</h1>
        <p className="text-zinc-400 mb-8">
          {view === "list" && "Consulta y gestiona tus tickets de soporte"}
          {view === "new" && "Crea un nuevo ticket de soporte"}
          {view === "detail" && "Detalle del ticket"}
        </p>

        {view === "list" && (
          <>
            <TicketList 
              tickets={tickets} 
              onSelectTicket={handleSelectTicket}
              onNewTicket={handleNewTicket}
            />
            <div className="mt-8 text-center">
              <button
                onClick={handleNewTicket}
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors"
              >
                <Plus size={16} />
                Nuevo ticket
              </button>
            </div>
          </>
        )}

        {view === "new" && (
          <NewTicketForm 
            onBack={handleBackToList}
            onSuccess={handleBackToList}
          />
        )}

        {view === "detail" && (
          <TicketDetailView 
            ticketId={selectedTicketId}
            onBack={handleBackToList}
          />
        )}
      </div>
    </div>
  );
}