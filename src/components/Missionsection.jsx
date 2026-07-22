import { useState, useEffect } from "react";
import { ShieldCheck, Truck } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const MissionSection = () => {
  const [heading, setHeading] = useState("");
  const [image, setImage] = useState("");
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    if (!API_URL) return;
    fetch(`${API_URL}/storefront/widget-status/homepage-mission?_=${Date.now()}`, { cache: "no-cache" })
      .then(r => r.json())
      .then(data => {
        if (data.active && data.content) {
          const m = data.content;
          if (m.heading) setHeading(m.heading);
          if (m.image) setImage(m.image);
          if (m.features?.length) setFeatures(m.features);
        }
      })
      .catch(() => {});
  }, []);

  const displayHeading = heading || "ESTAMOS REDEFINIENDO LA TECNOLOGÍA";
  const displayImage = image || "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=85";
  const displayFeatures = features.length ? features : [
    { title: "GARANTÍA TOTAL", description: "Cada dispositivo pasa por un control de calidad riguroso. Vendemos solo tecnología verificada, con garantía oficial y soporte post-venta real." },
    { title: "ENVÍO RÁPIDO", description: "Entrega a todo el país en 24–48 horas. Tu nuevo equipo llega empacado con cuidado y listo para usar desde el primer día." },
  ];

  return (
    <div className="py-20 text-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-4 items-center">


        <div className="relative h-80 lg:h-full min-h-[400px] bg-zinc-800 rounded-3xl overflow-hidden">
          <img
            src={displayImage}
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
            {displayHeading.split("<br />").join("\n").split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h2>

          {displayFeatures.map((feat, i) => (
            <div key={i} className="grid lg:grid-cols-2 gap-6 border-t border-zinc-700 pt-6">
              <div className="flex items-start space-x-4">
                <div className="size-10 shrink-0 flex items-center justify-center rounded-full bg-zinc-800">
                  {i === 0 ? <ShieldCheck size={18} className="text-white" /> : <Truck size={18} className="text-white" />}
                </div>
                <div>
                  <h3 className="text-base uppercase font-bold mb-1 tracking-wide">
                    {feat.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default MissionSection;