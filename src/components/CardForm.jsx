import { useForm } from 'react-hook-form'
import FormField, { inputClass } from './FormField.jsx'
import { isCardExpired, isValidCardNumber } from '../utils/validators.js'

const currentYear = new Date().getFullYear()
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1)
const YEARS = Array.from({ length: 12 }, (_, index) => currentYear + index)

// T21: field names match the backend exactly
function CardForm({ initialValues, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      card_no: initialValues?.card_no || '',
      expire_month: initialValues?.expire_month || '',
      expire_year: initialValues?.expire_year || '',
      name_on_card: initialValues?.name_on_card || '',
    },
  })

  const submit = (data) =>
    onSubmit({
      ...(initialValues?.id ? { id: String(initialValues.id) } : {}),
      card_no: data.card_no.replace(/\s+/g, ''),
      expire_month: Number(data.expire_month),
      expire_year: Number(data.expire_year),
      name_on_card: data.name_on_card.trim(),
    })

  // Shown on the year field; changing the month re-validates it through `deps`, so field order does not matter
  const notExpired = () =>
    !isCardExpired(getValues('expire_month'), getValues('expire_year')) || 'Card is expired'

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4 rounded-md border border-primary-color/40 bg-white p-5">
      <h3 className="text-base font-bold text-text-color">{initialValues?.id ? 'Update Card' : 'Add New Card'}</h3>
      <FormField id="card-no" label="Card Number" error={errors.card_no}>
        <input
          id="card-no"
          inputMode="numeric"
          autoComplete="off"
          placeholder="1234 1234 1234 1234"
          className={inputClass}
          {...register('card_no', {
            required: 'Card number is required',
            validate: (value) => isValidCardNumber(value) || 'Card number must be 16 digits',
          })}
        />
      </FormField>
      <div className="flex flex-col gap-4 sm:flex-row">
        <FormField id="card-month" label="Expire Month" error={errors.expire_month}>
          <select id="card-month" className={inputClass} {...register('expire_month', { required: 'Month is required', deps: ['expire_year'] })}>
            <option value="">Month</option>
            {MONTHS.map((month) => (
              <option key={month} value={month}>{String(month).padStart(2, '0')}</option>
            ))}
          </select>
        </FormField>
        <FormField id="card-year" label="Expire Year" error={errors.expire_year}>
          <select id="card-year" className={inputClass} {...register('expire_year', { required: 'Year is required', validate: notExpired })}>
            <option value="">Year</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </FormField>
      </div>
      <FormField id="card-name" label="Name on Card" error={errors.name_on_card}>
        <input
          id="card-name"
          autoComplete="off"
          className={inputClass}
          {...register('name_on_card', {
            required: 'Name on card is required',
            validate: (value) => value.trim().length >= 3 || 'Name must be at least 3 characters',
          })}
        />
      </FormField>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded-md border border-[#DDDDDD] px-5 py-2.5 text-sm font-bold text-second-text-color">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="rounded-md bg-primary-color px-5 py-2.5 text-sm font-bold text-white disabled:bg-disabled-element-color">
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default CardForm
