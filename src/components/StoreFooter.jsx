import { Link } from 'react-router-dom';
import { Brand } from './StoreUI.jsx';

const footerGroups = [
  { label: 'Tienda', links: [['Perros', '/products/dog'], ['Gatos', '/products/cat'], ['Ofertas', '/offers'], ['Servicios', '/services']] },
  { label: 'Te ayudamos', links: [['Entrega y recojo', '/shipping'], ['Ayuda con pedidos', '/contact'], ['Mi cuenta', '/profile']] },
  { label: 'Patitas Felices', links: [['Sobre la tienda', '/about'], ['Guías de compra', '/blog']] },
];

export default function StoreFooter() {
  return (
    <footer className="store-footer">
      <div className="container footer-grid">
        <div>
          <Brand />
          <p>Alimentos, accesorios y cuidado para perros y gatos.</p>
        </div>
        {footerGroups.map(group => (
          <nav key={group.label} aria-label={group.label}>
            <h2>{group.label}</h2>
            {group.links.map(([label, path]) => <Link key={path} to={path}>{label}</Link>)}
          </nav>
        ))}
      </div>
      <div className="container footer-bottom"><span>Patitas Felices · Lima, Perú</span><span>Tienda de demostración</span></div>
    </footer>
  );
}
