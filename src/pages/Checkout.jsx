import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LuCheck, LuStore, LuTruck } from 'react-icons/lu';
import DistrictSelect from '../components/DistrictSelect.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import { EmptyState, PageIntro, Status } from '../components/StoreUI.jsx';
import { money } from '../features/catalog/catalog.js';
import { cartLines, deliveryCost, pickupLocation } from '../features/commerce/rules.js';
import { shop, useShop } from '../features/commerce/store.js';

export default function Checkout() {
  const state = useShop();
  const navigate = useNavigate();
  const [method, setMethod] = useState('delivery');
  const [district, setDistrict] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const lines = cartLines(state);
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
  const delivery = deliveryCost(method, district, subtotal);

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError('');
    const name = String(new FormData(event.currentTarget).get('name') ?? '');
    try {
      const order = await shop.placeOrder({ name, method, district });
      navigate('/checkout/success?' + new URLSearchParams({ order: order.id }), { replace: true });
    } catch (cause) {
      setError(cause.message);
    } finally {
      setPending(false);
    }
  }

  if (!lines.length) return (
    <div className="container page-space">
      <PageIntro title="Finalizar compra" />
      <EmptyState title="Agrega productos primero" description="Elige una presentación disponible para armar tu pedido."
        to="/products" label="Explorar catálogo" />
    </div>
  );

  return (
    <div className="container page-space">
      <PageIntro title="Finalizar compra" description="Pedido de demostración. Usa un nombre de prueba." />
      <form className="commerce-layout" onSubmit={submit}>
        <section className="panel checkout-panel" aria-label="Datos de compra">
          <fieldset className="options-field">
            <legend>Cómo quieres recibir tu pedido</legend>
            <div className="fulfillment-group">
              <label className={'fulfillment-option' + (method === 'delivery' ? ' chosen' : '')}>
                <input type="radio" name="method" value="delivery" checked={method === 'delivery'} onChange={() => setMethod('delivery')} />
                <LuTruck aria-hidden="true" /><span><strong>Delivery</strong><small>Zonas seleccionadas de Lima</small></span>
              </label>
              <label className={'fulfillment-option' + (method === 'pickup' ? ' chosen' : '')}>
                <input type="radio" name="method" value="pickup" checked={method === 'pickup'} onChange={() => setMethod('pickup')} />
                <LuStore aria-hidden="true" /><span><strong>Recojo</strong><small>Sin costo adicional</small></span>
              </label>
            </div>
          </fieldset>
          {method === 'delivery' ? <DistrictSelect value={district} onChange={setDistrict} required /> : <p className="delivery-hint"><LuStore aria-hidden="true" />{pickupLocation}</p>}
          <label className="field">
            <span>Nombre para el pedido</span>
            <input name="name" minLength={2} maxLength={60} autoComplete="off" placeholder="Ej. Andrea" defaultValue={state.profile?.name ?? ''} required />
          </label>
          <div className="demo-note"><strong>Forma de pago</strong><span>Pago al recibir simulado. El pedido se registra en este navegador.</span></div>
          <Status error>{error}</Status>
          <Link className="text-link" to="/cart">Volver al carrito</Link>
        </section>
        <OrderSummary subtotal={subtotal} delivery={delivery} estimate={delivery === null}>
          <button className="button button-primary button-wide" type="submit" disabled={pending || delivery === null}>
            {pending ? 'Registrando…' : 'Confirmar pedido de prueba'}
          </button>
        </OrderSummary>
      </form>
    </div>
  );
}

export function OrderSuccess() {
  const state = useShop();
  const [query] = useSearchParams();
  const order = state.orders.find(item => item.id === query.get('order'));
  if (!order) return (
    <div className="container page-space">
      <PageIntro title="Mis pedidos" />
      <EmptyState title="Pedido no encontrado" description="El historial se conserva en el navegador donde se registró el pedido."
        to="/profile" label="Ver mi cuenta" />
    </div>
  );
  return (
    <div className="container page-space">
      <section className="receipt panel" aria-labelledby="receipt-title">
        <span className="state-icon success-icon"><LuCheck aria-hidden="true" /></span>
        <h1 id="receipt-title">Pedido de prueba registrado</h1>
        <p>Guarda tu referencia para consultar el pedido desde tu cuenta.</p>
        <strong className="reference">{order.id}</strong>
        <dl className="receipt-data"><div><dt>Entrega</dt><dd>{order.location}</dd></div><div><dt>Total</dt><dd>{money(order.total)}</dd></div></dl>
        {!shop.saved() && <Status error>El navegador no permite guardar datos. Este pedido estará disponible durante esta sesión.</Status>}
        <div className="hero-actions">
          <Link className="button button-primary" to="/profile?panel=orders">Ver mis pedidos</Link>
          <Link className="button button-outline" to="/products">Volver al catálogo</Link>
        </div>
      </section>
    </div>
  );
}
