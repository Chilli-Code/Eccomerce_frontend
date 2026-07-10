import { useEffect, useRef, useState } from 'react'
import './App.css'
import gsap from "gsap";
import { Toaster } from "sileo";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"; // 👈 Agregar Navigate

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TaglineSection from './components/TaglineSection';
import ShopSection from './components/ShopSection';
import MissionSection from './components/Missionsection';
import Footer from './components/Footer';
import ProductPage from './page/Productpage';
import ShopPage from './page/ShopPage';
import LoaderHome from './components/LoaderHome';
import PhoneValuator from './page/Phonevaluator';
import ServicioTecnico from './page/Serviciotecnico';
import Contacto from './page/Contact';
import ServiciosSection from './components/ServciosSection';
import CartDrawer from './components/CartDrawer.jsx';
import { useCart } from './context/CartContext.jsx';
import { WishlistProvider } from "./context/WishlistContext";
import ProfilePage from './page/ProfilePage.jsx';
import MyOrdersPage from './page/MyOrdersPage';
import NotFoundPage from './page/NotFoundPage';
import SupportTicket from './page/SupportTicket';
import CheckoutPage from './page/CheckoutPage'; 

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathname = useRef(null);
  const noSmoothRoutes = ["/soporte","/perfil", "/checkout"];
  useEffect(() => {
    if (prevPathname.current === "/contact" && pathname !== "/contact") {
      window.location.href = pathname;
      return;
    }




    prevPathname.current = pathname;
    if (window.__smoother) { 
      window.__smoother.kill(); 
      window.__smoother = null; 
    }
    ScrollTrigger.getAll().forEach((t) => t.kill());
    window.scrollTo(0, 0);

    const id = setTimeout(() => {
      if (document.getElementById("smooth-content") && !noSmoothRoutes.includes(pathname)) {
        const smoother = ScrollSmoother.create({
          content: "#smooth-content", smooth: 1.8, effects: true, normalizeScroll: true,
        });
        window.__smoother = smoother;
        smoother.scrollTo(0, false);
      }
    }, 50);
    return () => clearTimeout(id);
  }, [pathname]);

  return null;
};

// HomePage
const HomePage = ({ onAuthSuccess, onLogout, user, onAddToCart }) => {
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  return (
    <>
      {loading && <LoaderHome onComplete={() => setLoading(false)} />}
      <HeroSection />
      <TaglineSection />
      <ShopSection
        onAddToCart={onAddToCart || addItem}
        onAuthSuccess={onAuthSuccess}
        onLogout={onLogout}
        user={user}
      />
      <ServiciosSection />
      <MissionSection />
      <Footer />
    </>
  );
};

const App = () => {
  const pageContainerRef = useRef(null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("store_user");
      return JSON.parse(stored || "null");
    }
    catch { return null; }
  });
 
  const { addItem } = useCart();

  const handleAuthSuccess = (u) => {
    setUser(u);
  };
  const handleLogout = () => {
    localStorage.removeItem("store_token");
    localStorage.removeItem("store_user");
    setUser(null);
  };

  useEffect(() => {
    const id = setTimeout(() => {
    const noSmoothRoutes = ["/soporte","/perfil", "/checkout"];

      if (document.getElementById("smooth-content") && !window.__smoother && !noSmoothRoutes.includes(pathname)) {
        const smoother = ScrollSmoother.create({
          content: "#smooth-content", smooth: 1.8, effects: true, normalizeScroll: true,
        });
        window.__smoother = smoother;
      }
    }, 50);
    return () => {
      clearTimeout(id);
      if (window.__smoother) { window.__smoother.kill(); window.__smoother = null; }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <ScrollToTop />
      <CartDrawer />
      <WishlistProvider user={user}>
        <Header
          pageContainerRef={pageContainerRef}
          user={user}
          onAuthSuccess={handleAuthSuccess}
          onLogout={handleLogout}
        />
        <div
          id="smooth-content"
          ref={pageContainerRef}
          className="min-h-screen bg-white antialiased pt-[110px]"
          style={{ transformOrigin: "right top", willChange: "transform" }}
        >
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={
              <HomePage
                onAuthSuccess={handleAuthSuccess}
                onLogout={handleLogout}
                user={user}
                onAddToCart={addItem}
              />}
            />
            <Route path="/producto/:id" element={
              <ProductPage
                user={user}
                onAuthSuccess={handleAuthSuccess}
                onLogout={handleLogout}
                onAddToCart={addItem}
              />
            } />
            <Route path="/products" element={
              <ShopPage
                user={user}
                onAuthSuccess={handleAuthSuccess}
                onLogout={handleLogout}
                onAddToCart={addItem}
              />
            } />
            <Route path="/phone_valuator" element={<><PhoneValuator /><Footer /></>} />
            <Route path="/servicio_tecnico" element={<><ServicioTecnico /><Footer /></>} />
            <Route path="/contact" element={<><Contacto /><Footer /></>} />


            <Route path="/perfil" element={
              user ? <ProfilePage /> : <Navigate to="/" replace />
            } />
            <Route path="/mis-pedidos" element={
              user ? <MyOrdersPage /> : <Navigate to="/" replace />
            } />
            <Route path="/soporte" element={
              user ? <SupportTicket /> : <Navigate to="/" replace />
            } />

            <Route path="/checkout" element={
  user ? <CheckoutPage /> : <Navigate to="/" replace />
} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>

        </div>
      </WishlistProvider>
    </BrowserRouter>
  );
};

export default App;