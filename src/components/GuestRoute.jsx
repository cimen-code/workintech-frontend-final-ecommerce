import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import Spinner from './Spinner.jsx'

function GuestRoute({ component: Component, authChecked, ...rest }) {
  const user = useSelector((state) => state.client.user)
  const isLoggedIn = Boolean(user?.email)

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!authChecked) {
          return (
            <div className="flex min-h-[50vh] items-center justify-center">
              <Spinner size="lg" />
            </div>
          )
        }
        return isLoggedIn ? <Redirect to={props.location.state?.from || '/'} /> : <Component {...props} />
      }}
    />
  )
}

export default GuestRoute
