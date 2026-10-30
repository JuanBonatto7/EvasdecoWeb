export type Estado = 'Muy buen estado' | 'Buen estado' | 'Como nuevo' | 'Usado';

export type ProductStatus = 'disponible' | 'reservado' | 'vendido';

export interface Product {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  talle: string | null;
  estado: Estado;
  precio: number;
  descripcion: string;
  fotos: string[];
  status: ProductStatus;
  destacado: boolean;
  created_at: string;
}

/* Máximo de fotos por publicación (se muestran en el carrusel). */
export const MAX_FOTOS = 5;

export const CATEGORIAS = ['Ropa', 'Calzado', 'Mochilas', 'Accesorios', 'Yerbas', 'Varios'] as const;
