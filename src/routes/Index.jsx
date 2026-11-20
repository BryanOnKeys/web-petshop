import { Navigate, Route, Routes } from 'react-router-dom';
import { EmptyState } from '../components/StoreUI.jsx';
import Account from '../pages/Account.jsx';
import Basket from '../pages/Basket.jsx';
import Catalog from '../pages/Catalog.jsx';
import Checkout, { OrderSuccess } from '../pages/Checkout.jsx';
import ProductDetail from '../pages/ProductDetail.jsx';
import ServiceBooking from '../pages/ServiceBooking.jsx';
import { About, Article, Blog, Help, Shipping } from '../pages/ShopInformation.jsx';
import Storefront from '../pages/Storefront.jsx';

function NotFound() {
  return <div className="container page-space"><EmptyState title="Página no encontrada"
    description="Puedes volver al inicio o buscar un producto desde la barra superior." to="/" label="Volver al inicio" /></div>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Storefront />} />
      <Route path="/products" element={<Catalog />} />
      <Route path="/products/dog" element={<Catalog preset={{ pet: 'dog' }} key="dogs" />} />
      <Route path="/products/cat" element={<Catalog preset={{ pet: 'cat' }} key="cats" />} />
      <Route path="/products/toys" element={<Catalog preset={{ category: 'toys' }} key="toys" />} />
      <Route path="/products/clothes" element={<Catalog preset={{ category: 'accessories' }} key="accessories" />} />
      <Route path="/products/:productId" element={<ProductDetail />} />
      <Route path="/offers" element={<Catalog preset={{ sale: true }} key="offers" />} />
      <Route path="/favorites" element={<Catalog preset={{ favorites: true }} key="favorites" />} />
      <Route path="/cart" element={<Basket />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/success" element={<OrderSuccess />} />
      <Route path="/services" element={<ServiceBooking />} />
      <Route path="/profile" element={<Account />} />
      <Route path="/login" element={<Navigate to="/profile" replace />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/contact" element={<Help />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:articleId" element={<Article />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
