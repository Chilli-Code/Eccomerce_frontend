import { useState, useEffect } from "react";
import { Send, ShoppingBag } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

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
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    if (!API_URL) return;
    fetch(`${API_URL}/settings`)
      .then(r => r.json())
      .then(data => { if (data?.siteContent) setFooter(data.siteContent.footer || {}); })
      .catch(() => {});
  }, []);

  const groups = footer?.groups || [
    { title: "PRODUCTOS", links: ["Celulares", "Accesorios", "Smartwatches", "Auriculares", "Cargadores"] },
    { title: "COMPRAR", links: ["Nuevos Lanzamientos", "Más Vendidos", "Ofertas", "Reacondicionados", "Garantía"] },
    { title: "AYUDA", links: ["Envíos", "Devoluciones", "Soporte", "Contáctanos"] },
  ];
  const footerSocial = footer?.socialLinks || [{ name: "Instagram", url: "#" }, { name: "Twitter / X", url: "#" }, { name: "YouTube", url: "#" }, { name: "TikTok", url: "#" }];
  const brandNames = footer?.brandNames || ["Apple", "Samsung", "Google", "Xiaomi", "OnePlus"];
  const legalLinks = footer?.legalLinks || [{ name: "Privacidad", url: "#" }, { name: "Términos", url: "#" }, { name: "Cookies", url: "#" }];

  return (
    <footer className="bg-zinc-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Columna 1 — Logo */}
        <div>
          <div className="flex items-center gap-2 text-3xl text-zinc-100 tracking-tight impact mb-4">
            <ShoppingBag size={28} className="text-zinc-50" />
            {footer?.brandName || "MOBILESHOP"}<sup className="-ml-1 text-base">®</sup>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {footer?.tagline || "Tecnología premium curada para quienes saben lo que quieren. Sin relleno — solo lo mejor."}
          </p>
        </div>

        {/* Columnas dinámicas de grupos */}
        {groups.slice(0, 2).map((g, i) => (
          <div key={i}>
            <FooterLinks title={g.title} links={g.links} />
            {i === 0 && <FooterLinks title="MARCAS" links={brandNames} />}
          </div>
        ))}

        {/* Columna 4 — Redes + Newsletter */}
        <div>
          <FooterLinks title="SÍGUENOS" links={footerSocial.map(s => s.name)} />

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
        <p>{footer?.copyright || "© 2025 MobileShop®. Todos los derechos reservados."}</p>
        <div className="flex gap-6">
          {legalLinks.map((l, i) => (
            <a key={i} href={l.url || "#"} className="hover:text-zinc-400 transition-colors">{l.name}</a>
          ))}
        </div>
      </div>

    </footer>
  );
};

export default Footer;