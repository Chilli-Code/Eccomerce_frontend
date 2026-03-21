import { useEffect, useRef, useState } from 'react'
import './App.css'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

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

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathname = useRef(null);

  useEffect(() => {
    if (prevPathname.current === "/contact" && pathname !== "/contact") {
      window.location.href = pathname;
      return;
    }
    prevPathname.current = pathname;
    if (window.__smoother) { window.__smoother.kill(); window.__smoother = null; }
    ScrollTrigger.getAll().forEach((t) => t.kill());
    window.scrollTo(0, 0);
    const id = setTimeout(() => {
      if (document.getElementById("smooth-content")) {
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

// ← HomePage ahora usa el carrito
const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  return (
    <>
      {loading && <LoaderHome onComplete={() => setLoading(false)} />}
      <HeroSection />
      <TaglineSection />
      <ShopSection onAddToCart={addItem} />
      <MissionSection />
      <ServiciosSection />
      <Footer />
    </>
  );
};

const App = () => {
  const pageContainerRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => {
      if (document.getElementById("smooth-content") && !window.__smoother) {
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
      <ScrollToTop />
      <CartDrawer />
      <Header pageContainerRef={pageContainerRef} />
      <div
        id="smooth-content"
        ref={pageContainerRef}
        className="min-h-screen bg-white antialiased pt-[110px]"
        style={{ transformOrigin: "right top", willChange: "transform" }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/producto/:id" element={<ProductPage />} />
          <Route path="/product" element={<ShopPage />} />
          <Route path="/phone_valuator" element={<><PhoneValuator /><Footer /></>} />
          <Route path="/servicio_tecnico" element={<><ServicioTecnico /><Footer /></>} />
          <Route path="/contact" element={<><Contacto /><Footer /></>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;