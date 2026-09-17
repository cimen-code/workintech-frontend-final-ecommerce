# Workintech Frontend Final — E-Commerce

Workintech frontend final project (tasks T01–T23): a React e-commerce application built from the *Figma Ecommerce UI Kit* designs and the Workintech e-commerce API.

- API: `https://workintech-fe-ecommerce.onrender.com`

## Stack

React 18.2 · Vite 8 · React Router DOM 5.3.4 · Redux 4.2.1 + React Redux 8.1.3 + Redux Thunk 2.4.2 + Redux Logger 3.0.6 · Tailwind CSS 3.4 · Axios · react-hook-form · react-toastify · lucide-react

## Scripts

```bash
npm install
npm run dev      # development server
npm run lint
npm run build
npm run preview  # serve the production build
```

## Structure

```
src/
  api/          axios instance (raw token in Authorization header)
  components/   ProductCard, Slider, Pagination, OrderSummary, forms, ...
  data/         static Figma content (home, navigation, team, cities)
  layout/       Header, PageContent (routes), Footer
  pages/        Home, Shop, ProductDetail, Contact, Team, About, Signup, Login, Cart, CreateOrder, Orders
  store/        vanilla Redux store, reducers (client, product, shoppingCart), actions/thunks
  utils/        helpers and validators
public/images/  local design assets
postman/        Postman collection for the API endpoints
vercel.json     SPA rewrite for client-side routes
```

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/shop`, `/shop/:gender/:categoryName/:categoryId` | Shop (query params: `filter`, `sort`, `page`) |
| `/shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId` | Product detail |
| `/about`, `/team`, `/contact` | Inner pages |
| `/signup`, `/login` | Sign up, login |
| `/cart` | Shopping cart + order summary |
| `/order` (protected) | Create order: address and card steps |
| `/orders` (protected) | Previous orders |
