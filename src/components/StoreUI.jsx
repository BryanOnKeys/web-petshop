import { Link } from 'react-router-dom';
import { LuPawPrint, LuShoppingBag, LuCheck, LuMinus, LuPlus } from 'react-icons/lu';
import { money } from '../features/catalog/catalog.js';

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Patitas Felices, inicio">
      <span className="brand-mark"><LuPawPrint aria-hidden="true" /></span>
      <span>Patitas<span className="brand-accent">Felices</span></span>
    </Link>
  );
}

export function Price({ cents, previous, from = false }) {
  return (
    <span className="price">
      {from && <small>Desde</small>}
      <strong>{money(cents)}</strong>
      {previous > cents && <del>{money(previous)}</del>}
    </span>
  );
}

export function PageIntro({ title, description, children, className = '' }) {
  return (
    <div className={'page-intro ' + className}>
      <nav className="breadcrumbs" aria-label="Ruta de navegación"><Link to="/">Inicio</Link><span>/</span><span aria-current="page">{title}</span></nav>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}

export function EmptyState({ title, description, to, label, children }) {
  return (
    <div className="empty-state">
      <span className="state-icon"><LuShoppingBag aria-hidden="true" /></span>
      <h2>{title}</h2>
      <p>{description}</p>
      {to && <Link className="button button-primary" to={to}>{label}</Link>}
      {children}
    </div>
  );
}

export function Status({ children, error = false }) {
  if (!children) return null;
  return <p className={'status-text' + (error ? ' status-error' : '')} role={error ? 'alert' : 'status'}>{!error && <LuCheck aria-hidden="true" />}{children}</p>;
}

export function Quantity({ label, value, min = 1, max, onChange }) {
  return (
    <div className="quantity" role="group" aria-label={'Cantidad de ' + label}>
      <button type="button" aria-label={'Disminuir cantidad de ' + label} disabled={value <= min} onClick={() => onChange(value - 1)}>
        <LuMinus aria-hidden="true" />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" aria-label={'Aumentar cantidad de ' + label} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <LuPlus aria-hidden="true" />
      </button>
    </div>
  );
}
