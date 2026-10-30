import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Bunting from '../components/Bunting';
import { listProducts } from '../lib/products';
import type { Product } from '../lib/types';

const CATEGORIES = [
  { label: 'Ropa', icon: 'hanger' },
  { label: 'Calzado', icon: 'shoe' },
  { label: 'Mochilas', icon: 'bag' },
  { label: 'Accesorios', icon: 'tote' },
];

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    listProducts().then((all) => setFeatured(all.filter((p) => p.destacado).slice(0, 3)));
  }, []);

  return (
    <>
      <section className="hero">
        <Bunting />
        <div className="container hero-grid">
          <div className="hero-text">
            <p className="hero-kicker">¡Pasen y vean! Moda circular · Río Cuarto</p>
            <h1>
              Ropa, calzado y accesorios <span className="hero-mark">de segunda mano</span>
            </h1>
            <p className="hero-lead">Piezas únicas, elegidas una por una. Cuando se vende, se va: no hay dos iguales.</p>
            <Link to="/productos" className="btn btn-primary">Ver productos →</Link>
          </div>

          <div className="collage" aria-hidden="true">
            <span className="collage-note">¡nuevas piezas!</span>
            <div className="collage-card c1"><span>Ropa</span></div>
            <div className="collage-card c2"><span>Calzado</span></div>
            <div className="collage-card c3"><span>Accesorios</span></div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>Categorías</h2>
        </div>
        <div className="categories">
          {CATEGORIES.map((c) => (
            <Link key={c.label} to={`/productos?cat=${encodeURIComponent(c.label)}`} className="category">
              <span className="category-circle">
                <CategoryIcon name={c.icon} />
              </span>
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section container">
          <div className="section-head">
            <h2>Recién llegados</h2>
            <Link to="/productos" className="link-arrow">Ver todo →</Link>
          </div>
          <div className="grid grid-3">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <section className="visit">
        <div className="container visit-inner">
          <div>
            <h3>Pasá a verla en persona</h3>
            <p>Presidente Perón Este 596 · Lunes a sábado, 9 a 13 y 16 a 20.</p>
          </div>
          <Link to="/local" className="btn btn-ghost">Cómo llegar</Link>
        </div>
      </section>
    </>
  );
}

function CategoryIcon({ name }: { name: string }) {
  const common = { viewBox: '0 0 48 48', width: 40, height: 40, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'hanger':
      return <svg {...common}><path d="M24 14a4 4 0 1 0-4-4" /><path d="M24 14v4" /><path d="M24 18 6 30h36L24 18Z" /></svg>;
    case 'shoe':
      return <svg {...common}><path d="M6 30c8 0 10-6 14-8l6 4c4 2 6 2 10 2h6v6H6v-4Z" /><path d="M16 22l4 4" /></svg>;
    case 'bag':
      return <svg {...common}><rect x="12" y="16" width="24" height="26" rx="5" /><path d="M18 16v-4a6 6 0 0 1 12 0v4" /></svg>;
    default:
      return <svg {...common}><path d="M14 18h20l2 24H12l2-24Z" /><path d="M19 18v-3a5 5 0 0 1 10 0v3" /></svg>;
  }
}
