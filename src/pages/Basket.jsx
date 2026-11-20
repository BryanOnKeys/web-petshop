import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuTrash2 } from 'react-icons/lu';
import OrderSummary from '../components/OrderSummary.jsx';
import { EmptyState, PageIntro, Quantity, Status } from '../components/StoreUI.jsx';
import { money } from '../features/catalog/catalog.js';
import { productImages } from '../features/catalog/media.js';
import { cartLines } from '../features/commerce/rules.js';
import { shop, useShop } from '../features/commerce/store.js';

export default function Basket() {
  const state = useShop();
  const [error, setError] = useState('');
  const lines = cartLines(state);
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
  const hasShortage = lines.some(line => line.quantity > line.stock);

  async function change(sku, quantity) {
    setError('');
    try { await shop.quantity(sku, quantity); }
    catch (cause) { setError(cause.message); }
  }

  return (
    <div className="container page-space">
      <PageIntro title="Tu carrito" />
      {lines.length === 0 ? <EmptyState title="Tu carrito está vacío" description="Explora el catálogo y agrega lo que necesita tu mascota."
        to="/products" label="Explorar catálogo" /> : (
        <div className="commerce-layout">
          <section className="panel basket-panel" aria-label="Productos en el carrito">
            <Status error>{error}</Status>
            {lines.map(({ sku, product, option, quantity, stock, total }) => (
              <article className="basket-line" key={sku}>
                <img src={productImages[product.image]} alt="" width="84" height="84" />
                <div className="basket-item">
                  <h2><Link to={'/products/' + product.id}>{product.name}</Link></h2>
                  <p>{option.label} · {money(option.price)} por unidad</p>
                  {quantity > stock && <p className="status-text status-error">Disponibles: {stock}. Actualiza la cantidad.</p>}
                </div>
                <Quantity label={product.name + ' ' + option.label} value={quantity} max={stock} onChange={value => change(sku, value)} />
                <strong>{money(total)}</strong>
                <button type="button" className="icon-button remove-button" aria-label={'Eliminar ' + product.name + ' ' + option.label}
                  onClick={() => change(sku, 0)}><LuTrash2 aria-hidden="true" /></button>
              </article>
            ))}
            <Link className="text-link" to="/products">Seguir comprando</Link>
          </section>
          <OrderSummary subtotal={subtotal} delivery={null} estimate>
            {hasShortage ? <Status error>Revisa el stock antes de continuar.</Status>
              : <Link className="button button-primary button-wide" to="/checkout">Continuar compra</Link>}
          </OrderSummary>
        </div>
      )}
    </div>
  );
}
