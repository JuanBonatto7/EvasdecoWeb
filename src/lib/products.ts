import { supabase, supabaseConfigured } from './supabase';
import type { Product, ProductStatus } from './types';

/* Productos de ejemplo: se usan mientras no haya proyecto de Supabase configurado. */
const SAMPLE: Product[] = [
  {
    id: '1', slug: 'campera-de-jean', nombre: 'Campera de jean', categoria: 'Ropa', talle: 'L',
    estado: 'Muy buen estado', precio: 28000, status: 'disponible', destacado: true,
    descripcion: 'Campera de jean clásica, lavado medio. Sin detalles, lista para usar.',
    fotos: [], created_at: '2026-10-20',
  },
  {
    id: '2', slug: 'zapatillas-adidas', nombre: 'Zapatillas adidas', categoria: 'Calzado', talle: '38',
    estado: 'Muy buen estado', precio: 35000, status: 'disponible', destacado: true,
    descripcion: 'Zapatillas adidas originales. Poco uso, sin detalles. Talle 38.',
    fotos: [], created_at: '2026-10-21',
  },
  {
    id: '3', slug: 'mochila-negra', nombre: 'Mochila negra', categoria: 'Mochilas', talle: null,
    estado: 'Buen estado', precio: 18000, status: 'disponible', destacado: false,
    descripcion: 'Mochila negra de uso diario, con un bolsillo frontal y cierre sin fallas.',
    fotos: [], created_at: '2026-10-22',
  },
  {
    id: '4', slug: 'sweater-verde', nombre: 'Sweater verde', categoria: 'Ropa', talle: 'M',
    estado: 'Buen estado', precio: 16000, status: 'disponible', destacado: false,
    descripcion: 'Sweater de punto verde musgo, muy abrigado.',
    fotos: [], created_at: '2026-10-23',
  },
  {
    id: '5', slug: 'remera-rayada', nombre: 'Remera rayada', categoria: 'Ropa', talle: 'M',
    estado: 'Como nuevo', precio: 12000, status: 'reservado', destacado: false,
    descripcion: 'Remera de algodón a rayas, casi sin uso.',
    fotos: [], created_at: '2026-10-24',
  },
  {
    id: '6', slug: 'cartera-negra', nombre: 'Cartera negra', categoria: 'Accesorios', talle: null,
    estado: 'Muy buen estado', precio: 14000, status: 'disponible', destacado: false,
    descripcion: 'Cartera negra de cuero sintético con correa larga.',
    fotos: [], created_at: '2026-10-25',
  },
];

export async function listProducts(): Promise<Product[]> {
  if (!supabase || !supabaseConfigured) return [...SAMPLE].reverse();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProduct(slug: string): Promise<Product | null> {
  const all = await listProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function setProductStatus(id: string, status: ProductStatus) {
  if (!supabase) return;
  const { error } = await supabase.from('products').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function setProductDestacado(id: string, destacado: boolean) {
  if (!supabase) return;
  const { error } = await supabase.from('products').update({ destacado }).eq('id', id);
  if (error) throw error;
}

export async function deleteProduct(id: string) {
  if (!supabase) return;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function saveProduct(input: Omit<Product, 'id' | 'created_at'> & { id?: string }) {
  if (!supabase) throw new Error('Supabase no está configurado');
  const { error } = await supabase.from('products').upsert(input);
  if (error) throw error;
}

export async function uploadPhoto(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase no está configurado');
  const path = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const { error } = await supabase.storage.from('product-photos').upload(path, file);
  if (error) throw error;
  return supabase.storage.from('product-photos').getPublicUrl(path).data.publicUrl;
}

export function formatPrecio(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
}

export function whatsappLink(product?: Product) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '5493584000000';
  const text = product
    ? `Hola! Me interesa "${product.nombre}" (talle ${product.talle ?? 'único'}, ${formatPrecio(product.precio)}). ¿Sigue disponible?`
    : 'Hola! Quería consultar por los productos de Eva\'s Deco.';
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/* Comparte el enlace al catálogo: usa el menú nativo si existe, si no abre WhatsApp. */
export async function shareCatalog() {
  const url = `${window.location.origin}/productos`;
  const text = "Mirá el catálogo de Eva's Deco, ropa y accesorios de segunda mano en Río Cuarto:";
  if (navigator.share) {
    try {
      await navigator.share({ title: "Eva's Deco", text, url });
      return;
    } catch {
      /* el usuario canceló: seguimos con WhatsApp */
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank', 'noopener');
}
