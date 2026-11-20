import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import StoreHeader from './components/StoreHeader.jsx';
import StoreFooter from './components/StoreFooter.jsx';
import AppRoutes from './routes/Index.jsx';

function App() {
  const { pathname } = useLocation();
  const main = useRef(null);

  useEffect(() => {
    const heading = main.current?.querySelector('h1');
    document.title = pathname === '/' || !heading ? 'Patitas Felices · Tienda para perros y gatos'
      : heading.textContent + ' · Patitas Felices';
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="store-app">
      <StoreHeader />
      <main id="main" ref={main} tabIndex={-1}><AppRoutes /></main>
      <StoreFooter />
    </div>
  );
}

export default App;
