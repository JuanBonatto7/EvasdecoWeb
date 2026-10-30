import { FormEvent, useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { useSession } from '../lib/auth';
import { deleteProduct, formatPrecio, listProducts, saveProduct, setProductStatus, uploadPhoto } from '../lib/products';
import { CATEGORIAS, MAX_FOTOS, type Estado, type Product, type ProductStatus } from '../lib/types';

const ESTADOS: Estado[] = ['Como nuevo', 'Muy buen estado', 'Buen estado', 'Usado'];

function slugify(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function Admin() {
  const { session, loading } = useSession();

  if (!supabaseConfigured) {
    return (
      <section className="container section admin">
        <h1 className="page-title">Panel</h1>
        <p className="muted">Falta configurar Supabase. Copiá <code>.env.example</code> a <code>.env.local</code> y completá los datos.</p>
      </section>
    );
  }
  if (loading) return <p className="container section muted">Cargando…</p>;
  if (!session) return <Login />;
  return <Dashboard />;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) setError('Email o contraseña incorrectos.');
  }

  return (
    <section className="container section admin-login">
      <h1 className="page-title">Ingreso</h1>
      <form onSubmit={submit} className="form card">
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Contraseña<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" type="submit">Entrar</button>
      </form>
    </section>
  );
}

const EMPTY = {
  nombre: '', categoria: 'Ropa', talle: '', estado: 'Muy buen estado' as Estado,
  precio: '', descripcion: '',
};

function Dashboard() {
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [photos, setPhotos] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = () => listProducts().then(setItems);
  useEffect(() => { refresh(); }, []);

  async function publish(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const urls = await Promise.all(photos.map(uploadPhoto));
      await saveProduct({
        slug: slugify(`${form.nombre}-${Date.now().toString(36)}`),
        nombre: form.nombre,
        categoria: form.categoria,
        talle: form.talle || null,
        estado: form.estado,
        precio: Number(form.precio),
        descripcion: form.descripcion,
        fotos: urls,
        status: 'disponible',
        destacado: false,
      });
      setForm(EMPTY);
      setPhotos([]);
      setMsg('Publicado ✔');
      refresh();
    } catch (err) {
      setMsg('No se pudo publicar: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(p: Product, status: ProductStatus) {
    await setProductStatus(p.id, status);
    refresh();
  }

  async function remove(p: Product) {
    if (!confirm(`¿Borrar "${p.nombre}"?`)) return;
    await deleteProduct(p.id);
    refresh();
  }

  return (
    <section className="container section admin">
      <div className="section-head">
        <h1 className="page-title">Panel</h1>
        <button className="btn btn-ghost" onClick={() => supabase!.auth.signOut()}>Salir</button>
      </div>

      <div className="admin-grid">
        <form className="form card" onSubmit={publish}>
          <h2>Nueva publicación</h2>

          <label className="photo-drop">
            <input
              type="file" accept="image/*" multiple capture="environment"
              onChange={(e) => {
                const all = Array.from(e.target.files ?? []);
                setPhotos(all.slice(0, MAX_FOTOS));
                setMsg(all.length > MAX_FOTOS ? `Solo se suben ${MAX_FOTOS} fotos por producto. Se tomaron las primeras.` : null);
              }}
            />
            <span>{photos.length ? `${photos.length} de ${MAX_FOTOS} fotos elegidas` : `Tocá para sacar o elegir hasta ${MAX_FOTOS} fotos`}</span>
          </label>

          <label>Nombre<input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Zapatillas adidas" required /></label>
          <div className="row">
            <label>Categoría
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Talle<input value={form.talle} onChange={(e) => setForm({ ...form, talle: e.target.value })} placeholder="Opcional" /></label>
          </div>
          <div className="row">
            <label>Estado
              <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as Estado })}>
                {ESTADOS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>Precio (ARS)<input inputMode="numeric" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value.replace(/\D/g, '') })} required /></label>
          </div>
          <label>Descripción<textarea rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Contá algo, si hace falta" /></label>

          <button className="btn btn-primary" disabled={saving} type="submit">{saving ? 'Publicando…' : 'Publicar'}</button>
          {msg && <p className="muted">{msg}</p>}
        </form>

        <div className="card">
          <h2>Publicaciones ({items.length})</h2>
          <ul className="admin-list">
            {items.map((p) => (
              <li key={p.id}>
                <div>
                  <strong>{p.nombre}</strong>
                  <span className="muted"> · {formatPrecio(p.precio)}</span>
                </div>
                <div className="row-actions">
                  <select value={p.status} onChange={(e) => changeStatus(p, e.target.value as ProductStatus)}>
                    <option value="disponible">Disponible</option>
                    <option value="reservado">Reservado</option>
                    <option value="vendido">Vendido</option>
                  </select>
                  <button className="btn-link" onClick={() => remove(p)}>Borrar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
