import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icono */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-100 flex items-center justify-center">
          <AlertCircle size={48} className="text-zinc-400" />
        </div>

        {/* Título */}
        <h1 className="text-7xl font-bold text-zinc-900 mb-4">404</h1>
        
        {/* Mensaje */}
        <p className="text-xl text-zinc-600 mb-2">
          ¡Ups! Página no encontrada
        </p>
        <p className="text-zinc-400 mb-8">
          No podemos encontrar la página que estás buscando.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 transition-colors"
          >
            <ArrowLeft size={18} />
            Volver atrás
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white font-medium hover:bg-zinc-700 transition-colors"
          >
            <Home size={18} />
            Ir al inicio
          </button>
        </div>

        {/* Footer (opcional) */}
        <p className="text-xs text-zinc-400 mt-8">
          Si crees que esto es un error, contacta con soporte
        </p>
      </div>
    </div>
  );
}