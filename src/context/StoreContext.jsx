import { createContext, useContext, useEffect, useState } from "react";
import { getStoreSettings } from "../lib/api.js";

const StoreContext = createContext(null);

// Secciones disponibles con su orden por defecto
export const DEFAULT_SECTIONS = [
  { id: "hero",       label: "Hero Banner",        active: true  },
  { id: "tagline",    label: "Tagline",             active: true  },
  { id: "featured",   label: "Productos destacados",active: true  },
  { id: "categories", label: "Categorías",          active: true  },
  { id: "mission",    label: "Misión",              active: true  },
  { id: "services",   label: "Servicios",           active: true  },
  { id: "newsletter", label: "Newsletter",          active: false },
];

export function StoreProvider({ children }) {
  const [settings,  setSettings]  = useState(null);
  const [sections,  setSections]  = useState(DEFAULT_SECTIONS);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    getStoreSettings()
      .then(data => {
        setSettings(data);
        // Si el admin guardó secciones personalizadas las aplica
        if (data.sections?.length) {
          setSections(prev =>
            prev.map(s => ({
              ...s,
              active: data.sections.includes(s.id),
            }))
          );
        }
      })
      .catch(() => {}) // usa defaults si falla
      .finally(() => setLoading(false));
  }, []);

  const isSectionActive = (id) => sections.find(s => s.id === id)?.active ?? true;

  return (
    <StoreContext.Provider value={{ settings, sections, isSectionActive, loading }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);