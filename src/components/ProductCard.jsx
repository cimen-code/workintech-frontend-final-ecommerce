import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/helpers.js'

const DEFAULT_COLORS = ['bg-primary-color', 'bg-secondary-color-1', 'bg-alert-color', 'bg-secondary-color-1']

// Reusable product card (Home bestseller, Shop list, Product detail bestseller)
function ProductCard({ to, image, mobileImage, title, department, oldPrice, price, colors = DEFAULT_COLORS, imageClassName = 'aspect-[239/300]', imageLoading = 'lazy', alignLeft = false }) {
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
            loading={imageLoading}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </picture>
      </div>

      <div className={`flex w-full flex-col gap-2.5 pt-[26px] ${colors.length > 0 ? 'pb-[35px]' : 'pb-[34px]'} ${alignLeft ? 'items-start pl-[17px] pr-6 text-left lg:pl-[26px]' : 'items-center px-6 text-center'}`}>
        <h5 className="w-full truncate text-base font-bold leading-6 tracking-[0.1px] text-text-color">{title}</h5>
        <p className="w-full truncate text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color">{department}</p>
        <div className="mt-0.5 flex items-center gap-1.5 px-1 py-1 text-base font-bold leading-6 tracking-[0.1px]">
          {oldPrice !== undefined && <span className="text-muted-color">{formatPrice(oldPrice)}</span>}
          <span className="text-secondary-color-1">{formatPrice(price)}</span>
        </div>
        {colors.length > 0 && (
          <div className="-mt-px flex items-center gap-1.5">
            {colors.map((color, index) => (
              <span key={index} className={`h-4 w-4 rounded-full ${color}`} />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export default ProductCard
