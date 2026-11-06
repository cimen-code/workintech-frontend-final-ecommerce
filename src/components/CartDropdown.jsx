import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { formatPrice, productImage } from '../utils/helpers.js'

// T17: all cart items listed in a header dropdown
function CartDropdown({ onNavigate }) {
  const cart = useSelector((state) => state.shoppingCart.cart)
  const itemCount = cart.reduce((sum, item) => sum + item.count, 0)

  // The dropdown is right-aligned to the cart button, so it may only grow leftwards: at mobile
  // widths the controls after that button take 76px, hence the 100vw-96px clamp (20px cushion).
  return (
    <div className="flex w-[min(360px,calc(100vw-96px))] flex-col gap-4 rounded-md border border-light-gray-1 bg-white p-4 text-left text-text-color shadow-xl">
      <p className="text-sm font-bold">
        My Cart <span className="font-normal text-second-text-color">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
      </p>

      {cart.length === 0 ? (
        <p className="py-6 text-center text-sm text-second-text-color">Your cart is empty.</p>
      ) : (
        <ul className="flex max-h-80 flex-col gap-3 overflow-y-auto">
          {cart.map((item) => (
            <li key={item.product.id} className="flex gap-3 border-b border-light-gray-1 pb-3">
              <img src={productImage(item.product)} alt={item.product.name} className="h-20 w-16 shrink-0 rounded object-cover" />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="line-clamp-2 text-sm font-bold">{item.product.name}</p>
                <p className="text-xs text-second-text-color">Quantity: {item.count}</p>
                <p className="text-sm font-bold text-alert-color">{formatPrice(item.product.price * item.count)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <Link
          to="/cart"
          onClick={onNavigate}
          className="flex flex-1 justify-center rounded border border-primary-color px-3 py-2.5 text-sm font-bold text-primary-color hover:bg-primary-color hover:text-white"
        >
          Go to Cart
        </Link>
        <Link
          to="/order"
          onClick={onNavigate}
          className="flex flex-1 justify-center rounded bg-primary-color px-3 py-2.5 text-sm font-bold text-white hover:opacity-90"
        >
          Checkout
        </Link>
      </div>
    </div>
  )
}

export default CartDropdown
