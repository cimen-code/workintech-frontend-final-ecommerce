import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/helpers.js'

const DEFAULT_COLORS = ['bg-primary-color', 'bg-secondary-color-1', 'bg-alert-color', 'bg-dark-background-color']

// Reusable product card (Home bestseller, Shop list, Product detail bestseller)
function ProductCard({ to, image, mobileImage, title, department, oldPrice, price, colors = DEFAULT_COLORS, imageClassName = 'aspect-[239/300]' }) {
  return (
    <Link
      to={to}
      className="group flex w-full cursor-pointer flex-col items-center bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={`flex w-full overflow-hidden bg-light-gray-1 ${imageClassName}`}>
        <picture className="flex h-full w-full">
          {mobileImage && <source media="(max-width: 767px)" srcSet={mobileImage} />}
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </picture>
      </div>

      <div className="flex w-full flex-col items-center gap-2.5 px-6 pb-9 pt-6 text-center">
        <h5 className="line-clamp-1 text-base font-bold leading-6 tracking-[0.1px] text-text-color">{title}</h5>
        <p className="line-clamp-1 text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color">{department}</p>
        <div className="flex items-center gap-1.5 px-1 py-1 text-base font-bold leading-6 tracking-[0.1px]">
          {oldPrice !== undefined && <span className="text-muted-color">{formatPrice(oldPrice)}</span>}
          <span className="text-secondary-color-1">{formatPrice(price)}</span>
        </div>
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {colors.map((color) => (
              <span key={color} className={`h-4 w-4 rounded-full ${color}`} />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export default ProductCard
