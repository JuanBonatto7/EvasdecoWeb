import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container section">
      <h1 className="page-title">Página no encontrada</h1>
      <Link to="/" className="link-arrow">Volver al inicio →</Link>
    </section>
  );
}
