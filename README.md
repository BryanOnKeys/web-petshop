# Patitas Felices

Tienda de demostración para perros y gatos en español, con precios en soles. El proyecto forma parte del portafolio de [BryanOnKeys](https://github.com/BryanOnKeys).

- Catálogo con búsqueda, filtros, ofertas, favoritos y disponibilidad por presentación.
- Carrito persistente, cálculo de entrega o recojo y confirmación con referencia de pedido.
- Perfil local con pedidos, recompra y reservas de baño, peluquería o corte de uñas.
- Páginas de ayuda, entrega, guías y descripción de la tienda.

Los precios, el stock, las tarifas y los horarios son de demostración. Los registros usan el almacenamiento del navegador. El checkout simula el pago al recibir sin cobrar, enviar pedidos ni solicitar datos de tarjeta. La ruta de acceso anterior abre el perfil local.

## Ejecutar

Requiere Node.js 22 o superior y npm.

```bash
git clone https://github.com/BryanOnKeys/web-petshop.git
cd web-petshop
npm ci
npm run dev
```

`npm test` verifica filtros, cantidades, stock, tarifas, pedidos, reservas y restauración de datos. `npm run lint` comprueba el código y `npm run build` genera `dist/`. Usa `npm run preview` para inspeccionar la compilación. Al alojar el build, configura el servidor para servir `index.html` en rutas de React Router.

## Código

| Ruta | Responsabilidad |
| --- | --- |
| `src/features/catalog` | Productos, presentaciones, imágenes, precios y filtros. |
| `src/features/commerce` | Inventario de demostración, cotización, carrito, pedidos, reservas y persistencia. |
| `src/pages` | Vistas de la tienda, compra, cuenta y ayuda. |
| `src/components` | Navegación, pie de página, tarjetas, campos y elementos compartidos. |
| `src/routes/Index.jsx` | Rutas y enlaces heredados de categorías. |
| `src/styles` | Sistema visual y layouts adaptables. |

La estructura del catálogo tomó como referencia los filtros por mascota, presentación y etapa de [SuperPet](https://www.superpet.pe/perro/alimentos-y-snacks) y la elección de entrega o recojo de [Mascoterías](https://mascoterias.com/). La portada usa la fotografía generada de un perro y un gato en un estudio de tonos melocotón, optimizada en `src/assets/store/patitas-hero.webp`.
