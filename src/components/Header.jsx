import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Menu, X, Search, Smartphone, ShoppingCart, User, ChevronDown } from "lucide-react";
import CartDrawer from "./CartDrawer";
import AuthDrawer from "./Authdrawer";
import SearchDrawer from "./Searchdrawe";
import gsap from "gsap";
import { Link, useLocation } from "react-router-dom";
import { getStoreSettings } from "../lib/api";
import { useCart } from "../context/CartContext";

const DEFAULT_NAV = [
  { name: "INICIO", href: "/", subMenu: [] },
  { name: "PRODUCTOS", href: "/products", subMenu: [] },
  { name: "SERVICIOS", href: "/#services", subMenu: [] },
  { name: "CONTACTO", href: "/contact", subMenu: [] },
];

const activeLinkClasses = "border-zinc-400 font-bold";

const Header = ({ pageContainerRef, user, onAuthSuccess, onLogout }) => {


  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isOpen = useRef(false);
  const isAnimating = useRef(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [storeName, setStoreName] = useState(["Mobile", "Shop"]);
  const [navLinks, setNavLinks] = useState(DEFAULT_NAV);
  const [promoBanner, setPromoBanner] = useState("Sign up and get 20% off for all new-season collections");
  const [socialLinks, setSocialLinks] = useState([{ name: "Instagram", url: "#" }, { name: "Twitter", url: "#" }, { name: "YouTube", url: "#" }]);

  const activeLink = navLinks.find((l) => l.href === pathname)?.name || "";

  useEffect(() => {
    getStoreSettings()
      .then(data => {
        if (data?.logoUrl) setLogoUrl(data.logoUrl);
        if (data?.storeName) {
          const words = data.storeName.trim().split(" ");
          if (words.length >= 2) {
            setStoreName([words.slice(0, -1).join(" "), words[words.length - 1]]);
          } else {
            setStoreName([data.storeName, ""]);
          }
        }
        const sc = data?.siteContent;
        if (sc) {
          if (sc.header?.promoBanner) setPromoBanner(sc.header.promoBanner);
          if (sc.header?.socialLinks?.length) setSocialLinks(sc.header.socialLinks);
          if (sc.navLinks?.length) setNavLinks(sc.navLinks);
        }
      })
      .catch(console.error);
  }, []);

  const menuOverlayRef = useRef(null);
  const menuContentRef = useRef(null);
  const menuIconOpenRef = useRef(null);
  const menuIconCloseRef = useRef(null);
  const logoTextRef = useRef(null);
  const logoIconRef = useRef(null);
  const linkRefs = useRef([]); // apuntan al div wrapper, NO al <Link>
  const headerRef = useRef(null);



  useLayoutEffect(() => {
    gsap.set(menuIconCloseRef.current, { opacity: 0, rotate: -45, scale: 0.5 });
    gsap.set(menuOverlayRef.current, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });
    gsap.set(menuContentRef.current, { x: -50, y: -30, scale: 1.2, rotate: -8, opacity: 0 });
    gsap.set(linkRefs.current, { y: "120%", opacity: 0.25 });
  }, []);

  const openMenu = () => {
    if (isAnimating.current || isOpen.current) return;
    isAnimating.current = true;
    setMenuOpen(true);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (window.__smoother) window.__smoother.paused(true);

    gsap.to(menuIconOpenRef.current, { opacity: 0, scale: 0.4, rotate: 90, duration: 0.25, ease: "power2.in" });
    gsap.to(menuIconCloseRef.current, { opacity: 1, scale: 1, rotate: 0, duration: 0.4, delay: 0.2, ease: "back.out(2)" });
    gsap.to([logoTextRef.current, logoIconRef.current], { color: "#ffffff", duration: 0.4, delay: 0.3 });
    gsap.to(menuOverlayRef.current, { clipPath: "polygon(0% 0%, 100% 0%, 100% 176%, 0% 100%)", duration: 1.25, ease: "power4.inOut" });
    gsap.to(menuContentRef.current, { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, duration: 1.25, ease: "power4.inOut" });
    gsap.to(linkRefs.current, {
      y: "0%", opacity: 1, duration: 1, delay: 0.75, stagger: 0.1, ease: "power3.out",
      onComplete: () => { isOpen.current = true; isAnimating.current = false; },
    });
  };

  const closeMenu = () => {
    if (isAnimating.current || !isOpen.current) return;
    if (window.__smoother) window.__smoother.paused(false);
    isAnimating.current = true;

    gsap.to(menuIconCloseRef.current, { opacity: 0, scale: 0.4, rotate: 90, duration: 0.25, ease: "power2.in" });
    gsap.to(menuIconOpenRef.current, { opacity: 1, scale: 1, rotate: 0, duration: 0.4, delay: 0.2, ease: "back.out(2)" });
    gsap.to([logoTextRef.current, logoIconRef.current], { color: "#18181b", duration: 0.4, delay: 0.5 });
    gsap.to(menuContentRef.current, { x: -50, y: -30, scale: 1.2, rotate: -8, opacity: 0, duration: 0.9, delay: 0.1, ease: "power4.inOut" });
    gsap.to(menuOverlayRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", duration: 0.9, delay: 0.15, ease: "power4.inOut",
      onComplete: () => {
        isOpen.current = false;
        isAnimating.current = false;
        setMenuOpen(false);
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        if (window.__smoother) window.__smoother.paused(false);
        gsap.set(linkRefs.current, { y: "120%", opacity: 0.25 });
      },
    });
  };

  const handleToggle = () => { if (!isOpen.current) openMenu(); else closeMenu(); };

  return (
    <>
      {/* OVERLAY MENU */}
      <div
        ref={menuOverlayRef}
        className="fixed top-0 left-0 w-full h-screen bg-zinc-900 z-[58]"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
      >
        <div
          ref={menuContentRef}
          className="flex flex-col justify-center min-h-full px-8 overflow-y-auto"
          style={{ transformOrigin: "left bottom", willChange: "transform, opacity", overflow: "hidden" }}
        >
          <div className="flex flex-col h-full gap-12 px-8">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <div key={link.name} style={{ overflow: "hidden", paddingBottom: "4px" }}>
                  {/*
                    ── CLAVE: ref en este div, NO en <Link> ──
                    GSAP anima el wrapper div.
                    React controla el <Link> sin interferencia.
                  */}
                  <div
                    ref={(el) => (linkRefs.current[i] = el)}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <a
                      href={link.href || "#"}
                      className="inline-block text-white no-underline"
                      style={{
                        fontSize: "clamp(2.2rem, 11vw, 4rem)",
                        fontWeight: 300,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.15,
                      }}
                    >
                      {link.name}
                    </a>
                  </div>
                </div>
              ))}
            </nav>

            <div className="flex-1" />

            <div className="border-t border-zinc-700 pb-2">
              <p className="text-zinc-500 text-xs tracking-widest uppercase mb-3">Follow us</p>
              <div className="flex gap-6">
                {socialLinks.map((s) => (
                  <a key={s.name} href={s.url || "#"} className="text-zinc-400 hover:text-white text-sm transition-colors">{s.name}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header
        ref={headerRef}
        className="w-full fixed top-0 left-0 right-0 z-[60]"
        style={{ willChange: "transform" }}
      >
        <div className="bg-zinc-900 text-white text-center text-xs py-2">
          {promoBanner}
        </div>
        <div className={`py-4 ${menuOpen ? "bg-zinc-900" : "bg-white"}`}>
          <div className={`max-w-7xl mx-auto px-4 flex justify-between items-center p-4 transition-colors duration-300 ${menuOpen ? "" : "border border-zinc-200 bg-white rounded-2xl"}`}>

            {/* Logo */}
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <div className="w-9 h-9 flex items-center justify-center overflow-hidden">
                  <img
                    src={logoUrl}
                    alt="logo"
                    className="w-full h-full object-contain"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                </div>
              ) : (
                <span ref={logoIconRef} style={{ color: "#18181b", display: "flex" }}>
                  <Smartphone size={24} />
                </span>
              )}

              <a
                href="/"
                ref={logoTextRef}
                className="text-2xl impact tracking-tight"
                style={{ color: "#18181b" }}
              >
                {storeName} <sup>®</sup>
              </a>
            </div>

            {/* Nav desktop */}
            {!menuOpen && (
              <div className="hidden md:flex space-x-4 text-sm font-medium text-zinc-600">
                {navLinks.map((link) => (
                  <div key={link.name} className="relative group">
                    {link.forceReload ? (
                      <a
                        href={link.href}
                        className={`flex items-center gap-1 hover:text-zinc-900 hover:font-bold duration-200 transition-all border border-transparent hover:border-zinc-400 p-2 rounded-full ${activeLink === link.name ? activeLinkClasses : ""}`}
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}

                        className={`flex items-center gap-1 hover:text-zinc-900 hover:font-bold duration-200 transition-all border border-transparent hover:border-zinc-400 p-2 rounded-full ${activeLink === link.name ? activeLinkClasses : ""}`}
                      >
                        {link.name}
                        {link.subMenu && <ChevronDown size={14} />}
                      </Link>
                    )}
                    {link.subMenu && (
                      <ul className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md border border-zinc-200 hidden group-hover:block min-w-[150px] z-50">
                        {link.subMenu.map((item) => (
                          <li key={item} className="px-4 py-2 hover:bg-zinc-100 cursor-pointer text-zinc-700 text-sm">{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Iconos */}
            <div className="flex items-center gap-3">
              <button onClick={() => setSearchOpen(true)} className={`${menuOpen ? "text-white" : "text-zinc-700"} hover:text-zinc-400 transition-colors`}><Search size={20} /></button>
              <button onClick={() => setAuthOpen(true)} className={`${menuOpen ? "text-white" : "text-zinc-700"} hover:text-zinc-400 transition-colors`}><User size={20} /></button>
              <button onClick={() => setCartOpen(true)} className={`relative transition-colors ${menuOpen ? "text-white" : "text-zinc-700"} hover:text-zinc-400`}>
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{count}</span>
              </button>
              <button onClick={handleToggle} className="md:hidden relative w-6 h-6 flex items-center justify-center">
                <span ref={menuIconOpenRef} className="absolute text-zinc-700" style={{ willChange: "transform, opacity" }}><Menu size={22} /></span>
                <span ref={menuIconCloseRef} className="absolute text-white" style={{ willChange: "transform, opacity", opacity: 0 }}><X size={22} /></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer />
      <AuthDrawer open={authOpen} onClose={() => setAuthOpen(false)} />
      <SearchDrawer open={searchOpen} user={user} onAuthRequired={() => setAuthOpen(true)} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;