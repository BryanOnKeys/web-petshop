import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuHeart, LuPlus } from 'react-icons/lu';
import { lowestPrice, onSale, skuFor } from '../features/catalog/catalog.js';
import { productImages } from '../features/catalog/media.js';
import { productInStock } from '../features/commerce/rules.js';
import { shop, useShop } from '../features/commerce/store.js';
import { Price, Status } from './StoreUI.jsx';

export function FavoriteButton({ product, className = '' }) {
  const state = useShop();
  const saved = state.favorites.includes(product.id);
  return (
    <button type="button" className={'favorite-button ' + className} aria-pressed={saved}
      aria-label={(saved ? 'Quitar de favoritos ' : 'Guardar en favoritos ') + product.name}
      onClick={() => shop.favorite(product.id)}>
      <LuHeart aria-hidden="true" />
    </button>
  );
}

export default function ProductCard({ product }) {
  const state = useShop();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const available = productInStock(state, product);
  const option = product.variants[0];
  const multiple = product.variants.length > 1;
  const path = '/products/' + product.id;

  async function add() {
    setError('');
    setMessage('');
    try {
      await shop.add(skuFor(product.id, option.id), 1);
      setMessage('Agregado al carrito');
    } catch (cause) {
      setError(cause.message);
    }
  }

  return (
    <article className="product-card">
      <div className={'product-photo product-photo-' + product.category}>
        <Link to={path} tabIndex={-1} aria-label={'Ver ' + product.name}>
          <img src={productImages[product.image]} alt="" loading="lazy" />
        </Link>
        {onSale(product) && <span className="product-badge">Oferta</span>}
        {!available && <span className="product-badge muted-badge">Agotado</span>}
        <FavoriteButton product={product} />
      </div>
      <div className="product-copy">
        <p className="product-brand">{product.brand}</p>
        <h3><Link to={path}>{product.name}</Link></h3>
        <Price cents={lowestPrice(product)} previous={multiple ? undefined : option.previousPrice} from={multiple} />
        {available && !multiple ? (
          <button className="button button-outline product-action" type="button" onClick={add} aria-label={'Agregar ' + product.name + ' al carrito'}><LuPlus aria-hidden="true" />Agregar</button>
        ) : (
          <Link className="button button-outline product-action" to={path}>{available ? 'Ver opciones' : 'Ver producto'}</Link>
        )}
        <Status error={Boolean(error)}>{error || message}</Status>
      </div>
    </article>
  );
}
