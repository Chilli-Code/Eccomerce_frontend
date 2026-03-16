import { Send, ShoppingBag } from "lucide-react";

const productLinks = {
  title: "PRODUCTOS",
  links: ["Celulares", "Accesorios", "Smartwatches", "Auriculares", "Cargadores"],
};

const buyingLinks = {
  title: "COMPRAR",
  links: ["Nuevos Lanzamientos", "Más Vendidos", "Ofertas", "Reacondicionados", "Garantía"],
};

const helpLinks = {
  title: "AYUDA",
  links: ["Envíos", "Devoluciones", "Soporte", "Contáctanos"],
};

const socialLinks = {
  title: "SÍGUENOS",
  links: ["Instagram", "Twitter / X", "YouTube", "TikTok"],
};

const FooterLinks = ({ title, links }) => (
  <div className="mb-8">
    <h4 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-4">
      {title}
    </h4>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link}>
          <a
            href="#"
            className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
          >
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Columna 1 — Logo */}
        <div>
          <div className="flex items-center gap-2 text-3xl text-zinc-100 tracking-tight impact mb-4">
            <ShoppingBag size={28} className="text-zinc-50" />
            MOBILESHOP<sup className="-ml-1 text-base">®</sup>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Tecnología premium curada para quienes saben lo que quieren.
            Sin relleno — solo lo mejor.
          </p>
        </div>

        {/* Columna 2 — Productos + Marcas */}
        <div>
          <FooterLinks {...productLinks} />
          <FooterLinks title="MARCAS" links={["Apple", "Samsung", "Google", "Xiaomi", "OnePlus"]} />
        </div>

        {/* Columna 3 — Comprar + Ayuda */}
        <div>
          <FooterLinks {...buyingLinks} />
          <FooterLinks {...helpLinks} />
        </div>

        {/* Columna 4 — Redes + Newsletter */}
        <div>
          <FooterLinks {...socialLinks} />

          <h4 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-4">
            ÚNETE A LA COMUNIDAD
          </h4>

          <form className="flex border border-zinc-600/60 rounded-full p-1 w-full max-w-xs">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 bg-transparent px-4 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none"
            />
            <button
              type="submit"
              className="aspect-square text-white p-2 cursor-pointer rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors duration-200"
              aria-label="Suscribirse"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 border-t border-zinc-800 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
        <p>© 2025 MobileShop®. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-zinc-400 transition-colors">Privacidad</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Términos</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Cookies</a>
        </div>
      </div>

    </footer>
  );
};

export default Footer;