import { useSyncExternalStore } from 'react';
import {
  addToCart, checkoutOrder, createBooking, emptyShop, reorder, restoreShop, setQuantity,
} from './rules.js';

const storageKey = 'patitas-felices:shop-v1';
const listeners = new Set();
let snapshot = emptyShop();
let storageAvailable = true;

function fromStorage() {
  try {
    if (!storageAvailable) return snapshot;
    return restoreShop(window.localStorage.getItem(storageKey));
  } catch {
    storageAvailable = false;
    return snapshot;
  }
}

function notify() {
  listeners.forEach(listener => listener());
}

function apply(update) {
  const { state, value } = update(fromStorage());
  if (storageAvailable) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      storageAvailable = false;
    }
  }
  snapshot = state;
  notify();
  return value;
}

function transact(update) {
  if (navigator.locks && storageAvailable) return navigator.locks.request(storageKey, () => apply(update));
  return Promise.resolve().then(() => apply(update));
}

snapshot = fromStorage();

window.addEventListener('storage', event => {
  if (!storageAvailable || (event.key !== storageKey && event.key !== null)) return;
  snapshot = restoreShop(event.newValue);
  notify();
});

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useShop() {
  return useSyncExternalStore(subscribe, () => snapshot);
}

const reference = prefix => prefix + '-' + Array.from(
  crypto.getRandomValues(new Uint8Array(6)),
  byte => byte.toString(16).padStart(2, '0').toUpperCase(),
).join('');

export const shop = {
  add: (sku, quantity) => transact(state => ({ state: addToCart(state, sku, quantity) })),
  quantity: (sku, quantity) => transact(state => ({ state: setQuantity(state, sku, quantity) })),
  favorite: id => transact(state => {
    const favorites = state.favorites.includes(id) ? state.favorites.filter(item => item !== id) : [...state.favorites, id];
    return { state: { ...state, favorites } };
  }),
  placeOrder: form => transact(state => {
    const result = checkoutOrder(state, form, { id: reference('PF'), now: new Date() });
    return { state: result.state, value: result.order };
  }),
  book: form => transact(state => {
    const result = createBooking(state, form, { id: reference('CITA'), now: new Date() });
    return { state: result.state, value: result.booking };
  }),
  cancelBooking: id => transact(state => ({
    state: { ...state, bookings: state.bookings.map(booking => booking.id === id ? { ...booking, cancelled: true } : booking) },
  })),
  saveProfile: profile => transact(state => ({ state: { ...state, profile } })),
  reorder: id => transact(state => ({ state: reorder(state, id) })),
  saved: () => storageAvailable,
};
