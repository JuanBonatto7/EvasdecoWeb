export default function Logo({ size = 96 }: { size?: number }) {
  return (
    <div className="logo" style={{ width: size, height: size }} aria-label="Eva's Deco">
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
        <circle cx="60" cy="60" r="56" fill="none" stroke="var(--sage)" strokeWidth="6" strokeDasharray="300 40" strokeLinecap="round" transform="rotate(-30 60 60)" />
      </svg>
      <div className="logo-text">
        <span className="logo-name">Eva's Deco</span>
        <span className="logo-sub">Moda circular</span>
      </div>
    </div>
  );
}
