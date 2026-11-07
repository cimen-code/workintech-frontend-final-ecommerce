function FormField({ id, label, error, children }) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold leading-6 tracking-[0.2px] text-text-color">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs font-bold text-danger-color">
          {error.message}
        </p>
      )}
    </div>
  )
}

export const inputClass =
  'w-full rounded-md border border-[#DDDDDD] bg-light-gray-1 px-4 py-3 text-sm text-text-color outline-none focus:border-primary-color disabled:opacity-60'

export default FormField
