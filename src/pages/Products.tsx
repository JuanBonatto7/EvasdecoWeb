import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryIcon, { CATEGORY_ICON } from '../components/CategoryIcon';
import { listProducts, shareCatalog } from '../lib/products';
import type { Product } from '../lib/types';

const TODOS = 'Todos';
const CATS = [TODOS, 'Ropa', 'Calzado', 'Mochilas', 'Accesorios', 'Yerbas', 'Varios'];
const PER_PAGE = 6;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const cat = params.get('cat') ?? TODOS;

  useEffect(() => {
    listProducts().then((p) => { setItems(p); setLoading(false); });
  }, []);

  useEffect(() => setPage(1), [cat]);

  const filtered = useMemo(
    () => (cat === TODOS ? items : items.filter((p) => p.categoria === cat)),
    [items, cat],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <section className="container section">
      <div className="section-head">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="muted">{filtered.length} piezas disponibles</p>
        </div>
        <button className="btn btn-whatsapp-outline" onClick={shareCatalog}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" />
            <path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" />
          </svg>
          Compartir catálogo
        </button>
      </div>

      <div className="cat-row" role="tablist" aria-label="Categorías">
        {CATS.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={c === cat}
            className={`cat-item ${c === cat ? 'cat-active' : ''}`}
            onClick={() => setParams(c === TODOS ? {} : { cat: c })}
          >
            <span className="cat-circle">
              <CategoryIcon name={CATEGORY_ICON[c]} />
            </span>
            <span className="cat-label">{c}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="muted">Cargando…</p>
      ) : visible.length === 0 ? (
        <p className="empty">Todavía no hay piezas en esta categoría. Volvé pronto.</p>
      ) : (
        <div className="grid grid-3">
          {visible.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {pages > 1 && (
        <nav className="pagination" aria-label="Paginación">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Anterior">‹</button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button key={n} className={n === page ? 'active' : ''} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} aria-label="Siguiente">›</button>
        </nav>
      )}
    </section>
  );
}
