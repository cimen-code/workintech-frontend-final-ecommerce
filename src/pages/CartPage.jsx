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

function QuantityControl({ item, onChange }) {
  const buttonClass = 'flex w-6 items-center justify-center bg-light-gray-1 text-primary-color disabled:cursor-not-allowed disabled:text-muted-color min-[360px]:w-7 sm:w-9'

  return (
    <div className="flex h-8 w-fit items-stretch overflow-hidden rounded-md border border-[#DDDDDD] sm:h-10">
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(item.product.id, -1)} disabled={item.count <= 1} className={buttonClass}>
        <Minus size={14} />
      </button>
      <span className="flex w-7 items-center justify-center border-x border-[#DDDDDD] text-sm min-[360px]:w-8 sm:w-11">{item.count}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(item.product.id, 1)} className={buttonClass}>
        <Plus size={14} />
      </button>
    </div>
  )
}

function CartPage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const cart = useSelector((state) => state.shoppingCart.cart)
  const categories = useSelector((state) => state.product.categories)

  const summary = calculateOrderSummary(cart)
  const checkedCount = cart.filter((item) => item.checked).length
  const changeCount = (productId, delta) => dispatch(changeCartItemCount(productId, delta))

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
    <section className="flex w-full bg-white px-4 py-12">
      <div className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex w-full min-w-0 flex-col gap-4">
          <h1 className="text-2xl font-bold text-text-color">
            My Cart <span className="text-base font-normal text-second-text-color">({cart.length} {cart.length === 1 ? 'Product' : 'Products'})</span>
          </h1>

          <div className="w-full overflow-hidden rounded-md border border-[#ECECEC] bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-light-gray-1 text-xs uppercase text-second-text-color">
                <tr>
                  <th className="px-2 py-3 sm:px-4"><span className="sr-only sm:not-sr-only">Select</span></th>
                  <th className="px-2 py-3 sm:px-4">Product</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Quantity</th>
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
                    {/* w-full + max-w-0: the cell takes the free width and its long text truncates instead of widening the table */}
                    <td className="w-full max-w-0 px-2 py-4 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <Link
                          to={productPath(item.product, categories)}
                          tabIndex={-1}
                          className="flex h-[88px] w-10 shrink-0 overflow-hidden rounded-md border border-[#ECECEC] min-[360px]:w-14 sm:h-[104px] sm:w-[72px]"
                        >
                          <img src={productImage(item.product)} alt={item.product.name} className="h-full w-full object-cover" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <Link to={productPath(item.product, categories)} className="line-clamp-2 font-bold text-text-color sm:line-clamp-1">
                            {item.product.name}
                          </Link>
                          <p className="truncate text-xs text-second-text-color">{item.product.description}</p>
                          {/* T18 sample: on a phone the quantity sits under the name so the table needs no side scrolling */}
                          <div className="pt-1 sm:hidden">
                            <QuantityControl item={item} onChange={changeCount} />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 sm:table-cell">
                      <QuantityControl item={item} onChange={changeCount} />
                    </td>
                    <td className="px-2 py-4 font-bold text-alert-color sm:px-4 sm:text-lg">{formatPrice(item.product.price * item.count)}</td>
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
                  <td colSpan={5} className="px-2 py-4 sm:px-4">
                    <div className="flex items-center justify-end gap-4 font-bold text-text-color">
                      <span>Selected ({checkedCount}) total</span>
                      <span className="text-base text-primary-color">{formatPrice(summary.productsTotal)}</span>
                    </div>
                  </td>
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
