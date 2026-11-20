import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LuBookOpen, LuPawPrint, LuStore, LuTruck } from 'react-icons/lu';
import DistrictSelect from '../components/DistrictSelect.jsx';
import { EmptyState, PageIntro, Status } from '../components/StoreUI.jsx';
import { money } from '../features/catalog/catalog.js';
import { cartLines, deliveryCost, freeDeliveryAt, pickupLocation } from '../features/commerce/rules.js';
import { useShop } from '../features/commerce/store.js';

export function Shipping() {
  const state = useShop();
  const [district, setDistrict] = useState('');
  const subtotal = cartLines(state).reduce((sum, line) => sum + line.total, 0);
  const rate = deliveryCost('delivery', district, subtotal);
  return (
    <div className="container page-space">
      <PageIntro title="Entrega y recojo" description="Consulta las zonas y tarifas que usa esta tienda de demostración." />
      <div className="info-columns">
        <section className="panel info-panel">
          <span className="benefit-icon"><LuTruck aria-hidden="true" /></span>
          <h2>Delivery en Lima</h2>
          <p>Selecciona un distrito para ver el costo según el subtotal actual de tu carrito. La entrega es gratis desde {money(freeDeliveryAt)} en zonas habilitadas.</p>
          <DistrictSelect value={district} onChange={setDistrict} />
          {rate !== null && <p className="delivery-hint" role="status">Tarifa estimada {rate === 0 ? 'gratis' : money(rate)}</p>}
        </section>
        <section className="panel info-panel">
          <span className="benefit-icon"><LuStore aria-hidden="true" /></span>
          <h2>Recojo sin costo</h2>
          <p>Selecciona recojo al confirmar tu pedido de prueba. El resumen mostrará el punto elegido.</p>
          <strong>{pickupLocation}</strong>
          <Link className="text-link" to="/cart">Ver mi carrito</Link>
        </section>
      </div>
    </div>
  );
}

const faqs = [
  ['¿Dónde encuentro mi pedido?', 'Abre Mi cuenta y elige Mis pedidos. Allí verás los productos, el total y la forma de entrega del pedido de prueba.'],
  ['¿Puedo guardar productos para después?', 'Sí. Guarda un producto con el corazón de su tarjeta y consulta la lista desde Favoritos.'],
  ['¿Cómo consulto el costo de delivery?', 'En Entrega y recojo puedes elegir un distrito. Al confirmar un pedido se calcula otra vez con el subtotal del carrito.'],
  ['¿Cómo cambio una reserva?', 'Cancela el turno desde Mis reservas y elige otra fecha en Servicios.'],
  ['¿Dónde se guardan los datos?', 'Los pedidos, reservas y preferencias se guardan en el navegador que usaste para crear el registro.'],
];

export function Help() {
  const state = useShop();
  const [lookup, setLookup] = useState('');
  const order = state.orders.find(item => item.id === lookup);

  function find(event) {
    event.preventDefault();
    setLookup(String(new FormData(event.currentTarget).get('reference')).trim().toUpperCase());
  }

  return (
    <div className="container page-space">
      <PageIntro title="Ayuda con tu compra" />
      <div className="info-columns">
        <section className="history-list" aria-label="Preguntas frecuentes">
          {faqs.map(([question, answer]) => <details className="information-panel" key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </section>
        <section className="panel info-panel">
          <h2>Consulta un pedido</h2>
          <p>Usa la referencia que aparece al confirmar tu compra de prueba.</p>
          <form className="help-form" onSubmit={find}>
            <label className="field"><span>Número de pedido</span><input name="reference" placeholder="PF-…" required maxLength={24} /></label>
            <button className="button button-primary" type="submit">Buscar pedido</button>
          </form>
          {order && <div className="demo-note" role="status"><strong>{order.id} · {money(order.total)}</strong><span>{order.location}</span><Link className="text-link" to="/profile?panel=orders">Ver historial</Link></div>}
          {lookup && !order && <Status error>No encontramos esa referencia en este navegador.</Status>}
        </section>
      </div>
    </div>
  );
}

const articles = [
  {
    id: 'elige-presentacion', title: 'Cómo comparar presentaciones de alimento',
    preview: 'Fíjate en la etapa, el precio por kilo y el espacio donde guardarás el empaque.',
    topic: 'Alimentos', path: '/products?category=food',
    paragraphs: [
      'Empieza por la etapa que indique el empaque. Las fichas de la tienda separan los productos para adultos de los que son para cachorros o gatitos.',
      'Compara dos tamaños dividiendo el precio entre su peso en kilos. El precio por kilo ayuda a comparar presentaciones de un mismo producto. También importa cuánto espacio tienes para almacenarlo.',
      'Antes de agregar al carrito, revisa la variante elegida y la ración indicada por el fabricante.',
    ],
  },
  {
    id: 'espacio-gatos', title: 'Organiza un rincón de juego para tu gato',
    preview: 'Agrupa una superficie de rascado y un espacio de descanso con caminos despejados.',
    topic: 'Gatos', path: '/products/cat',
    paragraphs: [
      'Piensa dónde juega y descansa tu gato antes de comprar. Un rascador junto a un lugar que ya frecuenta puede resultar más práctico que colocarlo lejos de su recorrido.',
      'Mide el área disponible. Un rascador horizontal ocupa más suelo, mientras que uno vertical necesita una base firme. Las dimensiones figuran en la presentación de cada ficha.',
      'Mantén los juguetes con cuerdas guardados después de jugar y revisa el estado de cada accesorio.',
    ],
  },
  {
    id: 'collar-y-paseo', title: 'Qué medir antes de comprar un collar',
    preview: 'Compara el contorno con el rango de la talla y revisa el tipo de cierre.',
    topic: 'Perros', path: '/products/clothes',
    paragraphs: [
      'Mide el contorno del cuello con una cinta flexible. Usa la medida para elegir una talla dentro del rango del producto.',
      'Revisa qué parte del collar es ajustable. Un cierre que puedas accionar fácilmente facilita colocar y retirar el accesorio en casa.',
      'En la ficha de Patitas Felices puedes cambiar de talla y ver de inmediato si la presentación está disponible.',
    ],
  },
];

export function Blog() {
  return (
    <div className="container page-space">
      <PageIntro title="Guías para tu mascota" description="Ideas prácticas para comparar productos y elegir lo que necesitas." />
      <div className="guide-grid">
        {articles.map(article => <article className="panel guide-card" key={article.id}>
          <span className="benefit-icon"><LuBookOpen aria-hidden="true" /></span>
          <p className="product-brand">{article.topic}</p><h2><Link to={'/blog/' + article.id}>{article.title}</Link></h2>
          <p>{article.preview}</p><Link className="text-link" to={'/blog/' + article.id}>Leer guía</Link>
        </article>)}
      </div>
    </div>
  );
}

export function Article() {
  const { articleId } = useParams();
  const article = articles.find(item => item.id === articleId);
  if (!article) return <div className="container page-space"><EmptyState title="Guía no encontrada"
    description="Encuentra otras ideas para elegir lo que necesita tu mascota." to="/blog" label="Ver guías" /></div>;
  return (
    <div className="container page-space">
      <PageIntro title={article.title} description={article.preview} />
      <article className="panel article-content">{article.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <Link className="button button-primary" to={article.path}>Explorar productos</Link>
      </article>
    </div>
  );
}

export function About() {
  return (
    <div className="container page-space">
      <PageIntro title="Sobre Patitas Felices" />
      <article className="about-panel panel">
        <span className="state-icon"><LuPawPrint aria-hidden="true" /></span>
        <h2>Una tienda pensada para perros, gatos y sus personas.</h2>
        <p>Patitas Felices reúne alimentos, juguetes, higiene y accesorios en un catálogo que puedes explorar por mascota y etapa de vida. Cada ficha muestra presentaciones, precios y disponibilidad.</p>
        <p>Esta tienda es un proyecto de portafolio. El catálogo, las tarifas y los turnos son datos de demostración. Puedes recorrer la compra y consultar los registros creados en tu navegador.</p>
        <Link className="button button-primary" to="/products">Visitar el catálogo</Link>
      </article>
    </div>
  );
}
