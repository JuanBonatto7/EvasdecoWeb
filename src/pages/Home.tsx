import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Bunting from '../components/Bunting';
import FeaturedRow from '../components/FeaturedRow';
import { listProducts } from '../lib/products';
import type { Product } from '../lib/types';

const MAX_DESTACADOS = 5;

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    listProducts().then((all) => {
      const destacados = all.filter((p) => p.destacado && p.status !== 'vendido');
      const pool = destacados.length ? destacados : all.filter((p) => p.status !== 'vendido');
      setFeatured(pool.slice(0, MAX_DESTACADOS));
    });
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

      {featured.length > 0 && (
        <section className="section container">
          <div className="vitrina-head">
            <h2>Destacados de la semana</h2>
            <p className="hand-note">las piezas que más queremos mostrarte</p>
          </div>

          <FeaturedRow items={featured} />

          <div className="vitrina-cta">
            <Link to="/productos" className="btn btn-ghost">Ver todas las piezas →</Link>
          </div>
        </section>
      )}

      <section className="visit">
        <div className="container visit-inner">
          <div>
            <h3>Pasá a verla en persona</h3>
            <p>Presidente Perón Este 596 · Lunes a sábado, 9 a 13 y 16 a 20.</p>
          </div>
          <Link to="/local" className="btn btn-kraft">Cómo llegar</Link>
        </div>
      </section>
    </>
  );
}
