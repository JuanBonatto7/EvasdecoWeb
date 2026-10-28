export default function Local() {
  return (
    <section className="container section local">
      <h1 className="page-title">El local</h1>
      <div className="local-grid">
        <div>
          <p className="lead">Una tienda de segunda mano en Río Cuarto, con ropa, calzado y accesorios seleccionados uno por uno.</p>
          <ul className="facts">
            <li><span>Dirección</span>Presidente Perón Este 596, Río Cuarto</li>
            <li><span>Horarios</span>Lunes a sábado, 9:00 a 13:00 y 16:00 a 20:00</li>
            <li><span>Próxima feria</span>Se anuncia en Instagram</li>
          </ul>
          <a className="btn btn-whatsapp" href="https://wa.me/" target="_blank" rel="noreferrer">Escribinos por WhatsApp</a>
        </div>
        <div className="local-map">
          <p>Mapa próximamente</p>
        </div>
      </div>
    </section>
  );
}
