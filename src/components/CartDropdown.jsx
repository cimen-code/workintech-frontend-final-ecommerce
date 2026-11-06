import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { formatPrice, productImage } from '../utils/helpers.js'

// T17: all cart items listed in a header dropdown
function CartDropdown({ onNavigate }) {
  const cart = useSelector((state) => state.shoppingCart.cart)

  // The dropdown is right-aligned to the cart button, so it may only grow leftwards: at mobile
  // widths the controls after that button take 76px, hence the 100vw-96px clamp (20px cushion).
  return (
    <div className="flex w-[min(376px,calc(100vw-96px))] flex-col rounded-md border border-[#ECECEC] bg-white text-left text-text-color shadow-xl">
      <p className="px-5 py-4 text-base font-bold">
        My Cart <span className="font-normal">({cart.length} {cart.length === 1 ? 'Product' : 'Products'})</span>
      </p>

      {cart.length === 0 ? (
        <p className="border-t border-[#ECECEC] py-6 text-center text-sm text-second-text-color">Your cart is empty.</p>
      ) : (
        <ul className="flex max-h-[352px] flex-col overflow-y-auto">
          {cart.map((item) => (
            <li key={item.product.id} className="flex gap-4 border-t border-[#ECECEC] px-5 py-4">
              <span className="flex h-24 w-[68px] shrink-0 overflow-hidden rounded-md border border-[#ECECEC]">
                <img src={productImage(item.product)} alt={item.product.name} className="h-full w-full object-cover" />
              </span>
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="line-clamp-2 text-sm">{item.product.name}</p>
                <p className="text-xs text-second-text-color">Count: {item.count}</p>
                <p className="text-base text-alert-color">{formatPrice(item.product.price * item.count)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-3 border-t border-[#ECECEC] p-4">
        <Link
          to="/cart"
          onClick={onNavigate}
          className="flex flex-1 items-center justify-center rounded-md border border-primary-color px-3 py-2.5 text-sm font-bold text-primary-color hover:bg-primary-color hover:text-white"
        >
          Go to Cart
        </Link>
        <Link
          to="/order"
          onClick={onNavigate}
          className="flex flex-1 items-center justify-center rounded-md border border-primary-color bg-primary-color px-3 py-2.5 text-sm font-bold text-white hover:opacity-90"
        >
          Checkout
        </Link>
      </div>
    </div>
  )
}

export default CartDropdown
