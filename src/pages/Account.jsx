import { createElement, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LuCalendarDays, LuPackage, LuUserRound } from 'react-icons/lu';
import { EmptyState, PageIntro, Status } from '../components/StoreUI.jsx';
import { money } from '../features/catalog/catalog.js';
import { shop, useShop } from '../features/commerce/store.js';

const accountPanels = [
  { id: 'profile', label: 'Mi perfil', Icon: LuUserRound },
  { id: 'orders', label: 'Mis pedidos', Icon: LuPackage },
  { id: 'bookings', label: 'Mis reservas', Icon: LuCalendarDays },
];

const shortDate = value => new Date(value).toLocaleDateString('es-PE', { dateStyle: 'medium' });

function OrderDetails({ order }) {
  return (
    <div className="order-details">
      <dl>
        <div><dt>Entrega</dt><dd>{order.location}</dd></div>
        <div><dt>Productos</dt><dd>{money(order.subtotal)}</dd></div>
        <div><dt>Costo de entrega</dt><dd>{money(order.delivery)}</dd></div>
      </dl>
      <ul>
        {order.lines.map(line => <li key={line.sku}>{line.quantity} × {line.name} <span>({line.option})</span></li>)}
      </ul>
    </div>
  );
}

function Orders({ orders }) {
  const [result, setResult] = useState({ id: '', text: '', error: false });
  if (!orders.length) return <EmptyState title="Aún no tienes pedidos" description="Tus pedidos de prueba aparecerán aquí."
    to="/products" label="Explorar catálogo" />;

  async function repeat(order) {
    setResult({ id: '', text: '', error: false });
    try {
      await shop.reorder(order.id);
      setResult({ id: order.id, text: 'Productos agregados al carrito.', error: false });
    } catch (cause) {
      setResult({ id: order.id, text: cause.message, error: true });
    }
  }

  return <div className="history-list">{orders.map(order => (
    <details className="information-panel" key={order.id}>
      <summary><span>{order.id} <small>{shortDate(order.date)}</small></span><strong>{money(order.total)}</strong></summary>
      <OrderDetails order={order} />
      <div className="inline-actions">
        <button className="button button-outline" type="button" onClick={() => repeat(order)}>Volver a comprar</button>
        {result.id === order.id && !result.error && <Link className="text-link" to="/cart">Ver carrito</Link>}
      </div>
      {result.id === order.id && <Status error={result.error}>{result.text}</Status>}
    </details>
  ))}</div>;
}

function Bookings({ bookings }) {
  if (!bookings.length) return <EmptyState title="Aún no tienes reservas" description="Los turnos de prueba se guardan en esta sección."
    to="/services" label="Ver servicios" />;
  return <div className="history-list">{bookings.map(booking => (
    <article className="panel booking-entry" key={booking.id}>
      <div><small>{booking.id}</small><h2>{booking.service}</h2>
        <p>{booking.petName} · {shortDate(booking.date + 'T12:00')} · {booking.time}</p>
      </div>
      {booking.cancelled ? <span className="cancelled">Cancelada</span> : <button className="button button-outline" type="button"
        onClick={() => shop.cancelBooking(booking.id)}>Cancelar turno</button>}
    </article>
  ))}</div>;
}

function LocalProfile({ profile }) {
  const [result, setResult] = useState('');
  async function save(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name')).trim();
    const petName = String(form.get('petName')).trim();
    if (name.length < 2) { setResult('Escribe un nombre de al menos dos caracteres.'); return; }
    await shop.saveProfile({ name, petName, pet: String(form.get('pet')) });
    setResult(shop.saved() ? 'Perfil guardado en este navegador.' : 'Perfil actualizado durante esta sesión.');
  }
  return (
    <form className="panel profile-panel" onSubmit={save}>
      <h2>{profile?.name ? 'Hola, ' + profile.name : 'Personaliza tu perfil'}</h2>
      <p className="muted">Tu perfil de prueba guarda los datos que elijas en este navegador.</p>
      <label className="field"><span>Tu nombre</span><input name="name" defaultValue={profile?.name ?? ''} required minLength={2} maxLength={60} /></label>
      <label className="field"><span>Nombre de tu mascota</span><input name="petName" defaultValue={profile?.petName ?? ''} maxLength={40} /></label>
      <label className="field"><span>Tipo de mascota</span><select name="pet" defaultValue={profile?.pet ?? ''}>
        <option value="">Elegir</option><option value="dog">Perro</option><option value="cat">Gato</option><option value="both">Perro y gato</option>
      </select></label>
      <button className="button button-primary" type="submit">Guardar perfil</button>
      <Status error={result.startsWith('Escribe')}>{result}</Status>
    </form>
  );
}

export default function Account() {
  const state = useShop();
  const [query] = useSearchParams();
  const active = accountPanels.find(panel => panel.id === query.get('panel'))?.id ?? 'profile';
  return (
    <div className="container page-space">
      <PageIntro title="Mi cuenta" description="Encuentra tus pedidos, reservas y preferencias de esta demo." />
      <div className="account-layout">
        <nav className="account-nav" aria-label="Secciones de cuenta">
          {accountPanels.map(({ id, label, Icon }) => <Link to={'/profile?panel=' + id} key={id}
            aria-current={id === active ? 'page' : undefined} className={id === active ? 'active' : undefined}>{createElement(Icon, { 'aria-hidden': true })}{label}</Link>)}
        </nav>
        <section aria-label={accountPanels.find(panel => panel.id === active).label}>
          {active === 'profile' && <LocalProfile profile={state.profile} />}
          {active === 'orders' && <Orders orders={state.orders} />}
          {active === 'bookings' && <Bookings bookings={state.bookings} />}
        </section>
      </div>
    </div>
  );
}
