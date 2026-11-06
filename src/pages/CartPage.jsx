import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import OrderSummary from '../components/OrderSummary.jsx'
import {
  changeCartItemCount,
  removeFromCart,
  toggleCartItem,
} from '../store/actions/shoppingCartActions.js'
import { calculateOrderSummary, formatPrice, productImage, productPath } from '../utils/helpers.js'

// T18: shopping cart data table, T19: order summary box
function CartPage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const cart = useSelector((state) => state.shoppingCart.cart)
  const categories = useSelector((state) => state.product.categories)

  const summary = calculateOrderSummary(cart)
  const checkedCount = cart.filter((item) => item.checked).length

  if (cart.length === 0) {
    return (
      <section className="flex w-full flex-col items-center gap-6 bg-light-gray-1 px-6 py-28 text-center">
        <h1 className="text-2xl font-bold text-text-color">Your cart is empty</h1>
        <p className="text-sm text-second-text-color">Add some products to see them here.</p>
        <Link to="/shop" className="rounded-md bg-primary-color px-8 py-3 text-sm font-bold text-white">
          Continue Shopping
        </Link>
      </section>
    )
  }

  return (
    <section className="flex w-full bg-light-gray-1 px-4 py-12">
      <div className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex w-full min-w-0 flex-col gap-4">
          <h1 className="text-2xl font-bold text-text-color">
            My Cart <span className="text-base font-normal text-second-text-color">({cart.length} {cart.length === 1 ? 'product' : 'products'})</span>
          </h1>

          <div className="relative w-full overflow-x-auto rounded-md border border-[#ECECEC] bg-white">
            <table className="w-full text-left text-sm sm:min-w-[640px]">
              <thead className="bg-light-gray-1 text-xs uppercase text-second-text-color">
                <tr>
                  <th className="px-2 py-3 sm:px-4"><span className="sr-only sm:not-sr-only">Select</span></th>
                  <th className="px-2 py-3 sm:px-4">Product</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Price</th>
                  <th className="px-2 py-3 sm:px-4">Quantity</th>
                  <th className="px-2 py-3 sm:px-4">Total</th>
                  <th className="px-1 py-3 sm:px-4"><span className="sr-only">Remove</span></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.product.id} className="border-t border-[#ECECEC]">
                    <td className="px-2 py-4 sm:px-4">
                      <input
                        type="checkbox"
                        aria-label={`Select ${item.product.name}`}
                        checked={item.checked}
                        onChange={() => dispatch(toggleCartItem(item.product.id))}
                        className="h-5 w-5 accent-primary-color"
                      />
                    </td>
                    <td className="px-2 py-4 sm:px-4">
                      <Link to={productPath(item.product, categories)} className="flex items-center gap-2 sm:gap-3">
                        <img src={productImage(item.product)} alt={item.product.name} className="h-14 w-10 rounded object-cover min-[414px]:h-16 min-[414px]:w-12 sm:h-20 sm:w-16" />
                        <div className="flex max-w-[260px] flex-col gap-1">
                          <span className="font-bold text-text-color">{item.product.name}</span>
                          <span className="hidden text-xs text-second-text-color sm:line-clamp-2">{item.product.description}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="hidden px-4 py-4 font-bold text-text-color sm:table-cell">{formatPrice(item.product.price)}</td>
                    <td className="px-2 py-4 sm:px-4">
                      <div className="flex w-fit items-center rounded-md border border-[#DDDDDD]">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => dispatch(changeCartItemCount(item.product.id, -1))}
                          disabled={item.count <= 1}
                          className="flex p-1 text-primary-color disabled:text-muted-color sm:p-2"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 text-center font-bold sm:w-8">{item.count}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => dispatch(changeCartItemCount(item.product.id, 1))}
                          className="flex p-1 text-primary-color sm:p-2"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-2 py-4 font-bold text-alert-color sm:px-4">{formatPrice(item.product.price * item.count)}</td>
                    <td className="px-1 py-4 sm:px-4">
                      <button
                        type="button"
                        aria-label={`Remove ${item.product.name}`}
                        onClick={() => dispatch(removeFromCart(item.product.id))}
                        className="flex p-1 text-second-text-color hover:text-danger-color sm:p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#ECECEC] bg-light-gray-1">
                  <td colSpan={4} className="px-2 py-4 text-right font-bold text-text-color sm:px-4">
                    Selected ({checkedCount}) total
                  </td>
                  <td colSpan={2} className="px-2 py-4 text-base font-bold text-primary-color sm:px-4">{formatPrice(summary.productsTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <OrderSummary
          summary={summary}
          buttonLabel="Create Order"
          buttonDisabled={checkedCount === 0}
          onButtonClick={() => history.push('/order')}
        />
      </div>
    </section>
  )
}

export default CartPage
