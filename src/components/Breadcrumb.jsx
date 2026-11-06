import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

function Breadcrumb({ items, gapClassName = 'gap-4', lastClassName = 'text-muted-color' }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center py-2.5 text-sm font-bold leading-6 tracking-[0.2px] ${gapClassName}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={item.label} className={`flex items-center ${gapClassName}`}>
            {isLast || !item.to ? (
              <span className={lastClassName}>{item.label}</span>
            ) : (
              <Link to={item.to} className="text-text-color hover:text-primary-color">
                {item.label}
              </Link>
            )}
            {!isLast && <ChevronRight className="-mx-[7px] h-5 w-5 stroke-[1.5] text-muted-color lg:-mx-[10.5px] lg:-my-[3px] lg:h-[30px] lg:w-[30px] lg:stroke-[1.1]" />}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
