import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { productData } from "../assets/data";
import Gallery from "../components/Gallery";
import ProductInfo from "../components/ProductInfo";
import RelatedProducts from "../components/RelatedProducts";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = productData.find((p) => p.id === id) || productData[0];

  const [selectedColor, setSelectedColor]     = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [added, setAdded]                     = useState(false);

  const handleAdd = () => { setAdded(true); setTimeout(() => setAdded(false), 2000); };
  const related = productData.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div key={product.id} className="min-h-screen bg-white">

      {/* BREADCRUMB */}
      <div className="max-w-7xl mt-2 mx-auto px-4 py-5 flex items-center gap-2 text-xs text-zinc-400">
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors font-medium">
          <ArrowLeft size={14} /> Tienda
        </button>
        <ChevronRight size={12} />
        <span>{product.category}</span>
        <ChevronRight size={12} />
        <span>{product.brand}</span>
        <ChevronRight size={12} />
        <span className="text-zinc-900 font-semibold">{product.name}</span>
      </div>

      {/* MAIN GRID */}
      <div key={product.id} className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-12 items-start mx-5">
        <Gallery images={product.images || [product.img]} bg={product.bg}  />
        <ProductInfo
          product={product}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedStorage={selectedStorage}
          setSelectedStorage={setSelectedStorage}
          added={added}
          handleAdd={handleAdd}
        />
      </div>

      {/* ESPECIFICACIONES */}
      <div className="max-w-7xl mx-auto px-4 mt-7 mb-10 pt-8">
        <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-5">Especificaciones</p>
        {product.specs?.map(({ label, value }, i) => (
          <div key={label} className={`flex justify-between py-3.5 text-sm ${i < product.specs.length - 1 ? "border-b border-zinc-100" : ""}`}>
            <span className="text-zinc-400 font-medium">{label}</span>
            <span className="text-zinc-900 font-semibold text-right max-w-[55%]">{value}</span>
          </div>
        ))}
      </div>

       <Testimonials />
      <RelatedProducts related={related} navigate={navigate} />
      <Footer />
    </div>
  );
};

export default ProductPage;