const COLORS = ['#e8b865', '#d9735b', '#8fa886', '#3e5a3b', '#8fb3c9', '#e7a6a0', '#c98f7a'];
const FLAGS = 18;
const W = 1200;

/* Curva de la guirnalda: cuadrática con P0=(0,4), P1=(600,82), P2=(1200,4). */
function curveY(t: number) {
  return (1 - t) * (1 - t) * 4 + 2 * (1 - t) * t * 82 + t * t * 4;
}

export default function Bunting() {
  const flags = Array.from({ length: FLAGS }, (_, i) => {
    const t = (i + 0.5) / FLAGS;
    const x = W * t;
    const y = curveY(t);
    return { x, y, color: COLORS[i % COLORS.length], delay: `${(i % 6) * -0.6}s` };
  });

  return (
    <svg className="bunting" viewBox={`0 0 ${W} 110`} preserveAspectRatio="none" aria-hidden="true">
      <path d={`M0 4 Q600 82 ${W} 4`} fill="none" stroke="#6b5f4a" strokeWidth="2" />
      {flags.map((f, i) => (
        <path
          key={i}
          className="flag"
          style={{ animationDelay: f.delay }}
          d={`M${(f.x - 26).toFixed(1)} ${f.y.toFixed(1)} L${(f.x + 26).toFixed(1)} ${f.y.toFixed(1)} L${f.x.toFixed(1)} ${(f.y + 58).toFixed(1)} Z`}
          fill={f.color}
        />
      ))}
    </svg>
  );
}
