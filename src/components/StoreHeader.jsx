import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LuHeart, LuMapPin, LuSearch, LuShoppingBag, LuUserRound } from 'react-icons/lu';
import { useShop } from '../features/commerce/store.js';
import { Brand } from './StoreUI.jsx';

const navigation = [
  ['Catálogo', '/products'],
  ['Perros', '/products/dog'],
  ['Gatos', '/products/cat'],
  ['Juguetes', '/products/toys'],
  ['Accesorios', '/products/clothes'],
  ['Servicios', '/services'],
  ['Ofertas', '/offers'],
];

function SearchBox({ initial }) {
  const [value, setValue] = useState(initial);
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    const term = value.trim();
    navigate(term ? '/products?' + new URLSearchParams({ q: term }).toString() : '/products');
  }

  return (
    <form className="store-search" onSubmit={submit} role="search">
      <label htmlFor="site-search" className="sr-only">Buscar productos</label>
      <LuSearch aria-hidden="true" />
      <input id="site-search" name="q" type="search" value={value} onChange={event => setValue(event.target.value)}
        placeholder="Buscar productos" maxLength={80} autoComplete="off" />
      <button type="submit">Buscar</button>
    </form>
  );
}

export default function StoreHeader() {
  const state = useShop();
  const location = useLocation();
  const search = new URLSearchParams(location.search).get('q') ?? '';
  const count = state.cart.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <header className="store-header">
      <a className="skip-link" href="#main">Ir al contenido</a>
      <div className="utility-bar">
        <div className="container utility-inner">
          <span><LuMapPin aria-hidden="true" /> Lima, Perú</span>
          <nav aria-label="Información de compra"><Link to="/shipping">Entrega y recojo</Link><Link to="/contact">Ayuda</Link></nav>
        </div>
      </div>
      <div className="container main-header">
        <Brand />
        <SearchBox initial={search} key={search} />
        <nav className="header-actions" aria-label="Cuenta y carrito">
          <Link to="/favorites" aria-label="Favoritos" className="header-action"><LuHeart aria-hidden="true" /><span>Favoritos</span></Link>
          <Link to="/profile" aria-label="Mi cuenta" className="header-action"><LuUserRound aria-hidden="true" /><span>Mi cuenta</span></Link>
          <Link to="/cart" aria-label={'Carrito, ' + count + (count === 1 ? ' producto' : ' productos')} className="header-action cart-action">
            <LuShoppingBag aria-hidden="true" /><span>Carrito</span><b aria-hidden="true">{count}</b>
          </Link>
        </nav>
      </div>
      <nav className="category-nav" aria-label="Categorías principales">
        <div className="container category-nav-inner">
          {navigation.map(([label, path]) => <NavLink key={path} to={path} end={path === '/products'}
            className={path === '/offers' ? 'sale-link' : undefined}>{label}</NavLink>)}
        </div>
      </nav>
    </header>
  );
}
