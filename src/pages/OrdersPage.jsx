import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'
import api from '../api/axiosInstance.js'
import Spinner from '../components/Spinner.jsx'
import { formatPrice, productImage } from '../utils/helpers.js'

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('tr-TR')
}

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('loading')
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    let active = true
    api
      .get('/order')
      .then((res) => {
        if (!active) return
        const list = Array.isArray(res.data) ? res.data : []
        setOrders(list)
        setStatus('done')
      })
      .catch(() => {
        if (active) setStatus('failed')
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="flex w-full bg-light-gray-1 px-4 py-12">
      <div className="mx-auto flex w-full min-w-0 max-w-[1050px] flex-col gap-6">
        <h1 className="text-2xl font-bold text-text-color">Previous Orders</h1>

        {status === 'loading' && (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        )}
        {status === 'failed' && <p className="py-10 text-danger-color">Orders could not be loaded.</p>}
        {status === 'done' && orders.length === 0 && (
          <div className="flex flex-col items-start gap-4 rounded-md bg-white p-8">
            <p className="text-second-text-color">You have not placed any orders yet.</p>
            <Link to="/shop" className="rounded-md bg-primary-color px-6 py-2.5 text-sm font-bold text-white">Start Shopping</Link>
          </div>
        )}

        {status === 'done' && orders.length > 0 && (
          <div className="relative w-full overflow-x-auto rounded-md border border-[#ECECEC] bg-white">
            <table className="w-full text-left text-sm sm:min-w-[600px]">
              <thead className="bg-light-gray-1 text-xs uppercase text-second-text-color">
                <tr>
                  <th className="px-2 py-3 sm:px-4">Order</th>
                  <th className="px-2 py-3 sm:px-4">Date</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Products</th>
                  <th className="px-2 py-3 sm:px-4">Total</th>
                  <th className="px-2 py-3 sm:px-4"><span className="sr-only">Details</span></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const isOpen = openId === order.id
                  const products = order.products || []
                  return (
                    <Fragment key={order.id}>
                      <tr className="border-t border-[#ECECEC]">
                        <td className="px-2 py-4 font-bold text-text-color sm:px-4">#{order.id}</td>
                        <td className="px-2 py-4 text-xs text-second-text-color sm:px-4 sm:text-sm">{formatDate(order.order_date)}</td>
                        <td className="hidden px-4 py-4 text-second-text-color sm:table-cell">{products.length}</td>
                        <td className="px-2 py-4 font-bold text-primary-color sm:px-4">{formatPrice(order.price)}</td>
                        <td className="px-2 py-4 text-right sm:px-4">
                          <button
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : order.id)}
                            aria-expanded={isOpen}
                            className="inline-flex items-center gap-1 rounded-md border border-primary-color px-3 py-1.5 text-xs font-bold text-primary-color"
                          >
                            Details {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="bg-light-gray-1">
                          <td colSpan={5} className="px-4 py-4">
                            <div className="flex flex-col gap-3">
                              <p className="text-xs text-second-text-color">
                                {order.address_id ? `Address ID: ${order.address_id} · ` : ''}Card: {order.card_name || '-'}
                              </p>
                              {products.map((item, index) => (
                                <div key={`${order.id}-${item.id ?? item.product_id ?? index}`} className="flex items-center gap-3 rounded-md bg-white p-3">
                                  {item.images && <img src={productImage(item)} alt={item.name} className="h-16 w-12 rounded object-cover" />}
                                  <div className="flex flex-1 flex-col">
                                    <span className="font-bold text-text-color">{item.name || `Product #${item.product_id ?? item.id}`}</span>
                                    <span className="text-xs text-second-text-color">{item.detail || item.description}</span>
                                  </div>
                                  <span className="text-sm text-second-text-color">x{item.count}</span>
                                  {item.price !== undefined && <span className="font-bold text-text-color">{formatPrice(item.price)}</span>}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default OrdersPage
