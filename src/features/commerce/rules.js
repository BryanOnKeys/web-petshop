import { itemBySku, productById, skuFor } from '../catalog/catalog.js';

export const districts = {
  'Lima Centro': 890,
  'Jesús María': 890,
  'Miraflores': 990,
  'Magdalena': 990,
  'San Isidro': 990,
  'Santiago de Surco': 1290,
  'San Miguel': 1290,
};
export const freeDeliveryAt = 14900;
export const pickupLocation = 'Punto de recojo demo · Lima Centro';
export const services = [
  { id: 'bath', name: 'Baño y secado', price: 4500, duration: '45 min', description: 'Baño, secado y cepillado básico para perros.' },
  { id: 'grooming', name: 'Peluquería', price: 6900, duration: '60 min', description: 'Baño y corte para perros, con tiempo para adaptar el servicio al tipo de pelo.' },
  { id: 'nails', name: 'Corte de uñas', price: 1800, duration: '20 min', description: 'Turno corto para el cuidado de las uñas de perros y gatos.' },
];
export const bookingTimes = ['10:00', '11:30', '14:00', '15:30', '17:00'];

export function emptyShop() {
  return { version: 1, cart: [], favorites: [], orders: [], bookings: [], profile: null };
}

const isObject = value => value && typeof value === 'object';
const isCartLine = line => isObject(line) && itemBySku.has(line.sku) && Number.isSafeInteger(line.quantity) && line.quantity > 0;
const asList = value => Array.isArray(value) ? value : [];
const isText = value => typeof value === 'string';
const isCents = value => Number.isSafeInteger(value) && value >= 0;
const isOrderLine = line => isObject(line) && isText(line.sku) && isText(line.name) && isText(line.option)
  && Number.isSafeInteger(line.quantity) && line.quantity > 0 && isCents(line.total);
const isOrder = order => isObject(order) && isText(order.id) && isText(order.date) && isText(order.location)
  && isCents(order.total) && isCents(order.subtotal) && isCents(order.delivery)
  && Array.isArray(order.lines) && order.lines.length > 0 && order.lines.every(isOrderLine);
const isBooking = booking => isObject(booking) && isText(booking.id) && isText(booking.date)
  && isText(booking.time) && isText(booking.service) && isText(booking.petName);

export function restoreShop(raw) {
  if (!raw) return emptyShop();
  try {
    const saved = JSON.parse(raw);
    if (!isObject(saved) || saved.version !== 1) return emptyShop();
    return {
      version: 1,
      cart: [...new Map(asList(saved.cart).filter(isCartLine).map(line => [line.sku, line])).values()],
      favorites: [...new Set(asList(saved.favorites).filter(id => productById.has(id)))],
      orders: asList(saved.orders).filter(isOrder),
      bookings: asList(saved.bookings).filter(isBooking),
      profile: isObject(saved.profile) && isText(saved.profile.name) ? {
        name: saved.profile.name,
        petName: isText(saved.profile.petName) ? saved.profile.petName : '',
        pet: ['dog', 'cat', 'both'].includes(saved.profile.pet) ? saved.profile.pet : '',
      } : null,
    };
  } catch {
    return emptyShop();
  }
}

export function stockFor(state, sku) {
  const initialStock = itemBySku.get(sku)?.option.stock ?? 0;
  const sold = state.orders.reduce((total, order) => total + order.lines.reduce((sum, line) =>
    line?.sku === sku && Number.isSafeInteger(line.quantity) && line.quantity > 0 ? sum + line.quantity : sum, 0), 0);
  return Math.max(0, initialStock - sold);
}

export function productInStock(state, product) {
  return product.variants.some(option => stockFor(state, skuFor(product.id, option.id)) > 0);
}

export function cartLines(state) {
  return state.cart.map(line => {
    const { product, option } = itemBySku.get(line.sku);
    return { ...line, product, option, stock: stockFor(state, line.sku), total: option.price * line.quantity };
  });
}

export function setQuantity(state, sku, quantity) {
  if (!itemBySku.has(sku) || !Number.isSafeInteger(quantity) || quantity < 0) {
    throw new Error('Revisa la presentación y la cantidad.');
  }
  if (quantity > stockFor(state, sku)) throw new Error('Esta presentación no tiene unidades suficientes.');
  const exists = state.cart.some(line => line.sku === sku);
  const cart = quantity === 0
    ? state.cart.filter(line => line.sku !== sku)
    : exists
      ? state.cart.map(line => line.sku === sku ? { sku, quantity } : line)
      : [...state.cart, { sku, quantity }];
  return { ...state, cart };
}

export function addToCart(state, sku, quantity = 1) {
  if (!Number.isSafeInteger(quantity) || quantity < 1) throw new Error('Elige una cantidad válida.');
  const inCart = state.cart.find(line => line.sku === sku)?.quantity ?? 0;
  return setQuantity(state, sku, inCart + quantity);
}

export function deliveryCost(method, district, subtotal) {
  if (method === 'pickup') return 0;
  if (method !== 'delivery' || !Object.hasOwn(districts, district)) return null;
  return subtotal >= freeDeliveryAt ? 0 : districts[district];
}

export function checkoutOrder(state, form, { id, now }) {
  const lines = cartLines(state);
  if (!lines.length) throw new Error('Agrega productos antes de continuar.');
  if (lines.some(line => line.quantity > line.stock)) throw new Error('Actualiza las cantidades según el stock disponible.');
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
  const delivery = deliveryCost(form.method, form.district, subtotal);
  if (delivery === null) throw new Error('Selecciona un distrito disponible para el delivery.');
  const name = form.name.trim();
  if (name.length < 2 || name.length > 60) throw new Error('Escribe un nombre de 2 a 60 caracteres.');
  const order = {
    id, date: now.toISOString(), name, method: form.method,
    location: form.method === 'pickup' ? pickupLocation : form.district,
    subtotal, delivery, total: subtotal + delivery,
    lines: lines.map(({ sku, product, option, quantity, total }) => ({
      sku, productId: product.id, name: product.name, option: option.label, unitPrice: option.price, quantity, total,
    })),
  };
  return { order, state: { ...state, cart: [], orders: [order, ...state.orders] } };
}

export function bookingDate(now = new Date()) {
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
}

export function bookedAt(state, date, time) {
  return state.bookings.some(booking => booking.date === date && booking.time === time && !booking.cancelled);
}

export function createBooking(state, form, { id, now }) {
  const service = services.find(item => item.id === form.service);
  const dateInRange = /^\d{4}-\d{2}-\d{2}$/.test(form.date) && form.date >= bookingDate(now);
  const end = new Date(now);
  end.setDate(end.getDate() + 30);
  if (!service || !dateInRange || form.date > bookingDate(end) || !bookingTimes.includes(form.time)) {
    throw new Error('Elige un servicio y un turno dentro de los próximos 30 días.');
  }
  const appointmentTime = new Date(form.date + 'T' + form.time);
  if (Number.isNaN(appointmentTime.getTime()) || bookingDate(appointmentTime) !== form.date || appointmentTime <= now) {
    throw new Error('Elige un horario que aún esté disponible.');
  }
  const petName = form.petName.trim();
  if (petName.length < 2 || petName.length > 40) throw new Error('Escribe el nombre de tu mascota.');
  if (bookedAt(state, form.date, form.time)) throw new Error('Ese turno ya está reservado en esta demo.');
  const booking = { id, service: service.name, price: service.price, petName, date: form.date, time: form.time, cancelled: false };
  return { booking, state: { ...state, bookings: [booking, ...state.bookings] } };
}

export function reorder(state, orderId) {
  const order = state.orders.find(item => item.id === orderId);
  if (!order) throw new Error('No encontramos ese pedido en este navegador.');
  return order.lines.reduce((next, line) => addToCart(next, line.sku, line.quantity), state);
}
