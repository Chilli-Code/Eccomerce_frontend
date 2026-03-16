import { ShieldCheck, Truck } from "lucide-react";

const MissionSection = () => {
  return (
    <div className="py-20 text-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-4 items-center">


        <div className="relative h-80 lg:h-full min-h-[400px] bg-zinc-800 rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=85"
            alt="Tecnología premium"
            className="w-full h-full object-cover object-center saturate-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
          <button className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm text-zinc-900 text-sm font-semibold px-4 py-2 rounded-full uppercase hover:bg-white transition-colors">
            Saber más
          </button>
        </div>


        <div className="space-y-8 bg-zinc-900 rounded-3xl h-full lg:col-span-2 flex flex-col justify-between p-8 lg:p-16">
          <h2 className="text-5xl lg:text-6xl impact text-zinc-100 leading-tight">
            ESTAMOS <br /> REDEFINIENDO <br /> LA TECNOLOGÍA
          </h2>


          <div className="grid lg:grid-cols-2 gap-6 border-t border-zinc-700 pt-6">
            <div className="flex items-start space-x-4">
              <div className="size-10 shrink-0 flex items-center justify-center rounded-full bg-zinc-800">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-base uppercase font-bold mb-1 tracking-wide">
                  GARANTÍA TOTAL
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Cada dispositivo pasa por un control de calidad riguroso.
                  Vendemos solo tecnología verificada, con garantía oficial y
                  soporte post-venta real.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 border-t border-zinc-700 pt-6">
            <div className="flex items-start space-x-4">
              <div className="size-10 shrink-0 flex items-center justify-center rounded-full bg-zinc-800">
                <Truck size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-base uppercase font-bold mb-1 tracking-wide">
                  ENVÍO RÁPIDO
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Entrega a todo el país en 24–48 horas. Tu nuevo equipo
                  llega empacado con cuidado y listo para usar desde el
                  primer día.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MissionSection;