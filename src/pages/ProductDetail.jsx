import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LuCheck, LuShoppingBag, LuTruck } from 'react-icons/lu';
import ProductCard, { FavoriteButton } from '../components/ProductCard.jsx';
import { EmptyState, Price, Quantity, Status } from '../components/StoreUI.jsx';
import { catalogLink, categories, pets, productById, products, skuFor, stages } from '../features/catalog/catalog.js';
import { productImages } from '../features/catalog/media.js';
import { stockFor } from '../features/commerce/rules.js';
import { shop, useShop } from '../features/commerce/store.js';

function Product({ product }) {
  const state = useShop();
  const [optionId, setOptionId] = useState(() =>
    product.variants.find(item => stockFor(state, skuFor(product.id, item.id)) > 0)?.id ?? product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState({ text: '', error: false });
  const [pending, setPending] = useState(false);
  const option = product.variants.find(item => item.id === optionId);
  const sku = skuFor(product.id, optionId);
  const stock = stockFor(state, sku);
  const inCart = state.cart.find(line => line.sku === sku)?.quantity ?? 0;
  const remaining = Math.max(0, stock - inCart);
  const others = products.filter(item => item.id !== product.id && (item.pet === product.pet || item.pet === 'both')).slice(0, 4);

  async function add() {
    setPending(true);
    try {
      await shop.add(sku, quantity);
      setStatus({ text: 'Agregado al carrito', error: false });
      setQuantity(1);
    } catch (error) {
      setStatus({ text: error.message, error: true });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container page-space">
      <nav className="breadcrumbs" aria-label="Ruta de navegación">
        <Link to="/">Inicio</Link><span>/</span><Link to="/products">Catálogo</Link><span>/</span>
        <Link to={catalogLink({ category: product.category })}>{categories[product.category]}</Link>
      </nav>
      <section className="product-detail">
        <div className={'detail-photo product-photo-' + product.category}>
          <img src={productImages[product.image]} alt={product.name} />
          <FavoriteButton product={product} />
        </div>
        <div className="detail-copy">
          <p className="product-brand">{product.brand}</p>
          <h1>{product.name}</h1>
          <p className="detail-meta">{pets[product.pet]} · {stages[product.stage]}</p>
          <Price cents={option.price} previous={option.previousPrice} />
          <p>{product.description}</p>
          <fieldset className="options-field">
            <legend>Presentación</legend>
            <div className="option-group">
              {product.variants.map(item => <label key={item.id} className={'option-pick' + (item.id === optionId ? ' chosen' : '')}>
                <input type="radio" name="variant" value={item.id} checked={item.id === optionId} onChange={() => {
                  setOptionId(item.id); setQuantity(1); setStatus({ text: '', error: false });
                }} />
                {item.label}
              </label>)}
            </div>
          </fieldset>
          <p className={stock ? 'stock-line' : 'muted'}>{stock ? <><LuCheck aria-hidden="true" />{stock} disponibles</> : 'Presentación agotada'}</p>
          <div className="detail-cta">
            <Quantity label={product.name} value={quantity} max={remaining} onChange={setQuantity} />
            <button className="button button-primary" type="button" disabled={pending || remaining < quantity} onClick={add}>
              <LuShoppingBag aria-hidden="true" /> Agregar al carrito
            </button>
          </div>
          {inCart > 0 && <Link className="text-link" to="/cart">Ver carrito ({inCart})</Link>}
          <Status error={status.error}>{status.text}</Status>
          <Link className="delivery-hint" to="/shipping"><LuTruck aria-hidden="true" /> Consulta entrega y recojo</Link>
          <details className="information-panel" open><summary>Detalles del producto</summary>
            <ul>{product.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
          </details>
        </div>
      </section>
      <section className="home-section" aria-labelledby="also-heading">
        <div className="section-heading"><h2 id="also-heading">También te puede interesar</h2></div>
        <div className="product-grid">{others.map(item => <ProductCard key={item.id} product={item} />)}</div>
      </section>
    </div>
  );
}

export default function ProductDetail() {
  const { productId } = useParams();
  const product = productById.get(productId);
  if (!product) return <div className="container page-space"><EmptyState title="Producto no encontrado"
    description="Puedes seguir explorando las presentaciones que figuran en la tienda." to="/products" label="Volver al catálogo" /></div>;
  return <Product product={product} key={product.id} />;
}
