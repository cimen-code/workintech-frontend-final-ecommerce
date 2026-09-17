import { Route, Switch } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import HomePage from '../pages/HomePage.jsx'

function PageContent() {
  return (
    <div className="min-h-screen bg-light-background-color font-montserrat text-text-color">
      <Header />

      <main>
        <Switch>
          <Route exact path="/" component={HomePage} />
        </Switch>
      </main>

      <Footer />
    </div>
  )
}

export default PageContent
