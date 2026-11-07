function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null

  const windowSize = 3
  let start = Math.max(1, page - 1)
  const end = Math.min(pageCount, start + windowSize - 1)
  start = Math.max(1, end - windowSize + 1)
  const pages = []
  for (let i = start; i <= end; i += 1) pages.push(i)

  const base = 'flex items-center justify-center border-l border-[#E9E9E9] px-4 py-6 text-sm font-bold leading-6 tracking-[0.2px] first:border-l-0 disabled:cursor-not-allowed'

  return (
    <nav aria-label="Pagination" className="flex overflow-hidden rounded-md border border-[#BDBDBD] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <button
        type="button"
        onClick={() => onChange(1)}
        disabled={page === 1}
        className={`${base} bg-[#F3F3F3] px-6 text-muted-color enabled:text-primary-color`}
      >
        First
      </button>
      {pages.map((number) => (
        <button
          key={number}
          type="button"
          onClick={() => onChange(number)}
          aria-current={number === page ? 'page' : undefined}
          className={`${base} w-12 ${number === page ? 'bg-primary-color text-white' : 'bg-white text-primary-color hover:bg-light-gray-1'}`}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        className={`${base} bg-white px-6 text-primary-color disabled:text-muted-color`}
      >
        Next
      </button>
    </nav>
  )
}

export default Pagination
