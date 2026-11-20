import { money } from '../features/catalog/catalog.js';
import { freeDeliveryAt } from '../features/commerce/rules.js';

export default function OrderSummary({ subtotal, delivery, children, estimate = false }) {
  return (
    <aside className="order-summary" aria-label="Resumen de compra">
      <h2>Resumen de compra</h2>
      <dl>
        <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
        <div><dt>Entrega</dt><dd>{delivery === null ? 'Por calcular' : delivery === 0 ? 'Gratis' : money(delivery)}</dd></div>
        <div className="summary-total"><dt>{estimate ? 'Total parcial' : 'Total'}</dt><dd>{money(subtotal + (delivery ?? 0))}</dd></div>
      </dl>
      {estimate && subtotal < freeDeliveryAt && <p className="muted">Te faltan {money(freeDeliveryAt - subtotal)} para delivery gratis en zonas habilitadas.</p>}
      {children}
    </aside>
  );
}
