import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productData, filterButtonsData } from "../assets/data";
import ProductCard from "./ui/ProductCard";

const ShopSection = ({ onAddToCart }) => {
  const [activeFilter, setActiveFilter] = useState("TODOS");
  const navigate = useNavigate();

  const filtered = activeFilter === "TODOS"
    ? productData
    : productData.filter((p) => p.category === activeFilter);

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex flex-col sm:flex-row justify-between md:items-center mb-10">
          <h2 className="text-5xl impact text-zinc-900 mb-4 sm:mb-0">
            ÚLTIMOS <br /> PRODUCTOS
          </h2>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {filterButtonsData.map((btn) => (
              <button key={btn.name} onClick={() => setActiveFilter(btn.name)}
                className={`${activeFilter === btn.name ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"} cursor-pointer md:text-base impact px-4 py-2 rounded-full hover:bg-zinc-900 uppercase hover:text-white transition-all duration-200 ease-in group text-nowrap`}>
                {btn.name}
                <sub className={`${activeFilter === btn.name ? "text-zinc-400" : "text-zinc-500"} text-xs group-hover:text-zinc-400 ml-0.5`}>
                  {btn.count}
                </sub>
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={(id) => navigate(`/producto/${id}`)}
              onAdd={onAddToCart}
            />
          ))}
        </div>

      </div>

      <div className="flex justify-center items-center">
        <a href="/product" className="mt-8 w-xs bg-zinc-900 text-white uppercase p-4 flex items-center justify-center rounded-full font-bold tracking-widest text-sm cursor-pointer">
          VER MAS
        </a>
      </div>
    </div>
  );
};

export default ShopSection;