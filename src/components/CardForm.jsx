import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import FormField, { inputClass } from './FormField.jsx'
import { isValidCardNumber } from '../utils/validators.js'

const currentYear = new Date().getFullYear()
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1)
const YEARS = Array.from({ length: 12 }, (_, index) => currentYear + index)

// T21: field names match the backend exactly
function CardForm({ initialValues, onSubmit, onCancel }) {
  const formRef = useRef(null)

  useEffect(() => {
    if (initialValues?.id) formRef.current?.scrollIntoView({ block: 'start' })
  }, [initialValues?.id])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
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

  return (
    <form ref={formRef} onSubmit={handleSubmit(submit)} noValidate className="flex scroll-mt-4 flex-col gap-4">
      <h4 className="text-sm font-bold text-second-text-color">{initialValues?.id ? 'Update Card' : 'Add New Card'}</h4>
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
      <div className="flex gap-3">
        <FormField id="card-month" label="Expire Month" error={errors.expire_month}>
          <select id="card-month" className={inputClass} {...register('expire_month', { required: 'Month is required' })}>
            <option value="">Month</option>
            {MONTHS.map((month) => (
              <option key={month} value={month}>{String(month).padStart(2, '0')}</option>
            ))}
          </select>
        </FormField>
        <FormField id="card-year" label="Expire Year" error={errors.expire_year}>
          <select id="card-year" className={inputClass} {...register('expire_year', { required: 'Year is required' })}>
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
            validate: (value) => value.trim().length > 0 || 'Name on card is required',
          })}
        />
      </FormField>
      <div className="flex justify-end gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-md border border-[#DDDDDD] px-5 py-2.5 text-sm font-bold text-second-text-color">
            Cancel
          </button>
        )}
        <button type="submit" disabled={isSubmitting} className="rounded-md bg-primary-color px-5 py-2.5 text-sm font-bold text-white disabled:bg-disabled-element-color">
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default CardForm
