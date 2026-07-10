import { useState } from "react";
import { Package, User, LogOut, Heart, ArrowLeft, MessageSquare } from "lucide-react";
import FavoritesList from "../../components/FavoritesList";

const UserProfile = ({ user, onLogout, onSetDrawerTitle }) => {
  const [showFavorites, setShowFavorites] = useState(false);

  const handleShowFavorites = () => {
    setShowFavorites(true);
    onSetDrawerTitle?.("Mis favoritos");
  };

  const handleBackToProfile = () => {
    setShowFavorites(false);
    onSetDrawerTitle?.(null);
  };


  if (showFavorites) {
    return (
      <div className="flex flex-col h-full">
        <button
          onClick={handleBackToProfile}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft size={16} /> Volver
        </button>
       <FavoritesList user={user} onBack={handleBackToProfile}  hideTitle={true}  />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Avatar + info */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-zinc-900 text-white flex items-center justify-center text-3xl font-bold mb-4">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-bold text-zinc-900">{user.name}</h2>
        <p className="text-sm text-zinc-400 mt-1">{user.email}</p>
        {user.phone && <p className="text-xs text-zinc-400 mt-0.5">{user.phone}</p>}
      </div>

      {/* Links */}
      <div className="space-y-2 mb-8">
        <a href="/mis-pedidos" className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center flex-shrink-0">
            <Package size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900">Mis Pedidos</p>
            <p className="text-xs text-zinc-400">Ver historial de compras</p>
          </div>
        </a>
    
        
        
        <a href="/perfil" className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center flex-shrink-0">
            <User size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900">Mi perfil</p>
            <p className="text-xs text-zinc-400">Editar datos personales</p>
          </div>
        </a>
        
        <button
           onClick={handleShowFavorites}
          className="w-full cursor-pointer flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center flex-shrink-0">
            <Heart size={18} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-zinc-900">Productos favoritos</p>
            <p className="text-xs text-zinc-400">Añade productos a tu lista de favoritos</p>
          </div>
        </button>

                <a href="/soporte" className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center flex-shrink-0">
            <MessageSquare size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900">Soporte</p>
            <p className="text-xs text-zinc-400">¿Necesitas ayuda? Cuéntanos tu problema.</p>
          </div>
        </a>
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-full border-2 border-zinc-200 text-zinc-700 font-bold text-sm hover:bg-zinc-50 transition-colors mt-auto"
      >
        <LogOut size={16} /> Cerrar sesión
      </button>
    </div>
  );
};

export default UserProfile;