function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  }

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-flex animate-spin rounded-full border-primary-color border-t-transparent ${sizes[size]} ${className}`}
    />
  )
}

export default Spinner
