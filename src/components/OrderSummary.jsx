import { formatPrice } from '../utils/helpers.js'

// T19: products total + shipping - discount = grand total
function OrderSummary({ summary, buttonLabel, onButtonClick, buttonDisabled = false, buttonLoading = false, children }) {
  const rows = [
    { label: 'Products Total', value: formatPrice(summary.productsTotal) },
    { label: 'Shipping', value: formatPrice(summary.shipping) },
    { label: 'Discount', value: `-${formatPrice(summary.discount)}`, className: 'text-alert-color' },
  ]

  const button = buttonLabel && (
    <button
      type="button"
      onClick={onButtonClick}
      disabled={buttonDisabled || buttonLoading}
      className="w-full rounded-md bg-primary-color px-6 py-3.5 text-sm font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-disabled-element-color"
    >
      {buttonLoading ? 'Please wait...' : buttonLabel}
    </button>
  )

  return (
    <aside className="flex w-full flex-col gap-4 lg:w-[320px] lg:shrink-0">
      {button}
      <div className="flex flex-col gap-4 rounded-md border border-[#ECECEC] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text-color">Order Summary</h2>
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm text-second-text-color">
            <span>{row.label}</span>
            <span className={`font-bold ${row.className || 'text-text-color'}`}>{row.value}</span>
          </div>
        ))}
        {summary.discount > 0 && (
          <p className="rounded bg-success-color/10 px-3 py-2 text-xs font-bold text-secondary-color-1">
            Free shipping on orders of $150 and above
          </p>
        )}
        <hr className="border-[#ECECEC]" />
        <div className="flex items-center justify-between text-base font-bold text-text-color">
          <span>Grand Total</span>
          <span className="text-primary-color">{formatPrice(summary.grandTotal)}</span>
        </div>
        {children}
      </div>
      {button}
    </aside>
  )
}

export default OrderSummary
