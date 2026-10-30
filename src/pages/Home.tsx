import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Bunting from '../components/Bunting';
import { formatPrecio, listProducts } from '../lib/products';
import type { Product } from '../lib/types';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    listProducts().then((all) => {
      const destacados = all.filter((p) => p.destacado && p.status !== 'vendido');
      const pool = destacados.length ? destacados : all.filter((p) => p.status !== 'vendido');
      setFeatured(pool.slice(0, 3));
    });
  }, []);

  const [star, ...rest] = featured;

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

      {star && (
        <section className="section container">
          <div className="vitrina-head">
            <h2>Destacados de la semana</h2>
            <p className="hand-note">las piezas que más queremos mostrarte</p>
          </div>

          <div className="vitrina">
            <Link to={`/productos/${star.slug}`} className="vitrina-star">
              <div className="vitrina-photo">
                {star.fotos[0] ? <img src={star.fotos[0]} alt={star.nombre} /> : <span className="photo-placeholder">{star.categoria}</span>}
                <span className="sticker">Destacado</span>
              </div>
              <PriceTag nombre={star.nombre} precio={formatPrecio(star.precio)} meta={star.talle ? `Talle ${star.talle}` : star.estado} />
            </Link>

            <div className="vitrina-side">
              {rest.map((p) => (
                <Link key={p.id} to={`/productos/${p.slug}`} className="vitrina-small">
                  <div className="vitrina-small-photo">
                    {p.fotos[0] ? <img src={p.fotos[0]} alt={p.nombre} /> : <span className="photo-placeholder">{p.categoria}</span>}
                  </div>
                  <div className="vitrina-small-info">
                    <span className="vitrina-cat">{p.categoria}</span>
                    <h3>{p.nombre}</h3>
                    <p className="product-meta">{p.talle ? `Talle ${p.talle} · ` : ''}{p.estado}</p>
                    <p className="product-price">{formatPrecio(p.precio)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

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

function PriceTag({ nombre, precio, meta }: { nombre: string; precio: string; meta: string }) {
  return (
    <div className="price-tag">
      <span className="price-hole" />
      <span className="price-meta">{meta}</span>
      <strong>{nombre}</strong>
      <span className="price-value">{precio}</span>
    </div>
  );
}
