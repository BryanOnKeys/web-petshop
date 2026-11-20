import { createElement } from 'react';
import { Link } from 'react-router-dom';
import { LuBone, LuCat, LuDog, LuHeartHandshake, LuMessageCircle, LuSparkles, LuStore, LuTruck } from 'react-icons/lu';
import hero from '../assets/store/patitas-hero.webp';
import ProductCard from '../components/ProductCard.jsx';
import { catalogLink, money, products } from '../features/catalog/catalog.js';
import { freeDeliveryAt } from '../features/commerce/rules.js';

const departments = [
  { title: 'Perros', note: 'Alimento y paseo', tone: 'lavender', link: '/products/dog', Icon: LuDog },
  { title: 'Gatos', note: 'Alimento y rascadores', tone: 'peach', link: '/products/cat', Icon: LuCat },
  { title: 'Juguetes', note: 'Para jugar en casa', tone: 'yellow', link: '/products/toys', Icon: LuBone },
  { title: 'Higiene', note: 'Baño y limpieza', tone: 'mint', link: catalogLink({ category: 'hygiene' }), Icon: LuSparkles },
];
const benefits = [
  { name: 'Delivery en Lima', note: 'Gratis desde ' + money(freeDeliveryAt), link: '/shipping', Icon: LuTruck },
  { name: 'Recojo sin costo', note: 'Selecciona recojo al hacer tu pedido', link: '/shipping', Icon: LuStore },
  { name: 'Ayuda con tu compra', note: 'Consulta entrega, pedidos y reservas', link: '/contact', Icon: LuMessageCircle },
];

export default function Storefront() {
  return (
    <div className="container home-page">
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <span className="hero-kicker">Tienda para perros y gatos</span>
          <h1 id="hero-heading">Todo para sus <em>mejores días.</em></h1>
          <p>Encuentra alimento, juguetes y cuidados para acompañar a tu mascota en cada etapa.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/products">Explorar catálogo</Link>
            <Link className="button button-plain" to="/offers">Ver ofertas</Link>
          </div>
        </div>
        <img className="hero-photo" src={hero} alt="Un perro golden retriever junto a un gato gris y blanco"
          width="1440" height="1080" fetchPriority="high" />
      </section>

      <div className="benefit-row" aria-label="Opciones de compra">
        {benefits.map(({ name, note, link, Icon }) => (
          <Link to={link} className="benefit" key={name}>
            <span className="benefit-icon">{createElement(Icon, { 'aria-hidden': true })}</span>
            <span><strong>{name}</strong><small>{note}</small></span>
          </Link>
        ))}
      </div>

      <section className="home-section" aria-labelledby="department-heading">
        <div className="section-heading"><h2 id="department-heading">Compra por categoría</h2></div>
        <div className="department-grid">
          {departments.map(({ title, note, tone, link, Icon }) => (
            <Link className={'department ' + tone} key={title} to={link}>
              <span className="department-icon">{createElement(Icon, { 'aria-hidden': true })}</span>
              <span><strong>{title}</strong><small>{note}</small></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="featured-heading">
        <div className="section-heading">
          <h2 id="featured-heading">Selección de la tienda</h2>
          <Link className="text-link" to="/products">Ver todos los productos</Link>
        </div>
        <div className="product-grid">
          {products.filter(product => product.featured).map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="service-promo" aria-labelledby="service-heading">
        <div className="service-promo-icon"><LuHeartHandshake aria-hidden="true" /></div>
        <div>
          <h2 id="service-heading">Un turno para su cuidado</h2>
          <p>Elige baño, peluquería o corte de uñas y guarda una reserva de prueba.</p>
        </div>
        <Link className="button button-primary" to="/services">Ver servicios</Link>
      </section>
    </div>
  );
}
