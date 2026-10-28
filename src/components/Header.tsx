import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import { whatsappLink } from '../lib/products';

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/productos', label: 'Productos' },
  { to: '/local', label: 'Local' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <Logo size={64} />
        </Link>

        <nav className={`nav ${open ? 'nav-open' : ''}`} aria-label="Principal">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <a className="icon-btn" href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="Escribinos por WhatsApp">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.2A8.5 8.5 0 1 1 20 11.5Z" />
            </svg>
          </a>
          <button className="menu-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menú">
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
