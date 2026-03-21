const BASE = import.meta.env.VITE_API_URL;

async function request(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export const getProducts    = (params = {}) => request(`/products?${new URLSearchParams(params)}`);
export const getCategories  = ()            => request("/categories");
export const getProductById = (id)          => request(`/products/${id}`);
export const getPageBySlug  = (slug)        => request(`/pages/${slug}`);
export const getStoreSettings = ()          => request("/settings").catch(() => null);