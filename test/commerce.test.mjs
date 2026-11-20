import assert from 'node:assert/strict';
import test from 'node:test';
import { filterProducts, skuFor } from '../src/features/catalog/catalog.js';
import {
  addToCart, bookingDate, checkoutOrder, createBooking, deliveryCost, emptyShop,
  freeDeliveryAt, reorder, restoreShop, setQuantity, stockFor,
} from '../src/features/commerce/rules.js';

const ball = skuFor('pelota-cuerda', 'standard');
const soldOut = skuFor('collar-ajustable', 'l');
const delivery = { method: 'delivery', district: 'Miraflores', name: 'Andrea' };
const orderTime = { id: 'PF-TEST', now: new Date('2026-11-19T16:00:00Z') };

test('combines normalized search terms and catalog filters', () => {
  const result = filterProducts({ q: '  champu   perros ', pet: 'dog', category: 'hygiene' }, () => true, []);
  assert.deepEqual(result.map(product => product.id), ['champu-avena']);
});

test('sorts offered products and narrows to saved favorites', () => {
  const result = filterProducts({ sale: true, favorites: true, sort: 'low' }, () => true, ['canbo-adulto', 'pelota-cuerda', 'cat-chow-gatitos']);
  assert.deepEqual(result.map(product => product.id), ['pelota-cuerda', 'canbo-adulto']);
});

test('combines filters for brand, budget and availability', () => {
  const filters = { brand: 'Canbo', maxPrice: 6500, stock: true };
  assert.deepEqual(filterProducts(filters, () => true, []).map(product => product.id), ['canbo-adulto']);
  assert.deepEqual(filterProducts(filters, () => false, []), []);
  assert.deepEqual(filterProducts({ ...filters, maxPrice: 6400 }, () => true, []), []);
});

test('keeps one cart line per variant and removes it when its quantity becomes zero', () => {
  const first = addToCart(emptyShop(), ball, 2);
  const second = addToCart(first, ball, 3);
  assert.deepEqual(second.cart, [{ sku: ball, quantity: 5 }]);
  assert.deepEqual(first.cart, [{ sku: ball, quantity: 2 }]);
  assert.deepEqual(setQuantity(second, ball, 0).cart, []);
});

test('rejects depleted variants and incorrect input without changing the cart', () => {
  const state = emptyShop();
  assert.throws(() => addToCart(state, soldOut), /unidades suficientes/);
  assert.throws(() => setQuantity(state, ball, 23), /unidades suficientes/);
  assert.throws(() => setQuantity(state, ball, 1.5), /cantidad/);
  assert.deepEqual(state.cart, []);
});

test('quotes the right shipping rate and requires a known delivery district', () => {
  assert.equal(deliveryCost('delivery', 'Miraflores', freeDeliveryAt - 1), 990);
  assert.equal(deliveryCost('delivery', 'Miraflores', freeDeliveryAt), 0);
  assert.equal(deliveryCost('delivery', 'Ventanilla', freeDeliveryAt), null);
  assert.equal(deliveryCost('delivery', 'toString', 990), null);
  assert.equal(deliveryCost('pickup', '', 1490), 0);
});

test('snapshots prices, persists an order and clears the cart together', () => {
  const before = addToCart(emptyShop(), ball, 2);
  const { order, state } = checkoutOrder(before, delivery, orderTime);
  assert.equal(order.subtotal, 4980);
  assert.equal(order.delivery, 990);
  assert.equal(order.total, 5970);
  assert.equal(order.lines[0].option, 'Talla única');
  assert.deepEqual(state.cart, []);
  assert.equal(stockFor(state, ball), 20);
  assert.deepEqual(restoreShop(JSON.stringify(state)), state);
  assert.throws(() => checkoutOrder(state, delivery, orderTime), /Agrega productos/);
});

test('keeps a valid cart if the order cannot be submitted', () => {
  const state = addToCart(emptyShop(), ball, 1);
  assert.throws(() => checkoutOrder(state, { ...delivery, district: '' }, orderTime), /distrito/);
  assert.deepEqual(state.cart, [{ sku: ball, quantity: 1 }]);
});

test('reorders the original variant when stock allows', () => {
  const { state, order } = checkoutOrder(addToCart(emptyShop(), ball, 2), delivery, orderTime);
  assert.deepEqual(reorder(state, order.id).cart, [{ sku: ball, quantity: 2 }]);
  const sold = checkoutOrder(setQuantity(emptyShop(), ball, 22), delivery, orderTime);
  assert.throws(() => reorder(sold.state, sold.order.id), /unidades suficientes/);
  assert.deepEqual(sold.state.cart, []);
});

test('prevents double booking and permits a cancelled slot to be reused', () => {
  const now = new Date(2026, 10, 19, 8, 0);
  const slot = { service: 'bath', date: bookingDate(now), time: '11:30', petName: 'Luna' };
  const { state, booking } = createBooking(emptyShop(), slot, { id: 'CITA-A', now });
  assert.equal(booking.service, 'Baño y secado');
  assert.throws(() => createBooking(state, slot, { id: 'CITA-B', now }), /ya está reservado/);
  const cancelled = { ...state, bookings: [{ ...booking, cancelled: true }] };
  assert.equal(createBooking(cancelled, slot, { id: 'CITA-C', now }).state.bookings.length, 2);
  const later = new Date(2026, 10, 19, 12, 0);
  assert.throws(() => createBooking(emptyShop(), slot, { id: 'CITA-D', now: later }), /disponible/);
});

test('recovers from invalid storage and keeps valid saved lines', () => {
  assert.deepEqual(restoreShop('{'), emptyShop());
  assert.deepEqual(restoreShop('{"version":0,"cart":[null]}'), emptyShop());
  const parsed = restoreShop(JSON.stringify({
    version: 1, cart: [null, { sku: 'desconocido', quantity: 1 }, { sku: ball, quantity: 2 }],
    favorites: ['pelota-cuerda', 'pelota-cuerda'], orders: [{ id: 'invalid', lines: [null] }],
  }));
  assert.deepEqual(parsed.cart, [{ sku: ball, quantity: 2 }]);
  assert.deepEqual(parsed.favorites, ['pelota-cuerda']);
  assert.deepEqual(parsed.orders, []);
});
