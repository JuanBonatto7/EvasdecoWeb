import { Link } from 'react-router-dom';
import type { Product, ProductStatus } from '../lib/types';
import { formatPrecio } from '../lib/products';

const STATUS_LABEL: Record<ProductStatus, string> = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido',
};

export default function ProductCard({ product }: { product: Product }) {
  const foto = product.fotos[0];
  return (
    <Link to={`/productos/${product.slug}`} className={`product-card status-${product.status}`}>
      <div className="product-photo">
        {foto ? <img src={foto} alt={product.nombre} loading="lazy" /> : <span className="photo-placeholder">{product.categoria}</span>}
        <span className={`badge badge-${product.status}`}>{STATUS_LABEL[product.status]}</span>
      </div>
      <div className="product-info">
        <h3>{product.nombre}</h3>
        <p className="product-meta">
          {product.talle ? `Talle ${product.talle} · ` : ''}{product.estado}
        </p>
        <p className="product-price">{formatPrecio(product.precio)}</p>
      </div>
    </Link>
  );
}
