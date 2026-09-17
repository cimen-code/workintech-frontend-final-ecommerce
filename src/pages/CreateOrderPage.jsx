import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CircleCheck, CreditCard, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import AddressForm from '../components/AddressForm.jsx'
import CardForm from '../components/CardForm.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import Spinner from '../components/Spinner.jsx'
import {
  addAddress,
  addCreditCard,
  deleteAddress,
  deleteCreditCard,
  fetchAddressList,
  fetchCreditCards,
  updateAddress,
  updateCreditCard,
} from '../store/actions/clientActions.js'
import { createOrder, setAddress, setPayment } from '../store/actions/shoppingCartActions.js'
import { calculateOrderSummary, formatPrice, maskCardNumber } from '../utils/helpers.js'

const apiError = (error, fallback) => error.response?.data?.message || fallback

const cardBrand = (cardNo = '') => {
  if (String(cardNo).startsWith('4')) return 'VISA'
  if (/^5[1-5]/.test(String(cardNo))) return 'MasterCard'
  if (/^3[47]/.test(String(cardNo))) return 'AMEX'
  return 'Card'
}

// "2024-01-10T14:18:30" (local time, no timezone), as in the T22 sample
const orderDate = () => {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function StepTab({ number, title, subtitle, active, done, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col gap-1 rounded-md border-b-4 bg-white p-4 text-left ${active ? 'border-primary-color' : 'border-transparent'}`}
    >
      <span className={`text-lg font-bold ${active ? 'text-primary-color' : 'text-text-color'}`}>
        {number}. {title} {done && <CircleCheck size={16} className="inline text-success-color" />}
      </span>
      <span className="line-clamp-2 text-xs text-second-text-color">{subtitle}</span>
    </button>
  )
}

function AddressCard({ address, selected, onSelect, onEdit, onDelete, name }) {
  return (
    <div className={`flex w-full flex-col gap-2 rounded-md border-2 bg-white p-4 ${selected ? 'border-alert-color bg-alert-color/5' : 'border-[#ECECEC]'}`}>
      <div className="flex items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-sm font-bold text-text-color">
          <input type="radio" name={name} checked={selected} onChange={onSelect} className="h-4 w-4 accent-alert-color" />
          {address.title}
        </label>
        <div className="flex gap-1">
          <button type="button" aria-label="Edit address" onClick={onEdit} className="flex p-1.5 text-second-text-color hover:text-primary-color">
            <Pencil size={16} />
          </button>
          <button type="button" aria-label="Delete address" onClick={onDelete} className="flex p-1.5 text-second-text-color hover:text-danger-color">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p className="text-sm font-bold text-text-color">
        {address.name} {address.surname} · <span className="font-normal">{address.phone}</span>
      </p>
      <p className="text-xs leading-5 text-second-text-color">
        {address.neighborhood}, {address.address ? `${address.address}, ` : ''}
        {address.district} / <span className="capitalize">{address.city}</span>
      </p>
    </div>
  )
}

function CreateOrderPage() {
  const dispatch = useDispatch()
  const { addressList, creditCards } = useSelector((state) => state.client)
  const cart = useSelector((state) => state.shoppingCart.cart)

  const [step, setStep] = useState(1)
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [loadingCards, setLoadingCards] = useState(true)
  const [shippingId, setShippingId] = useState(null)
  const [receiptId, setReceiptId] = useState(null)
  const [sameReceipt, setSameReceipt] = useState(true)
  const [addressForm, setAddressForm] = useState(null)
  const [cardId, setCardId] = useState(null)
  const [cardForm, setCardForm] = useState(null)
  const [ccv, setCcv] = useState('')
  const [installment, setInstallment] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)

  useEffect(() => {
    dispatch(fetchAddressList())
      .catch((error) => toast.error(apiError(error, 'Addresses could not be loaded.')))
      .finally(() => setLoadingAddresses(false))
    dispatch(fetchCreditCards())
      .catch((error) => toast.error(apiError(error, 'Cards could not be loaded.')))
      .finally(() => setLoadingCards(false))
  }, [dispatch])

  const checkedItems = cart.filter((item) => item.checked)
  const summary = calculateOrderSummary(cart)

  const selectedShipping = addressList.find((item) => item.id === shippingId) || addressList[0]
  const selectedReceipt = sameReceipt ? selectedShipping : addressList.find((item) => item.id === receiptId) || addressList[0]
  const selectedCard = creditCards.find((item) => item.id === cardId) || creditCards[0]

  const saveAddress = (payload) =>
    dispatch(payload.id ? updateAddress(payload) : addAddress(payload))
      .then(() => {
        toast.success(payload.id ? 'Address updated' : 'Address added')
        setAddressForm(null)
      })
      .catch((error) => toast.error(apiError(error, 'Address could not be saved.')))

  const removeAddress = (address) => {
    if (!window.confirm(`Delete "${address.title}"?`)) return
    dispatch(deleteAddress(address.id))
      .then(() => toast.success('Address deleted'))
      .catch((error) => toast.error(apiError(error, 'Address could not be deleted.')))
  }

  const saveCard = (payload) =>
    dispatch(payload.id ? updateCreditCard(payload) : addCreditCard(payload))
      .then(() => {
        toast.success(payload.id ? 'Card updated' : 'Card added')
        setCardForm(null)
      })
      .catch((error) => toast.error(apiError(error, 'Card could not be saved.')))

  const removeCard = (card) => {
    if (!window.confirm(`Delete card ${maskCardNumber(card.card_no)}?`)) return
    dispatch(deleteCreditCard(card.id))
      .then(() => toast.success('Card deleted'))
      .catch((error) => toast.error(apiError(error, 'Card could not be deleted.')))
  }

  const goToPayment = () => {
    if (!selectedShipping || !selectedReceipt) {
      toast.error('Please add and select an address.')
      return
    }
    dispatch(setAddress({ shipping: selectedShipping, receipt: selectedReceipt }))
    setStep(2)
    window.scrollTo(0, 0)
  }

  const completeOrder = async () => {
    if (!selectedCard) {
      toast.error('Please add and select a card.')
      return
    }
    if (!/^\d{3}$/.test(ccv)) {
      toast.error('Please enter the 3 digit CCV of your card.')
      return
    }

    const payload = {
      address_id: selectedShipping.id,
      order_date: orderDate(),
      card_no: Number(selectedCard.card_no),
      card_name: selectedCard.name_on_card,
      card_expire_month: Number(selectedCard.expire_month),
      card_expire_year: Number(selectedCard.expire_year),
      card_ccv: Number(ccv),
      price: Number(summary.grandTotal.toFixed(2)),
      products: checkedItems.map((item) => ({
        product_id: item.product.id,
        count: item.count,
        detail: item.product.description || item.product.name,
      })),
    }

    setSubmitting(true)
    dispatch(setPayment({ card_id: selectedCard.id, installment }))
    try {
      const result = await dispatch(createOrder(payload))
      setCompletedOrder({ id: result?.id, price: payload.price, itemCount: payload.products.length })
      setCcv('')
      toast.success('Your order has been created!')
      window.scrollTo(0, 0)
    } catch (error) {
      toast.error(apiError(error, 'Order could not be created.'))
    } finally {
      setSubmitting(false)
    }
  }

  // T22: congratulate the client after a successful order
  if (completedOrder) {
    return (
      <section className="flex w-full flex-col items-center gap-6 bg-light-gray-1 px-6 py-28 text-center">
        <CircleCheck size={80} className="text-success-color" />
        <h1 className="text-3xl font-bold text-text-color">Congratulations! 🎉</h1>
        <p className="max-w-[480px] text-base text-second-text-color">
          Your order{completedOrder.id ? ` #${completedOrder.id}` : ''} with {completedOrder.itemCount} product(s) totalling{' '}
          <strong className="text-text-color">{formatPrice(completedOrder.price)}</strong> has been received.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/orders" className="rounded-md bg-primary-color px-8 py-3 text-sm font-bold text-white">
            View My Orders
          </Link>
          <Link to="/shop" className="rounded-md border border-primary-color px-8 py-3 text-sm font-bold text-primary-color">
            Continue Shopping
          </Link>
        </div>
      </section>
    )
  }

  if (checkedItems.length === 0) {
    return (
      <section className="flex w-full flex-col items-center gap-6 bg-light-gray-1 px-6 py-28 text-center">
        <h1 className="text-2xl font-bold text-text-color">There are no selected products to order</h1>
        <Link to="/cart" className="rounded-md bg-primary-color px-8 py-3 text-sm font-bold text-white">
          Go to Cart
        </Link>
      </section>
    )
  }

  return (
    <section className="flex w-full bg-light-gray-1 px-4 py-12">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex w-full min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <StepTab
              number={1}
              title="Address Information"
              subtitle={selectedShipping ? `${selectedShipping.title} · ${selectedShipping.district} / ${selectedShipping.city}` : 'Select a shipping address'}
              active={step === 1}
              done={step === 2}
              onClick={() => setStep(1)}
            />
            <StepTab
              number={2}
              title="Payment Options"
              subtitle="You can pay safely with your debit or credit card"
              active={step === 2}
              done={false}
              onClick={() => selectedShipping && setStep(2)}
            />
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-6 rounded-md bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-bold text-text-color">
                  <MapPin size={20} className="text-alert-color" /> Shipping Address
                </h2>
                <label className="flex items-center gap-2 text-sm text-second-text-color">
                  <input type="checkbox" checked={sameReceipt} onChange={(event) => setSameReceipt(event.target.checked)} className="h-4 w-4 accent-primary-color" />
                  Send the receipt to the same address
                </label>
              </div>

              {!addressForm && (
                <button
                  type="button"
                  onClick={() => setAddressForm({})}
                  className="flex min-h-[80px] w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-[#DDDDDD] text-sm font-bold text-primary-color hover:border-primary-color"
                >
                  <Plus size={20} /> Add Address
                </button>
              )}
              {addressForm && <AddressForm key={addressForm.id || 'new'} initialValues={addressForm} onSubmit={saveAddress} onCancel={() => setAddressForm(null)} />}

              {loadingAddresses ? (
                <div className="flex justify-center py-8"><Spinner /></div>
              ) : (
                <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
                  {addressList.length === 0 && <p className="text-sm text-second-text-color">You have no saved addresses yet.</p>}
                  {addressList.map((address) => (
                    <div key={address.id} className="flex w-full md:w-[calc(50%-6px)]">
                      <AddressCard
                        name="shipping"
                        address={address}
                        selected={selectedShipping?.id === address.id}
                        onSelect={() => setShippingId(address.id)}
                        onEdit={() => setAddressForm(address)}
                        onDelete={() => removeAddress(address)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {!sameReceipt && addressList.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-text-color">
                    <MapPin size={20} className="text-primary-color" /> Receipt Address
                  </h2>
                  <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
                    {addressList.map((address) => (
                      <div key={address.id} className="flex w-full md:w-[calc(50%-6px)]">
                        <AddressCard
                          name="receipt"
                          address={address}
                          selected={selectedReceipt?.id === address.id}
                          onSelect={() => setReceiptId(address.id)}
                          onEdit={() => setAddressForm(address)}
                          onDelete={() => removeAddress(address)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6 rounded-md bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-bold text-text-color">
                  <CreditCard size={20} className="text-alert-color" /> Card Information
                </h2>
                {!cardForm && (
                  <button type="button" onClick={() => setCardForm({})} className="flex items-center gap-1 text-sm font-bold text-primary-color">
                    <Plus size={16} /> Add New Card
                  </button>
                )}
              </div>

              {cardForm && <CardForm key={cardForm.id || 'new'} initialValues={cardForm} onSubmit={saveCard} onCancel={() => setCardForm(null)} />}

              {loadingCards ? (
                <div className="flex justify-center py-8"><Spinner /></div>
              ) : (
                <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
                  {creditCards.length === 0 && <p className="text-sm text-second-text-color">You have no saved cards yet.</p>}
                  {creditCards.map((card) => {
                    const selected = selectedCard?.id === card.id
                    return (
                      <div
                        key={card.id}
                        className={`flex w-full flex-col gap-3 rounded-md border-2 p-4 md:w-[calc(50%-6px)] ${selected ? 'border-alert-color bg-alert-color/5' : 'border-[#ECECEC]'}`}
                      >
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm font-bold text-text-color">
                            <input type="radio" name="card" checked={selected} onChange={() => setCardId(card.id)} className="h-4 w-4 accent-alert-color" />
                            {cardBrand(card.card_no)}
                          </label>
                          <div className="flex gap-1">
                            <button type="button" aria-label="Edit card" onClick={() => setCardForm(card)} className="flex p-1.5 text-second-text-color hover:text-primary-color">
                              <Pencil size={16} />
                            </button>
                            <button type="button" aria-label="Delete card" onClick={() => removeCard(card)} className="flex p-1.5 text-second-text-color hover:text-danger-color">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="font-mono text-base tracking-widest text-text-color">{maskCardNumber(card.card_no)}</p>
                        <div className="flex justify-between text-xs text-second-text-color">
                          <span>{card.name_on_card}</span>
                          <span>{String(card.expire_month).padStart(2, '0')}/{card.expire_year}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {selectedCard && (
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="flex flex-col gap-2 md:w-1/3">
                    <label htmlFor="ccv" className="text-sm font-bold text-text-color">CCV</label>
                    <input
                      id="ccv"
                      inputMode="numeric"
                      maxLength={3}
                      autoComplete="off"
                      value={ccv}
                      onChange={(event) => setCcv(event.target.value.replace(/\D/g, ''))}
                      className="w-full rounded-md border border-[#DDDDDD] bg-light-gray-1 px-4 py-3 text-sm outline-none focus:border-primary-color"
                      placeholder="123"
                    />
                  </div>
                  <fieldset className="flex flex-col gap-2 md:w-2/3">
                    <legend className="pb-2 text-sm font-bold text-text-color">Payment options ({cardBrand(selectedCard.card_no)})</legend>
                    {[1, 3, 6].map((count) => (
                      <label key={count} className="flex items-center justify-between rounded-md border border-[#ECECEC] px-4 py-2 text-sm text-second-text-color">
                        <span className="flex items-center gap-2">
                          <input type="radio" name="installment" checked={installment === count} onChange={() => setInstallment(count)} className="accent-primary-color" />
                          {count === 1 ? 'Single payment' : `${count} installments`}
                        </span>
                        <span className="font-bold text-text-color">{formatPrice(summary.grandTotal / count)}{count > 1 ? ' / month' : ''}</span>
                      </label>
                    ))}
                  </fieldset>
                </div>
              )}
            </div>
          )}
        </div>

        <OrderSummary
          summary={summary}
          buttonLabel={step === 1 ? 'Save and Continue' : 'Complete Order'}
          onButtonClick={step === 1 ? goToPayment : completeOrder}
          buttonDisabled={step === 1 ? !selectedShipping : !selectedCard}
          buttonLoading={submitting}
        />
      </div>
    </section>
  )
}

export default CreateOrderPage
