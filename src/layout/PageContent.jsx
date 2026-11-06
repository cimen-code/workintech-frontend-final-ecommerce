import { Route, Switch } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import HomePage from '../pages/HomePage.jsx'
import ShopPage from '../pages/ShopPage.jsx'
import ProductDetailPage from '../pages/ProductDetailPage.jsx'
import ContactPage from '../pages/ContactPage.jsx'
import TeamPage from '../pages/TeamPage.jsx'
import AboutPage from '../pages/AboutPage.jsx'
import SignupPage from '../pages/SignupPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import CartPage from '../pages/CartPage.jsx'
import CreateOrderPage from '../pages/CreateOrderPage.jsx'
import OrdersPage from '../pages/OrdersPage.jsx'

// Layout container: one Header, one Footer, and all route definitions
function PageContent({ authChecked }) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-light-background-color font-montserrat text-text-color">
      <Header />

      <main className="flex w-full flex-1 flex-col">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId" component={ProductDetailPage} />
          <Route path="/shop/:gender/:categoryName/:categoryId" component={ShopPage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/team" component={TeamPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/cart" component={CartPage} />
          <ProtectedRoute exact path="/order" component={CreateOrderPage} authChecked={authChecked} />
          <ProtectedRoute exact path="/orders" component={OrdersPage} authChecked={authChecked} />
        </Switch>
      </main>

      <Footer />
    </div>
  )
}

export default PageContent
