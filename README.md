# MobileShop

Tienda online de dispositivos móviles construida con React + Vite.

## Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Animaciones**: GSAP (ScrollTrigger, ScrollSmoother)
- **Estilos**: Tailwind CSS
- **Icons**: Lucide React
- **Estado**: Context API (Carrito de compras)

## Funcionalidades

- Catálogo de productos con paginación
- Carrito de compras con drawer
- Filtro por categorías
- Página de detalle de producto
- Animaciones de scroll suaves
- Diseño responsive
- Configuración dinámica de tienda (logo, nombre)

## Scripts

```bash
npm install    # Instalar dependencias
npm run dev    # Iniciar desarrollo
npm run build  # Build producción
```

## Estructura

```
src/
├── components/       # Componentes reutilizables
│   ├── ui/          # Componentes pequeños
│   └── ...          # Secciones y páginas
├── context/         # Contextos (Carrito)
├── lib/             # Utilidades y API
└── page/            # Páginas principales
```

## Variables de Entorno

```env
VITE_API_URL=https://api.example.com
```
