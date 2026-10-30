import { useRef, useState } from 'react';

export default function Carousel({ fotos, alt, fallback }: { fotos: string[]; alt: string; fallback: string }) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const total = fotos.length;

  const go = (n: number) => setIndex((i) => (i + n + total) % total);

  if (total === 0) {
    return (
      <div className="carousel">
        <div className="carousel-stage">
          <span className="photo-placeholder">{fallback}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="carousel"
      tabIndex={0}
      role="region"
      aria-roledescription="carrusel"
      aria-label={`Fotos de ${alt}`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
    >
      <div
        className="carousel-stage"
        onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (startX.current === null) return;
          const dx = e.changedTouches[0].clientX - startX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          startX.current = null;
        }}
      >
        <img key={fotos[index]} src={fotos[index]} alt={`${alt} · foto ${index + 1} de ${total}`} />

        {total > 1 && (
          <>
            <button className="carousel-arrow prev" onClick={() => go(-1)} aria-label="Foto anterior">‹</button>
            <button className="carousel-arrow next" onClick={() => go(1)} aria-label="Foto siguiente">›</button>
            <span className="carousel-count">{index + 1} / {total}</span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="carousel-dots">
          {fotos.map((f, i) => (
            <button
              key={f + i}
              className={`carousel-dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Ir a la foto ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
