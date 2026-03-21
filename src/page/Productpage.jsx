import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getProductById } from "../lib/api.js";
import { useCart } from "../context/CartContext.jsx";
import Gallery from "../components/Gallery";
import ProductInfo from "../components/ProductInfo";
import RelatedProducts from "../components/RelatedProducts";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";

const BG_COLORS = ["#f5f5f5","#e8e4de","#1c1c1e","#d6e4f0","#e8f4e8","#2c2c2e"];

const ProductPage = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { addItem } = useCart();

  const [product,         setProduct]         = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [selectedColor,   setSelectedColor]   = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [added,           setAdded]           = useState(false);
const [showFullDesc, setShowFullDesc] = useState(false);
  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(p => setProduct(p))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;
const formattedDescription = product.description
  ?.replace(/\n\s*\n+/g, "\n") // quita saltos dobles
  ?.trim();
  // Normaliza specs — viene como JSON string del backend
  const specs = (() => {
    if (!product.specs) return [];
    try { return JSON.parse(product.specs); }
    catch { return []; }
  })();

  // Normaliza el producto para los componentes existentes
  const normalized = {
    ...product,
    img:     product.images?.[0] || "https://placehold.co/600x750?text=Sin+imagen",
    bg:      product.bgColor || BG_COLORS[0],
    tag:     product.badge  || null,
    brand:   product.brand  || "",
    price:   Number(product.price),
    specs,
    // Compatibilidad con campos del frontend original
    colors:      product.colors      || [],
    colorNames:  product.colorNames  || [],
    storage:     product.storage     || [],
    category:    product.categoryId  || "",
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
        <span className="text-zinc-900 font-semibold">{normalized.name}</span>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-12 items-start mx-5">
        <Gallery images={product.images?.length ? product.images : [normalized.img]} bg={normalized.bg} />
        <ProductInfo
          product={normalized}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedStorage={selectedStorage}
          setSelectedStorage={setSelectedStorage}
          added={added}
          handleAdd={handleAdd}
        />
      </div>
{/* DESCRIPCIÓN COMPLETA */}
{product.description && (
  <div className="max-w-7xl mx-auto px-4 mt-10">
    <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-5">
      Descripción
    </p>
<div className="max-w-3xl">
  <p
    className={`text-zinc-600 text-sm leading-6 whitespace-pre-line transition-all duration-300 ${
      showFullDesc ? "" : "line-clamp-[10]"
    }`}
  >
    {formattedDescription}
  </p>

  {/* BOTÓN */}
  {formattedDescription?.length > 300 && (
    <button
      onClick={() => setShowFullDesc(!showFullDesc)}
      className="mt-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
    >
      {showFullDesc ? "Ver menos ↑" : "Leer más →"}
    </button>
  )}
</div>
  </div>
)}
      {/* ESPECIFICACIONES */}
      {specs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-7 mb-10 pt-8">
          <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-5">Especificaciones</p>
          {specs.map(({ label, value }, i) => (
            <div key={label} className={`flex justify-between py-3.5 text-sm ${i < specs.length - 1 ? "border-b border-zinc-100" : ""}`}>
              <span className="text-zinc-400 font-medium">{label}</span>
              <span className="text-zinc-900 font-semibold text-right max-w-[55%]">{value}</span>
            </div>
          ))}
        </div>
      )}

      <Testimonials />
      <Footer />
    </div>
  );
};

export default ProductPage;