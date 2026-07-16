const BASE = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const token = localStorage.getItem("store_token");
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

// ── Tienda ────────────────────────────────────────
export const getProducts      = (params = {}) => request(`/products?${new URLSearchParams(params)}`);
export const getCategories    = ()            => request("/categories");
export const getProductById   = (id)          => request(`/products/${id}`);
export const getPageBySlug    = (slug)        => request(`/pages/${slug}`);
export const getStoreSettings = ()            => request("/settings").catch(() => null);

// ── Auth storefront ───────────────────────────────
export const storeAuth = {
  checkEmail:       (email)              => request("/storefront/check-email",      { method: "POST", body: JSON.stringify({ email }) }),
  login:            (email, password)    => request("/storefront/login",             { method: "POST", body: JSON.stringify({ email, password }) }),
  sendCode:         (data)              => request("/storefront/send-code",          { method: "POST", body: JSON.stringify(data) }),
  verifyCode:       (email, code)       => request("/storefront/verify-code",        { method: "POST", body: JSON.stringify({ email, code }) }),
  sendVerification: (email)             => request("/storefront/send-verification",  { method: "POST", body: JSON.stringify({ email }) }),
  setPassword:      (email, password, code) => request("/storefront/set-password",  { method: "POST", body: JSON.stringify({ email, password, code }) }),
  me:               ()                  => request("/storefront/me"),
};

// ── Wishlist (favoritos) ──────────────────────────
export const wishlistApi = {
  list: () => request("/wishlist"),
  add: (productId) => request("/wishlist", { method: "POST", body: JSON.stringify({ productId }) }),
  remove: (productId) => request(`/wishlist/${productId}`, { method: "DELETE" }),
};

export const customerApi = {
  getProfile: () => request("/customers/profile"),
  updateProfile: (data) => request("/customers/profile", { method: "PUT", body: JSON.stringify(data) }),
  sendEmailCode: (newEmail) => request("/customers/send-email-code", { method: "POST", body: JSON.stringify({ newEmail }) }),
  verifyEmailCode: (code) => request("/customers/verify-email-code", { method: "POST", body: JSON.stringify({ code }) }),
};

// ── Direcciones ──────────────────────────────
export const addressApi = {
  list: () => request("/addresses"),
  create: (data) => request("/addresses", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/addresses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/addresses/${id}`, { method: "DELETE" }),
};

// ── Métodos de pago ──────────────────────────
export const paymentApi = {
  list: () => request("/payment-methods"),
  create: (data) => request("/payment-methods", { method: "POST", body: JSON.stringify(data) }),
  delete: (id) => request(`/payment-methods/${id}`, { method: "DELETE" }),
};

// ── Cupones ──────────────────────────────
export const couponsApi = {
  validate: (code, cartTotal) => request("/coupons/validate", { 
    method: "POST", 
    body: JSON.stringify({ code, cartTotal }) 
  }),
};

// ── Tickets (soporte) ──────────────────────────────
export const ticketsApi = {
  create: (data) => request("/tickets", { method: "POST", body: JSON.stringify(data) }),
  list: () => request("/tickets"),
  get: (id) => request(`/tickets/${id}`),
  addMessage: (id, message) => request(`/tickets/${id}/messages`, { 
    method: "POST", 
    body: JSON.stringify({ sender: "customer", message }) 
  }),
  getMessages: (id) => request(`/tickets/${id}/messages`),
};

// ── Órdenes ─────────────────────────────────
export const ordersApi = {
  list: (params = {}) => request(`/orders?${new URLSearchParams(params)}`),
  get: (id) => request(`/orders/${id}`),
  create: (data) => request("/orders", { method: "POST", body: JSON.stringify(data) }),
  updateStatus: (id, status) => request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  createPaymentIntent: (data) => request("/orders/create-payment-intent", { 
    method: "POST", 
    body: JSON.stringify(data) 
  }),
  createBoldCheckout: (data) => request("/orders/create-bold-checkout", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  confirmBoldPayment: (orderId) => request("/orders/confirm-bold-payment", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  }),
  getUserOrders: (userId, params = {}) => request(`/orders/user/${userId}?${new URLSearchParams(params)}`),
  cancel: (orderId) => request(`/orders/${orderId}/cancel`, { method: "PUT" }),
};

// 👈 AGREGAR ESTO
// ── Settings (configuración de la tienda) ─────────
export const settingsApi = {
  get: () => request("/settings"),
  update: (data) => request("/settings", { method: "PUT", body: JSON.stringify(data) }),
};