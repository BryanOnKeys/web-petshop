export const pets = { dog: 'Perros', cat: 'Gatos', both: 'Perros y gatos' };
export const categories = {
  food: 'Alimentos',
  toys: 'Juguetes',
  accessories: 'Accesorios',
  hygiene: 'Higiene',
};
export const stages = { junior: 'Cachorro o gatito', adult: 'Adulto', all: 'Todas las edades' };

const variant = (id, label, price, stock, previousPrice) => ({ id, label, price, stock, previousPrice });

export const products = [
  {
    id: 'canbo-adulto', name: 'Canbo Adulto Cordero y Arroz', brand: 'Canbo',
    pet: 'dog', category: 'food', stage: 'adult', image: 'canbo', featured: true,
    description: 'Alimento seco para perros adultos de razas medianas y grandes. Elige la presentación según el consumo y el espacio disponible en casa.',
    details: ['Alimento seco', 'Para perros adultos', 'Consulta la ración en el empaque'],
    variants: [
      variant('3kg', '3 kg', 6490, 18, 7490),
      variant('12kg', '12 kg', 19990, 7, 21990),
    ],
  },
  {
    id: 'cat-chow-gatitos', name: 'Cat Chow Gatitos', brand: 'Purina',
    pet: 'cat', category: 'food', stage: 'junior', image: 'catchow', featured: true,
    description: 'Alimento seco para gatitos. La presentación pequeña es práctica para probarlo antes de pasar a una bolsa de mayor tamaño.',
    details: ['Alimento seco', 'Para gatitos', 'Consulta la ración en el empaque'],
    variants: [variant('1kg', '1 kg', 2990, 14), variant('3kg', '3 kg', 7690, 10)],
  },
  {
    id: 'pelota-cuerda', name: 'Pelota con cuerda', brand: 'Patitas Felices',
    pet: 'both', category: 'toys', stage: 'all', image: 'ball', featured: true,
    description: 'Una pelota con cuerda para alternar entre juegos de búsqueda y de tira y afloja. Guarda el juguete después de cada sesión y revisa su estado.',
    details: ['Cuerda con asa', 'Juego supervisado', 'Acabado rojo'],
    variants: [variant('standard', 'Talla única', 2490, 22, 2990)],
  },
  {
    id: 'cama-nido', name: 'Cama nido con cojín', brand: 'Patitas Felices',
    pet: 'both', category: 'accessories', stage: 'all', image: 'bed', featured: true,
    description: 'Cama circular de tejido trenzado con un cojín suave. Mide el espacio y considera cuánto ocupa tu mascota acostada antes de elegir.',
    details: ['Cojín extraíble', 'Fibra trenzada', 'Uso en interiores'],
    variants: [variant('s', '40 cm', 8990, 6, 10990), variant('m', '55 cm', 11990, 5)],
  },
  {
    id: 'collar-ajustable', name: 'Collar ajustable azul', brand: 'Patitas Felices',
    pet: 'dog', category: 'accessories', stage: 'all', image: 'collar',
    description: 'Collar con cierre de hebilla para el paseo diario. Mide el contorno del cuello y elige una talla dentro del rango indicado.',
    details: ['Hebilla de liberación rápida', 'Correa ajustable', 'Color azul'],
    variants: [
      variant('s', 'S · 25–35 cm', 2790, 8),
      variant('m', 'M · 35–48 cm', 3290, 10),
      variant('l', 'L · 48–60 cm', 3790, 0),
    ],
  },
  {
    id: 'champu-avena', name: 'Champú suave para perros', brand: 'Paw Fume',
    pet: 'dog', category: 'hygiene', stage: 'all', image: 'shampoo',
    description: 'Champú de uso externo para el baño. Sigue las indicaciones del envase y evita el contacto con ojos y oídos.',
    details: ['Dosificador', 'Uso externo', 'Botella de 500 ml'],
    variants: [variant('500ml', '500 ml', 3190, 11)],
  },
  {
    id: 'rascador-esquina', name: 'Rascador vertical de esquina', brand: 'Patitas Felices',
    pet: 'cat', category: 'toys', stage: 'all', image: 'scratcher',
    description: 'Superficie vertical de rascado con base de apoyo. Colócala cerca de un área donde tu gato ya acostumbre jugar o descansar.',
    details: ['Formato vertical', 'Base de apoyo', 'Uso de interior'],
    variants: [variant('standard', '48 cm', 7990, 5, 8990)],
  },
  {
    id: 'rascador-onda', name: 'Rascador de cartón tipo onda', brand: 'Patitas Felices',
    pet: 'cat', category: 'toys', stage: 'all', image: 'wave',
    description: 'Rascador horizontal con forma ondulada para áreas pequeñas. La textura de cartón ofrece una superficie para rascar y descansar.',
    details: ['Cartón corrugado', 'Formato horizontal', 'Incluye juguete colgante'],
    variants: [variant('standard', '45 cm', 3990, 8)],
  },
  {
    id: 'arena-kiokat', name: 'Arena aglomerante Kiokat', brand: 'Kiokat',
    pet: 'cat', category: 'hygiene', stage: 'all', image: 'litter',
    description: 'Arena aglomerante para areneros. Retira los grumos a diario y repón la arena siguiendo las indicaciones del empaque.',
    details: ['Textura aglomerante', 'Para areneros', 'Bolsa de 5 kg'],
    variants: [variant('5kg', '5 kg', 2190, 20, 2490)],
  },
];

export const productById = new Map(products.map(product => [product.id, product]));
export const brands = Object.fromEntries([...new Set(products.map(product => product.brand))].sort().map(brand => [brand, brand]));
export const skuFor = (productId, variantId) => productId + ':' + variantId;
export const itemBySku = new Map(products.flatMap(product =>
  product.variants.map(option => [skuFor(product.id, option.id), { product, option }]),
));
export const lowestPrice = product => Math.min(...product.variants.map(option => option.price));
export const onSale = product => product.variants.some(option => option.previousPrice > option.price);

const prices = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });
export const money = cents => prices.format(cents / 100);

export function catalogLink(filters = {}) {
  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
  return '/products' + (query.size ? '?' + query.toString() : '');
}

export function normalizeText(value) {
  return value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();
}

export function filterProducts(filters, isAvailable, favoriteIds) {
  const terms = normalizeText(filters.q ?? '').split(/\s+/).filter(Boolean);
  const results = products.filter(product => {
    if (filters.pet && ![filters.pet, 'both'].includes(product.pet)) return false;
    if (filters.category && filters.category !== product.category) return false;
    if (filters.stage && ![filters.stage, 'all'].includes(product.stage)) return false;
    if (filters.brand && filters.brand !== product.brand) return false;
    if (filters.maxPrice && lowestPrice(product) > filters.maxPrice) return false;
    if (filters.sale && !onSale(product)) return false;
    if (filters.stock && !isAvailable(product)) return false;
    if (filters.favorites && !favoriteIds.includes(product.id)) return false;

    const searchable = normalizeText([
      product.name, product.description, product.brand, categories[product.category],
      pets[product.pet], stages[product.stage], ...product.variants.map(option => option.label),
    ].join(' '));
    return terms.every(term => searchable.includes(term));
  });
  if (filters.sort === 'low') results.sort((a, b) => lowestPrice(a) - lowestPrice(b));
  if (filters.sort === 'high') results.sort((a, b) => lowestPrice(b) - lowestPrice(a));
  if (filters.sort === 'name') results.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  return results;
}
