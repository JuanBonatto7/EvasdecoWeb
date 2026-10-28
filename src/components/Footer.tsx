import Logo from './Logo';

export default function Footer() {
  const ig = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com';
  return (
    <footer className="footer">
      <div className="footer-wave" aria-hidden="true" />
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo size={72} />
          <p>Ropa, calzado y accesorios de segunda mano. Moda circular para cuidar el planeta.</p>
        </div>
        <div className="footer-col">
          <h4>Local</h4>
          <p>Presidente Perón Este 596<br />Río Cuarto, Córdoba</p>
        </div>
        <div className="footer-col">
          <h4>Horarios</h4>
          <p>Lunes a sábado<br />9:00 a 13:00 y 16:00 a 20:00</p>
        </div>
        <div className="footer-col">
          <h4>Seguinos</h4>
          <p><a href={ig} target="_blank" rel="noreferrer">Instagram</a></p>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Eva's Deco</div>
    </footer>
  );
}
