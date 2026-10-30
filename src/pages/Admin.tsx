import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { useSession } from '../lib/auth';
import {
  deleteProduct, formatPrecio, listProducts, saveProduct, setProductDestacado, setProductStatus, uploadPhoto,
} from '../lib/products';
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
  const [editing, setEditing] = useState<Product | null>(null);
  const [keptFotos, setKeptFotos] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = () => listProducts().then(setItems);
  useEffect(() => { refresh(); }, []);

  // Vista previa de las fotos nuevas, liberando las URLs al cambiar.
  useEffect(() => {
    const urls = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [newFiles]);

  const total = keptFotos.length + newFiles.length;

  function resetForm() {
    setForm(EMPTY);
    setEditing(null);
    setKeptFotos([]);
    setNewFiles([]);
  }

  function startEdit(p: Product) {
    setEditing(p);
    setForm({
      nombre: p.nombre, categoria: p.categoria, talle: p.talle ?? '', estado: p.estado,
      precio: String(p.precio), descripcion: p.descripcion,
    });
    setKeptFotos(p.fotos.slice(0, MAX_FOTOS));
    setNewFiles([]);
    setMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function onPickFiles(e: ChangeEvent<HTMLInputElement>) {
    const all = Array.from(e.target.files ?? []);
    e.target.value = '';
    const libres = MAX_FOTOS - total;
    const tomadas = all.slice(0, Math.max(0, libres));
    if (tomadas.length) setNewFiles((prev) => [...prev, ...tomadas]);
    setMsg(all.length > libres ? `Máximo ${MAX_FOTOS} fotos por producto. Se agregaron ${Math.max(0, libres)}.` : null);
  }

  function removeKept(i: number) {
    setKeptFotos((prev) => prev.filter((_, j) => j !== i));
  }

  function removeNew(i: number) {
    setNewFiles((prev) => prev.filter((_, j) => j !== i));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const uploaded = await Promise.all(newFiles.map(uploadPhoto));
      const fotos = [...keptFotos, ...uploaded].slice(0, MAX_FOTOS);
      const datos = {
        nombre: form.nombre,
        categoria: form.categoria,
        talle: form.talle || null,
        estado: form.estado,
        precio: Number(form.precio),
        descripcion: form.descripcion,
        fotos,
      };
      if (editing) {
        await saveProduct({ ...datos, id: editing.id, slug: editing.slug, status: editing.status, destacado: editing.destacado });
        setMsg('Cambios guardados ✔');
      } else {
        await saveProduct({
          ...datos,
          slug: slugify(`${form.nombre}-${Date.now().toString(36)}`),
          status: 'disponible',
          destacado: false,
        });
        setMsg('Publicado ✔');
      }
      resetForm();
      refresh();
    } catch (err) {
      setMsg('No se pudo guardar: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(p: Product, status: ProductStatus) {
    await setProductStatus(p.id, status);
    refresh();
  }

  async function toggleDestacado(p: Product) {
    await setProductDestacado(p.id, !p.destacado);
    refresh();
  }

  async function remove(p: Product) {
    if (!confirm(`¿Borrar "${p.nombre}"?`)) return;
    if (editing?.id === p.id) resetForm();
    await deleteProduct(p.id);
    refresh();
  }

  const destacadosCount = items.filter((p) => p.destacado).length;

  return (
    <section className="container section admin">
      <div className="section-head">
        <h1 className="page-title">Panel</h1>
        <button className="btn btn-ghost" onClick={() => supabase!.auth.signOut()}>Salir</button>
      </div>

      <div className="admin-grid">
        <form className="form card" onSubmit={save}>
          <div className="form-head">
            <h2>{editing ? `Editar: ${editing.nombre}` : 'Nueva publicación'}</h2>
            {editing && <button type="button" className="btn-link" onClick={resetForm}>Cancelar</button>}
          </div>

          <div className="photo-manager">
            {keptFotos.map((f, i) => (
              <div className="photo-thumb" key={f}>
                <img src={f} alt="" />
                <button type="button" onClick={() => removeKept(i)} aria-label="Quitar foto">×</button>
              </div>
            ))}
            {previews.map((u, i) => (
              <div className="photo-thumb is-new" key={u}>
                <img src={u} alt="" />
                <button type="button" onClick={() => removeNew(i)} aria-label="Quitar foto">×</button>
              </div>
            ))}
            {total < MAX_FOTOS && (
              <label className="photo-add">
                <input type="file" accept="image/*" multiple capture="environment" onChange={onPickFiles} />
                <span>+ Foto</span>
              </label>
            )}
          </div>
          <p className="muted small">{total} de {MAX_FOTOS} fotos · las dos primeras son las que se ven en el listado</p>

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

          <button className="btn btn-primary" disabled={saving} type="submit">
            {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Publicar'}
          </button>
          {msg && <p className="muted">{msg}</p>}
        </form>

        <div className="card">
          <div className="form-head">
            <h2>Publicaciones ({items.length})</h2>
            <span className="muted small">{destacadosCount} destacadas</span>
          </div>
          <ul className="admin-list">
            {items.map((p) => (
              <li key={p.id} className={editing?.id === p.id ? 'is-editing' : ''}>
                <div className="admin-thumb">
                  {p.fotos[0] ? <img src={p.fotos[0]} alt="" /> : <span>{p.categoria.slice(0, 2)}</span>}
                </div>
                <div className="admin-item-info">
                  <strong>{p.nombre}</strong>
                  <span className="muted small">{formatPrecio(p.precio)} · {p.fotos.length} foto(s)</span>
                  <div className="row-actions">
                    <select value={p.status} onChange={(e) => changeStatus(p, e.target.value as ProductStatus)}>
                      <option value="disponible">Disponible</option>
                      <option value="reservado">Reservado</option>
                      <option value="vendido">Vendido</option>
                    </select>
                    <label className="star-toggle">
                      <input type="checkbox" checked={p.destacado} onChange={() => toggleDestacado(p)} /> Destacado
                    </label>
                  </div>
                </div>
                <div className="admin-item-actions">
                  <button className="btn-link" onClick={() => startEdit(p)}>Editar</button>
                  <button className="btn-link danger" onClick={() => remove(p)}>Borrar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
