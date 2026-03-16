const RelatedProducts = ({ related, navigate }) => {
  return (
    <div className="border-t border-zinc-100 py-16 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-3xl impact text-zinc-900 mb-8">TAMBIÉN TE PUEDE INTERESAR</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((p) => (
            <div key={p.id}
              onClick={() => { navigate(`/producto/${p.id}`); window.scrollTo({ top: 0 }); }}
              className="flex flex-col cursor-pointer group">
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: p.bg }}>
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="text-xs text-zinc-400 tracking-widest uppercase">{p.brand}</p>
              <p className="impact text-xl text-zinc-900">{p.name}</p>
              <p className="text-sm text-zinc-500">${p.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;