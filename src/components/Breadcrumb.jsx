import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-4 py-2.5 text-sm font-bold leading-6 tracking-[0.2px]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={item.label} className="flex items-center gap-4">
            {isLast || !item.to ? (
              <span className="text-muted-color">{item.label}</span>
            ) : (
              <Link to={item.to} className="text-text-color hover:text-primary-color">
                {item.label}
              </Link>
            )}
            {!isLast && <ChevronRight size={16} className="text-muted-color" />}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
