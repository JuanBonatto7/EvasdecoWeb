import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Carousel from '../components/Carousel';
import { formatPrecio, getProduct, whatsappLink } from '../lib/products';
import { MAX_FOTOS, type Product } from '../lib/types';

export default function ProductDetail() {
  const { slug = '' } = useParams();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    getProduct(slug).then(setProduct);
  }, [slug]);

  if (product === undefined) return <p className="container section muted">Cargando…</p>;
  if (product === null) {
    return (
      <section className="container section">
        <h1 className="page-title">Esta pieza ya no está</h1>
        <Link to="/productos" className="link-arrow">Volver a productos →</Link>
      </section>
    );
  }

  const fotos = product.fotos.slice(0, MAX_FOTOS);
  const disponible = product.status === 'disponible';

  return (
    <section className="container detail">
      <div className="detail-gallery">
        <Carousel fotos={fotos} alt={product.nombre} fallback={product.categoria} />
      </div>

      <div className="detail-info">
        <Link to="/productos" className="back">← Productos</Link>
        <h1>{product.nombre}</h1>
        <p className="detail-price">{formatPrecio(product.precio)}</p>
        <ul className="facts">
          {product.talle && <li><span>Talle</span>{product.talle}</li>}
          <li><span>Estado</span>{product.estado}</li>
          <li><span>Categoría</span>{product.categoria}</li>
        </ul>
        <span className={`badge badge-${product.status} badge-lg`}>{product.status === 'disponible' ? 'Disponible' : product.status === 'reservado' ? 'Reservado' : 'Vendido'}</span>

        <h3>Descripción</h3>
        <p className="description">{product.descripcion}</p>

        {disponible ? (
          <a className="btn btn-whatsapp" href={whatsappLink(product)} target="_blank" rel="noreferrer">
            Consultar por WhatsApp
          </a>
        ) : (
          <p className="muted">Esta pieza no está disponible en este momento. Mirá las demás publicaciones.</p>
        )}
        <p className="pickup">Disponible en el local · Presidente Perón Este 596</p>
      </div>
    </section>
  );
}
