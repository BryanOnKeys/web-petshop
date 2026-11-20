import { Link, useSearchParams } from 'react-router-dom';
import { LuFilter, LuSlidersHorizontal } from 'react-icons/lu';
import ProductCard from '../components/ProductCard.jsx';
import { EmptyState, PageIntro } from '../components/StoreUI.jsx';
import { brands, catalogLink, categories, filterProducts, pets, stages } from '../features/catalog/catalog.js';
import { productInStock } from '../features/commerce/rules.js';
import { useShop } from '../features/commerce/store.js';

const sorts = { featured: 'Relevancia', low: 'Menor precio', high: 'Mayor precio', name: 'Nombre A–Z' };
const priceLimits = { 3000: 'Hasta S/ 30', 6000: 'Hasta S/ 60', 10000: 'Hasta S/ 100', 15000: 'Hasta S/ 150' };

function FilterSelect({ label, options, value, setValue }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={event => setValue(event.target.value)}>
        <option value="">Todos</option>
        {Object.entries(options).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
      </select>
    </label>
  );
}

export default function Catalog({ preset = {} }) {
  const state = useShop();
  const [query, setQuery] = useSearchParams();
  const filters = {
    q: query.get('q') ?? '',
    pet: preset.pet ?? query.get('pet') ?? '',
    category: preset.category ?? query.get('category') ?? '',
    stage: query.get('stage') ?? '',
    brand: query.get('brand') ?? '',
    maxPrice: Number(query.get('maxPrice')) || undefined,
    stock: query.has('stock'),
    sort: query.get('sort') ?? 'featured',
    sale: preset.sale || query.has('sale'),
    favorites: preset.favorites,
  };
  const results = filterProducts(filters, product => productInStock(state, product), state.favorites);
  const title = filters.favorites ? 'Favoritos'
    : preset.sale ? 'Ofertas'
      : preset.pet ? 'Todo para ' + pets[preset.pet].toLowerCase()
        : preset.category ? categories[preset.category]
          : filters.q ? 'Resultados de búsqueda' : 'Catálogo';
  const resetNeeded = Boolean(query.size);

  function update(name, value) {
    const next = new URLSearchParams(query);
    if (value) next.set(name, value);
    else next.delete(name);
    setQuery(next, { replace: true });
  }

  return (
    <div className="container page-space">
      <PageIntro title={title} description={filters.q ? 'Búsqueda: ' + filters.q : undefined} className="catalog-intro">
        {!preset.favorites && <nav className="filter-chips" aria-label="Explora por categoría">
          <Link to="/products" className={!preset.pet && !preset.category && !preset.sale && !filters.category ? 'active' : ''}>Todo</Link>
          <Link to="/products/dog" className={preset.pet === 'dog' ? 'active' : ''}>Perros</Link>
          <Link to="/products/cat" className={preset.pet === 'cat' ? 'active' : ''}>Gatos</Link>
          <Link to={catalogLink({ category: 'food' })} className={filters.category === 'food' ? 'active' : ''}>Alimento</Link>
          <Link to="/products/toys" className={preset.category === 'toys' ? 'active' : ''}>Juguetes</Link>
          <Link to={catalogLink({ category: 'hygiene' })} className={filters.category === 'hygiene' ? 'active' : ''}>Higiene</Link>
        </nav>}
      </PageIntro>
      <div className="catalog-layout">
        <aside aria-label="Filtros del catálogo">
          <details className="filters-panel" open={window.matchMedia('(min-width: 781px)').matches}>
            <summary><LuSlidersHorizontal aria-hidden="true" /> Filtros</summary>
            <div className="filter-fields">
              {!preset.pet && <FilterSelect label="Mascota" options={{ dog: pets.dog, cat: pets.cat }} value={filters.pet} setValue={value => update('pet', value)} />}
              {!preset.category && <FilterSelect label="Categoría" options={categories} value={filters.category} setValue={value => update('category', value)} />}
              <FilterSelect label="Etapa de vida" options={stages} value={filters.stage} setValue={value => update('stage', value)} />
              <FilterSelect label="Marca" options={brands} value={filters.brand} setValue={value => update('brand', value)} />
              <FilterSelect label="Precio" options={priceLimits} value={filters.maxPrice ?? ''} setValue={value => update('maxPrice', value)} />
              <label className="checkbox"><input type="checkbox" checked={filters.stock} onChange={event => update('stock', event.target.checked ? '1' : '')} /> Solo disponibles</label>
              {!preset.sale && <label className="checkbox"><input type="checkbox" checked={filters.sale} onChange={event => update('sale', event.target.checked ? '1' : '')} /> Solo ofertas</label>}
              {resetNeeded && <button className="button button-plain filter-reset" type="button" onClick={() => setQuery({}, { replace: true })}>Limpiar filtros</button>}
            </div>
          </details>
        </aside>
        <section aria-label="Resultados del catálogo">
          <div className="catalog-toolbar">
            <p aria-live="polite"><LuFilter aria-hidden="true" />{results.length} {results.length === 1 ? 'producto' : 'productos'}</p>
            <label><span>Ordenar por</span><select aria-label="Ordenar por" value={filters.sort} onChange={event => update('sort', event.target.value)}>
              {Object.entries(sorts).map(([id, label]) => <option value={id} key={id}>{label}</option>)}
            </select></label>
          </div>
          {results.length ? (
            <div className="product-grid catalog-grid">{results.map(product => <ProductCard key={product.id} product={product} />)}</div>
          ) : (
            <EmptyState title={filters.favorites && !state.favorites.length ? 'Todavía no guardaste favoritos' : 'Sin resultados'}
              description={filters.favorites && !state.favorites.length ? 'Toca el corazón de un producto para encontrarlo aquí.' : 'Prueba con otros filtros o con una búsqueda más corta.'}
              to="/products" label="Ver catálogo" />
          )}
        </section>
      </div>
    </div>
  );
}
