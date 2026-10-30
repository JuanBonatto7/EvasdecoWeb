export const CATEGORY_ICON: Record<string, string> = {
  Todos: 'grid',
  Ropa: 'hanger',
  Calzado: 'shoe',
  Mochilas: 'bag',
  Accesorios: 'tote',
  Yerbas: 'leaf',
  Varios: 'box',
};

export default function CategoryIcon({ name }: { name: string }) {
  const common = { viewBox: '0 0 48 48', width: 36, height: 36, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  switch (name) {
    case 'grid':
      return <svg {...common}><rect x="10" y="10" width="13" height="13" rx="3" /><rect x="25" y="10" width="13" height="13" rx="3" /><rect x="10" y="25" width="13" height="13" rx="3" /><rect x="25" y="25" width="13" height="13" rx="3" /></svg>;
    case 'hanger':
      return <svg {...common}><path d="M24 14a4 4 0 1 0-4-4" /><path d="M24 14v4" /><path d="M24 18 6 30h36L24 18Z" /></svg>;
    case 'shoe':
      return <svg {...common}><path d="M6 30c8 0 10-6 14-8l6 4c4 2 6 2 10 2h6v6H6v-4Z" /><path d="M16 22l4 4" /></svg>;
    case 'bag':
      return <svg {...common}><rect x="12" y="16" width="24" height="26" rx="5" /><path d="M18 16v-4a6 6 0 0 1 12 0v4" /></svg>;
    case 'leaf':
      return <svg {...common}><path d="M12 36C12 20 22 12 36 12c0 14-8 24-24 24Z" /><path d="M12 36 26 22" /></svg>;
    case 'box':
      return <svg {...common}><path d="M8 16l16-7 16 7v16l-16 7-16-7V16Z" /><path d="M8 16l16 7 16-7M24 23v16" /></svg>;
    default:
      return <svg {...common}><path d="M14 18h20l2 24H12l2-24Z" /><path d="M19 18v-3a5 5 0 0 1 10 0v3" /></svg>;
  }
}
