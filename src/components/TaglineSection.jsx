import { Zap } from "lucide-react";

const TaglineSection = () => {
  return (
    <div className="bg-white py-20">
      <div className="relative max-w-5xl mx-auto px-4 text-center">

        {/* Imagen flotante — teléfono izquierda arriba */}
        <div className="absolute hidden md:block size-20 rounded-full overflow-hidden left-80 -top-10">
          <img
            src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Titular */}
        <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-zinc-900 tracking-tight">
          Tecnología que se adapta a tu vida,{" "}
          <div className="border w-fit inline-flex items-center border-zinc-600 rounded-full pr-4 pl-2 pb-1">
            <Zap className="inline-block text-yellow-500" size={40} />
            al instante
          </div>
          , elegida <br /> por quienes saben lo que quieren — sin compromisos, <br /> solo lo mejor en la palma de tu mano
        </h2>

        {/* Imagen flotante — auriculares izquierda abajo */}
        <div className="absolute hidden md:block size-20 rounded-full overflow-hidden left-64 -bottom-4">
          <img
            src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Imagen flotante — smartwatch derecha abajo */}
        <div className="absolute hidden md:block size-20 rounded-full overflow-hidden right-64 bottom-0">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default TaglineSection;