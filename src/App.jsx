import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import PageContent from './layout/PageContent.jsx'
import { verifyToken } from './store/actions/clientActions.js'
import { fetchCategoriesIfNeeded } from './store/actions/productActions.js'

function App() {
  const dispatch = useDispatch()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    dispatch(verifyToken()).finally(() => setAuthChecked(true))
    dispatch(fetchCategoriesIfNeeded())
  }, [dispatch])

  return <PageContent authChecked={authChecked} />
}

export default App
