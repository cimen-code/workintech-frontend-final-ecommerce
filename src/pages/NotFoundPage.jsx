import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="flex w-full flex-col items-center gap-6 px-6 py-28 text-center">
      <h1 className="text-[58px] font-bold leading-[80px] text-text-color">404</h1>
      <p className="text-second-text-color">The page you are looking for does not exist.</p>
      <Link to="/" className="rounded-md bg-primary-color px-8 py-3 text-sm font-bold text-white">
        Back to Home
      </Link>
    </section>
  )
}

export default NotFoundPage
