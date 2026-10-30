import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatPrecio } from '../lib/products';
import type { Product } from '../lib/types';

/* Carrusel horizontal de destacados: se desliza con el dedo o con las flechas. */
export default function FeaturedRow({ items }: { items: Product[] }) {
  const track = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    const el = track.current;
    if (!el || !el.firstElementChild) return;
    const step = (el.firstElementChild as HTMLElement).offsetWidth + 20;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  return (
    <div className="feat">
      <div className="feat-track" ref={track}>
        {items.map((p) => (
          <Link key={p.id} to={`/productos/${p.slug}`} className="feat-card">
            <div className="feat-photo">
              {p.fotos[0] ? <img src={p.fotos[0]} alt={p.nombre} loading="lazy" /> : <span className="photo-placeholder">{p.categoria}</span>}
              <span className="sticker">Destacado</span>
            </div>
            <div className="feat-info">
              <span className="vitrina-cat">{p.categoria}</span>
              <h3>{p.nombre}</h3>
              <p className="product-meta">{p.talle ? `Talle ${p.talle} · ` : ''}{p.estado}</p>
              <p className="product-price">{formatPrecio(p.precio)}</p>
            </div>
          </Link>
        ))}
      </div>

      {items.length > 1 && (
        <div className="feat-controls">
          <button onClick={() => scroll(-1)} aria-label="Anterior">‹</button>
          <button onClick={() => scroll(1)} aria-label="Siguiente">›</button>
        </div>
      )}
    </div>
  );
}
