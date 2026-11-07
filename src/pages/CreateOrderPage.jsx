import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CircleCheck, Plus, Smartphone, UserRound } from 'lucide-react'
import AddressForm from '../components/AddressForm.jsx'
import CardForm from '../components/CardForm.jsx'
import { cityLabel } from '../data/cities.js'
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
import { calculateOrderSummary, formatPrice, maskCardNumber, maskPhone } from '../utils/helpers.js'

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

const LINK_CLASS = 'text-xs font-bold text-second-text-color underline underline-offset-2'
const TILE_STATE = {
  selected: 'border-primary-color bg-primary-color/5 ring-1 ring-inset ring-primary-color',
  idle: 'border-[#ECECEC] bg-light-gray-1',
}

// Only the step that can be opened from here is a button; the Change link of step 1 needs a plain box around it
function StepTab({ title, active, onClick, action, children }) {
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-current={active ? 'step' : undefined}
      className={`flex w-full min-w-0 flex-1 flex-col gap-1 border-b-4 p-3 text-left sm:p-4 ${active ? 'border-primary-color bg-white' : 'border-[#DDDDDD] bg-light-gray-1'}`}
    >
      <span className="flex items-start justify-between gap-2">
        <span className={`min-w-0 text-base font-bold sm:text-lg ${active ? 'text-primary-color' : 'text-text-color'}`}>{title}</span>
        {action}
      </span>
      {children}
    </Tag>
  )
}

function TileHeading({ id, name, label, checked, onSelect, editLabel, onEdit, deleteLabel, onDelete }) {
  return (
    <div className="flex min-h-6 items-center justify-between gap-2">
      <label htmlFor={id} className="flex min-w-0 cursor-pointer items-center gap-2 text-sm font-bold text-text-color">
        <input id={id} type="radio" name={name} checked={checked} onChange={onSelect} className="h-4 w-4 shrink-0 accent-primary-color" />
        <span className="truncate">{label}</span>
      </label>
      <div className="flex shrink-0 gap-2.5">
        <button type="button" aria-label={editLabel} onClick={onEdit} className={`${LINK_CLASS} hover:text-primary-color`}>Edit</button>
        <button type="button" aria-label={deleteLabel} onClick={onDelete} className={`${LINK_CLASS} hover:text-danger-color`}>Delete</button>
      </div>
    </div>
  )
}

function AddressTiles({ name, addresses, selectedId, showAdd, onAdd, onSelect, onEdit, onDelete }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-4">
      {showAdd && (
        <div className="flex w-full flex-col gap-2 md:w-[calc(50%-10px)]">
          {/* same height as the heading above an address tile, so the two boxes in a row line up */}
          <div className="hidden min-h-6 md:flex" />
          <button
            type="button"
            onClick={onAdd}
            className="flex min-h-[148px] w-full flex-1 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-[#DDDDDD] bg-light-gray-1 text-sm font-bold text-text-color hover:border-primary-color"
          >
            <Plus size={28} className="text-primary-color" />
            Add Address
          </button>
        </div>
      )}
      {addresses.map((address) => {
        const id = `${name}-address-${address.id}`
        const selected = selectedId === address.id
        return (
          <div key={address.id} className="flex w-full min-w-0 flex-col gap-2 md:w-[calc(50%-10px)]">
            <TileHeading
              id={id}
              name={name}
              label={address.title}
              checked={selected}
              onSelect={() => onSelect(address.id)}
              editLabel={`Edit address ${address.title}`}
              onEdit={() => onEdit(address)}
              deleteLabel={`Delete address ${address.title}`}
              onDelete={() => onDelete(address)}
            />
            <label htmlFor={id} className={`flex min-h-[148px] flex-1 cursor-pointer flex-col gap-2 rounded-md border p-4 ${selected ? TILE_STATE.selected : TILE_STATE.idle}`}>
              <span className="flex items-center justify-between gap-3 text-text-color">
                <span className="flex min-w-0 items-center gap-1.5 text-sm font-bold">
                  <UserRound size={14} className="shrink-0 text-alert-color" fill="currentColor" />
                  <span className="truncate">{address.name} {address.surname}</span>
                </span>
                <span className="flex min-w-0 shrink-0 items-center gap-1 text-xs">
                  <Smartphone size={14} className="shrink-0" />
                  <span className="max-w-[110px] truncate">{maskPhone(address.phone)}</span>
                </span>
              </span>
              <span className="flex min-w-0 flex-col text-xs leading-5 text-second-text-color">
                <span className="truncate">{address.neighborhood}</span>
                <span className="truncate">{address.district} / {cityLabel(address.city)}</span>
                <span className="line-clamp-2">{address.address}</span>
              </span>
            </label>
          </div>
        )
      })}
    </div>
  )
}

function CardTile({ card, selected, onSelect, onEdit, onDelete }) {
  const id = `card-${card.id}`

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 md:w-[calc(50%-8px)] lg:w-full xl:w-[calc(50%-8px)]">
      <TileHeading
        id={id}
        name="card"
        label={card.name_on_card}
        checked={selected}
        onSelect={onSelect}
        editLabel={`Edit card ${card.name_on_card}`}
        onEdit={onEdit}
        deleteLabel={`Delete card ${card.name_on_card}`}
        onDelete={onDelete}
      />
      <label htmlFor={id} className={`flex min-h-[112px] flex-1 cursor-pointer flex-col justify-between gap-4 rounded-md border p-3 ${selected ? TILE_STATE.selected : TILE_STATE.idle}`}>
        <span className="self-end text-sm font-bold text-text-color">{cardBrand(card.card_no)}</span>
        <span className="flex flex-col items-end gap-1 text-xs text-text-color">
          <span className="whitespace-nowrap">{maskCardNumber(card.card_no)}</span>
          <span>{String(card.expire_month).padStart(2, '0')}/{card.expire_year}</span>
        </span>
      </label>
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
  const [submitting, setSubmitting] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)

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
      .then(() => setAddressForm(null))
      .catch((error) => toast.error(apiError(error, 'Address could not be saved.')))

  const removeAddress = (address) => {
    dispatch(deleteAddress(address.id))
      .then(() => setAddressForm((current) => (current?.id === address.id ? null : current)))
      .catch((error) => toast.error(apiError(error, 'Address could not be deleted.')))
  }

  const saveCard = (payload) =>
    dispatch(payload.id ? updateCreditCard(payload) : addCreditCard(payload))
      .then(() => setCardForm(null))
      .catch((error) => toast.error(apiError(error, 'Card could not be saved.')))

  const removeCard = (card) => {
    dispatch(deleteCreditCard(card.id))
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
    dispatch(setPayment({ card_id: selectedCard.id }))
    try {
      await dispatch(createOrder(payload))
      setOrderCompleted(true)
      setCcv('')
      window.scrollTo(0, 0)
    } catch (error) {
      toast.error(apiError(error, 'Order could not be created.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (orderCompleted) {
    return (
      <section className="flex w-full flex-col items-center gap-6 bg-light-gray-1 px-6 py-28 text-center">
        <CircleCheck size={80} className="text-success-color" />
        <h1 className="text-3xl font-bold text-text-color">Congratulations! 🎉</h1>
        <p className="max-w-[480px] text-base text-second-text-color">Your order has been received.</p>
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
    <section className="flex w-full bg-white px-4 py-12">
      <div className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex w-full min-w-0 flex-col gap-6">
          <div className="flex overflow-hidden rounded-md border border-[#ECECEC]">
            <StepTab
              title="Address Information"
              active={step === 1}
              action={step === 2 && (
                <button type="button" onClick={() => setStep(1)} className={`${LINK_CLASS} shrink-0 pt-1 hover:text-primary-color`}>Change</button>
              )}
            >
              {selectedShipping ? (
                <>
                  <span className="truncate text-xs font-bold text-second-text-color">{selectedShipping.title}</span>
                  <span className="truncate text-xs text-second-text-color">{[selectedShipping.neighborhood, selectedShipping.address].filter(Boolean).join(', ')}</span>
                  <span className="truncate text-xs text-second-text-color">{selectedShipping.district} / {cityLabel(selectedShipping.city)}</span>
                </>
              ) : (
                <span className="text-xs text-second-text-color">Select a shipping address</span>
              )}
            </StepTab>
            <StepTab
              title="Payment Options"
              active={step === 2}
              onClick={step === 1 ? () => selectedShipping && goToPayment() : undefined}
            >
              <span className="text-xs text-second-text-color">You can pay safely with your debit or credit card</span>
            </StepTab>
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-6 rounded-md border border-[#ECECEC] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-text-color">Shipping Address</h2>
                <label className="flex items-center gap-2 text-sm text-second-text-color">
                  <input type="checkbox" checked={sameReceipt} onChange={(event) => setSameReceipt(event.target.checked)} className="h-4 w-4 accent-primary-color" />
                  Send the receipt to the same address
                </label>
              </div>

              {addressForm && <AddressForm key={addressForm.id || 'new'} initialValues={addressForm} onSubmit={saveAddress} onCancel={() => setAddressForm(null)} />}

              {loadingAddresses ? (
                <div className="flex justify-center py-8"><Spinner /></div>
              ) : (
                <AddressTiles
                  name="shipping"
                  addresses={addressList}
                  selectedId={selectedShipping?.id}
                  showAdd={!addressForm}
                  onAdd={() => setAddressForm({})}
                  onSelect={setShippingId}
                  onEdit={setAddressForm}
                  onDelete={removeAddress}
                />
              )}
              {!loadingAddresses && addressList.length === 0 && <p className="text-sm text-second-text-color">You have no saved addresses yet.</p>}

              {!sameReceipt && addressList.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-bold text-text-color">Receipt Address</h2>
                  <AddressTiles
                    name="receipt"
                    addresses={addressList}
                    selectedId={selectedReceipt?.id}
                    showAdd={!addressForm}
                    onAdd={() => setAddressForm({})}
                    onSelect={setReceiptId}
                    onEdit={setAddressForm}
                    onDelete={removeAddress}
                  />
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col rounded-md border border-[#ECECEC] bg-white">
              {/* Card is the only payment method, so this is a heading and the radio is only drawn */}
              <div className="flex items-start gap-3 border-b border-[#ECECEC] p-5">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-primary-color">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary-color" />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <h2 className="text-lg font-bold text-text-color">Pay by Card</h2>
                  <p className="text-sm text-second-text-color">You have chosen to pay by card. You can pay safely with your debit or credit card.</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="flex min-w-0 flex-col gap-5 p-5 md:flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-text-color">Card Information</h3>
                    {!cardForm && <button type="button" onClick={() => setCardForm({})} className={`${LINK_CLASS} hover:text-primary-color`}>Add New Card</button>}
                    {cardForm && creditCards.length > 0 && <button type="button" onClick={() => setCardForm(null)} className={`${LINK_CLASS} hover:text-primary-color`}>Pay with a saved card</button>}
                  </div>

                  {cardForm && (
                    <CardForm
                      key={cardForm.id || 'new'}
                      initialValues={cardForm}
                      onSubmit={saveCard}
                      onCancel={creditCards.length === 0 ? () => setCardForm(null) : undefined}
                    />
                  )}

                  {!cardForm && loadingCards && <div className="flex justify-center py-8"><Spinner /></div>}

                  {!cardForm && !loadingCards && (
                    <>
                      {creditCards.length === 0 && <p className="text-sm text-second-text-color">You have no saved cards yet.</p>}
                      {creditCards.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                          {creditCards.map((card) => (
                            <CardTile
                              key={card.id}
                              card={card}
                              selected={selectedCard?.id === card.id}
                              onSelect={() => setCardId(card.id)}
                              onEdit={() => setCardForm(card)}
                              onDelete={() => removeCard(card)}
                            />
                          ))}
                        </div>
                      )}
                      {selectedCard && (
                        <div className="flex flex-col gap-2">
                          <label htmlFor="ccv" className="text-sm font-bold text-text-color">CCV</label>
                          <input
                            id="ccv"
                            inputMode="numeric"
                            maxLength={3}
                            autoComplete="off"
                            value={ccv}
                            onChange={(event) => setCcv(event.target.value.replace(/\D/g, ''))}
                            className="w-28 rounded-md border border-[#DDDDDD] bg-light-gray-1 px-4 py-3 text-sm outline-none focus:border-primary-color"
                            placeholder="123"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {selectedCard && (
                  <div className="flex min-w-0 flex-col gap-4 border-t border-[#ECECEC] p-5 md:w-[45%] md:border-l md:border-t-0">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-lg font-bold text-text-color">Installment Options</h3>
                      <p className="text-sm text-second-text-color">Select the installment that suits your card</p>
                    </div>
                    {/* T21 sample shows a single "Tek Çekim" row; no installment plans are documented */}
                    <div className="overflow-hidden rounded-md border border-[#ECECEC]">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-light-gray-1 text-xs uppercase text-second-text-color">
                          <tr>
                            <th className="px-4 py-2">Installments</th>
                            <th className="px-4 py-2">Monthly Payment</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-[#ECECEC]">
                            <td className="px-4 py-3">
                              <label className="flex items-center gap-2 font-bold text-text-color">
                                <input type="radio" name="payment-option" checked readOnly className="accent-primary-color" />
                                Single Payment (Tek Çekim)
                              </label>
                            </td>
                            <td className="px-4 py-3 font-bold text-primary-color">{formatPrice(summary.grandTotal)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <OrderSummary
          summary={summary}
          buttonLabel={step === 1 ? 'Save and Continue' : 'Complete Order'}
          onButtonClick={step === 1 ? goToPayment : completeOrder}
          buttonDisabled={step === 1 ? !selectedShipping : !selectedCard || Boolean(cardForm)}
          buttonLoading={submitting}
        />
      </div>
    </section>
  )
}

export default CreateOrderPage
