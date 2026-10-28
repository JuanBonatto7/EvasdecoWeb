# Eva's Deco

Sitio web del local de ropa, calzado y accesorios de segunda mano en Río Cuarto.
Catálogo de publicaciones individuales, panel admin para cargar productos y venta por WhatsApp.

## Stack

- React + TypeScript + Vite
- Supabase (base de datos, fotos y login del admin por email)
- Netlify (deploy)

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completar con los datos de Supabase
npm run dev
```

Sin `.env.local` la web funciona igual con productos de ejemplo, para revisar el diseño.

## Supabase

1. Crear un proyecto en Supabase.
2. Ejecutar `supabase/schema.sql` en el SQL Editor.
3. En Authentication, crear el usuario admin (email y contraseña) y desactivar el registro público.
4. Copiar la URL y la anon key a `.env.local`.

## Deploy en Netlify

- Conectar el repo desde Netlify. `netlify.toml` ya define build y redirects.
- Cargar en Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
  `VITE_WHATSAPP_NUMBER`, `VITE_INSTAGRAM_URL`.

## Estructura

- `src/pages` — Inicio, Productos, Detalle, Local, Panel admin
- `src/components` — Header, Footer, tarjetas de producto, logo
- `src/lib` — cliente de Supabase, consultas de productos, auth
- `src/styles/index.css` — paleta y componentes visuales
