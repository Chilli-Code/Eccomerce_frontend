import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, ChevronDown } from "lucide-react";
import { getProductById } from "../lib/api.js";
import { useCart } from "../context/CartContext.jsx";
import Gallery from "../components/Gallery";
import ProductInfo from "../components/ProductInfo";
import RelatedProducts from "../components/RelatedProducts";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import AuthDrawer from "../components/Authdrawer.jsx";
import DOMPurify from 'dompurify';

const BG_COLORS = ["#f5f5f5", "#e8e4de", "#1c1c1e", "#d6e4f0", "#e8f4e8", "#2c2c2e"];

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'mark',
    'h1', 'h2', 'h3', 'h4',
    'ul', 'ol', 'li',
    'a', 'span',
    'blockquote',
    'hr'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  ALLOWED_STYLES: [
    'color', 'background-color', 'background',
    'font-weight', 'font-style', 'text-decoration',
    'text-align', 'margin', 'padding'
  ],
  ALLOWED_URI_REGEXP: /^(https?|mailto|tel):/i,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus'],
};

// 👈 COMPONENTE ACORDEÓN
const AccordionSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-zinc-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left group"
      >
        <span className="text-sm font-bold tracking-widest uppercase text-zinc-900">
          {title}
        </span>
        <ChevronDown
          size={18}
          className={`text-zinc-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[2000px] opacity-100 pb-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-zinc-600 text-sm leading-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const ProductPage = ({ user, onAddToCart, onAuthSuccess, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [added, setAdded] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(p => setProduct(p))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

const handleAdd = () => {
  if (!user) {
    setAuthOpen(true);
    return;
  }
  // 👈 Pasar la variante seleccionada al carrito
  addItem(product, selectedVariant);
  setAdded(true);
};

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  const sanitizedDescription = product.description
    ? DOMPurify.sanitize(product.description, SANITIZE_CONFIG)
    : "";

  const formattedDescription = sanitizedDescription
    ?.replace(/\n\s*\n+/g, "\n")
    ?.trim();

  const specs = (() => {
    if (!product.specs) return [];
    try { return JSON.parse(product.specs); }
    catch { return []; }
  })();

  const normalized = {
    ...product,
    img: product.images?.[0] || "https://placehold.co/600x750?text=Sin+imagen",
    bg: product.bgColor || BG_COLORS[0],
    tag: product.badge || null,
    brand: product.brand || "",
    price: Number(product.price),
    specs,
    colors: product.colors || [],
    colorNames: product.colorNames || [],
    storage: product.storage || [],
    category: product.categoryId || "",
  };

  return (
    <div key={product.id} className="min-h-screen bg-white">
      {/* BREADCRUMB */}
      <div className="max-w-7xl mt-2 mx-auto px-4 py-5 flex items-center gap-2 text-xs text-zinc-400">
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors font-medium">
          <ArrowLeft size={14} /> Tienda
        </button>
        <ChevronRight size={12} />
        <span>{normalized.brand}</span>
        <ChevronRight size={12} />
        <span title={normalized.name} className="text-zinc-900 font-semibold">{normalized.name}</span>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-12 items-start mx-5">
        <Gallery images={product.images?.length ? product.images : [normalized.img]} bg={normalized.bg} />
        <ProductInfo
          key={user?.id || 'no-user'}
          product={normalized}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedStorage={selectedStorage}
          setSelectedStorage={setSelectedStorage}
          added={added}
          handleAdd={handleAdd}
          onAuthRequired={() => setAuthOpen(true)}
          user={user}
        />
      </div>

      {/* SECCIÓN DE ACORDEONES - como en ON Cloudrunner */}
      <div className="max-w-7xl mx-auto px-4 mt-12 mb-10">
        <div className="border-t border-zinc-200 pt-2">
          
          {/* Descripción principal */}
          {sanitizedDescription && (
            <AccordionSection title="DESCRIPCIÓN" defaultOpen={true}>
              <div
                className="product-description"
                dangerouslySetInnerHTML={{ __html: formattedDescription }}
              />
            </AccordionSection>
          )}
        </div>

      {/* ESPECIFICACIONES - SIN ACORDEÓN */}
      <p className="text-sm mt-10 font-bold text-left tracking-widest uppercase text-zinc-900 mb-2">Especificaciones</p>
      {specs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-3 mb-10 pt-2">
          {specs.map(({ label, value }, i) => (
            <div key={label} className={`flex justify-between py-3.5 text-sm ${i < specs.length - 1 ? "border-b border-zinc-100" : ""}`}>
              <span className="text-zinc-400 font-medium">{label}</span>
              <span className=" whitespace-nowrap text-right max-w-[55%]">{value}</span>
            </div>
          ))}
        </div>
      )}
      </div>

      <Testimonials />
      <Footer />
      <AuthDrawer
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={onAuthSuccess}
      />
    </div>
  );
};

export default ProductPage;