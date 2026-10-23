<div align="center">

# 🐾 Patitas Felices

### Experiencia web para explorar productos y servicios para mascotas

[![React](https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-7-ca4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)

**Proyecto frontend · React + Vite · Portafolio de desarrollo web**

</div>

---

## Descripción

**Patitas Felices** es un proyecto web de temática pet shop desarrollado con **React**. Organiza distintas secciones de una tienda de mascotas en una interfaz con navegación por rutas, componentes reutilizables y estilos propios.

> **Alcance:** este repositorio demuestra principalmente implementación **frontend**. La presencia de pantallas de carrito, inicio de sesión o perfil no implica que existan una API, una pasarela de pago o autenticación de producción integradas. El contenido comercial de ejemplo no debe interpretarse como datos de una empresa real.

## Secciones implementadas en el enrutador

| Área | Ruta |
| --- | --- |
| Inicio | `/` |
| Productos para gatos | `/products/cat` |
| Productos para perros | `/products/dog` |
| Juguetes | `/products/toys` |
| Ropa y accesorios | `/products/clothes` |
| Servicios | `/services` |
| Carrito | `/cart` |
| Blog | `/blog` |
| Acceso | `/login` |
| Perfil | `/profile` |
| Nosotros | `/about` |
| Contacto | `/contact` |

Las rutas se definen en [`src/routes/Index.jsx`](src/routes/Index.jsx). El layout compartido incluye la barra de navegación y el pie de página.

## Tecnologías

- **React 19:** vistas y componentes.
- **Vite 6:** entorno de desarrollo y compilación.
- **React Router 7:** navegación entre pantallas.
- **Tailwind CSS 4 + CSS:** estilos visuales.
- **React Icons / FontAwesome:** iconografía.
- **React Slick:** carruseles de contenido.

## Ejecutar localmente

**Requisito:** Node.js compatible con la versión de Vite utilizada y npm.

```bash
git clone https://github.com/DevCodeBryan/web-petshop.git
cd web-petshop
npm install
npm run dev
```

Abre la dirección local que indique Vite en la terminal (habitualmente `http://localhost:5173`).

### Comandos disponibles

```bash
npm run dev      # servidor local
npm run build    # compilación de producción
npm run preview  # vista previa del build
npm run lint     # revisión con ESLint
```

## Estructura principal

```text
src/
├── components/   Componentes de interfaz reutilizables
├── layouts/      Estructura visual compartida
├── pages/        Pantallas de la aplicación
├── routes/       Definición de rutas
├── styles/       Estilos visuales
├── App.jsx       Integración de layout y rutas
└── main.jsx      Punto de entrada React
```

## Próximas mejoras

- [ ] Revisar accesibilidad y diseño responsive en todos los tamaños.
- [ ] Documentar estados vacíos, carga y errores de cada vista.
- [ ] Sustituir contenido y datos de contacto ficticios por datos apropiados para una demo.
- [ ] Incorporar pruebas automatizadas para componentes clave.
- [ ] Conectar el frontend con una API real **solo cuando esté implementada y verificada**.

## Autor

**Bryan** — [@DevCodeBryan](https://github.com/DevCodeBryan)

Este repositorio forma parte de mi portafolio de desarrollo de software.
