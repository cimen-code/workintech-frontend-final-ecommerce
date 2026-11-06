import { useForm } from 'react-hook-form'
import FormField, { inputClass } from './FormField.jsx'
import { cities } from '../data/cities.js'

const EMPTY_ADDRESS = { title: '', name: '', surname: '', phone: '', city: '', district: '', neighborhood: '', address: '' }

// T20: field names match the backend exactly
function AddressForm({ initialValues, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { ...EMPTY_ADDRESS, ...initialValues } })

  const required = (label) => ({
    required: `${label} is required`,
    validate: (value) => String(value).trim().length > 0 || `${label} is required`,
  })

  const submit = (data) => {
    const payload = {
      ...(initialValues?.id ? { id: initialValues.id } : {}),
      title: data.title.trim(),
      name: data.name.trim(),
      surname: data.surname.trim(),
      phone: data.phone.replace(/[\s()-]/g, ''),
      city: data.city,
      district: data.district.trim(),
      neighborhood: data.neighborhood.trim(),
      address: data.address.trim(),
    }
    return onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4 rounded-md border border-primary-color/40 bg-white p-5">
      <h3 className="text-base font-bold text-text-color">{initialValues?.id ? 'Update Address' : 'Add New Address'}</h3>
      <FormField id="addr-title" label="Address Title" error={errors.title}>
        <input id="addr-title" className={inputClass} placeholder="ev adresi" {...register('title', required('Address title'))} />
      </FormField>
      <div className="flex flex-col gap-4 sm:flex-row">
        <FormField id="addr-name" label="Name" error={errors.name}>
          <input id="addr-name" className={inputClass} {...register('name', required('Name'))} />
        </FormField>
        <FormField id="addr-surname" label="Surname" error={errors.surname}>
          <input id="addr-surname" className={inputClass} {...register('surname', required('Surname'))} />
        </FormField>
      </div>
      <FormField id="addr-phone" label="Phone" error={errors.phone}>
        <input
          id="addr-phone"
          type="tel"
          placeholder="05XX XXX XX XX"
          className={inputClass}
          {...register('phone', required('Phone'))}
        />
      </FormField>
      <div className="flex flex-col gap-4 sm:flex-row">
        <FormField id="addr-city" label="City (İl)" error={errors.city}>
          <select id="addr-city" className={inputClass} {...register('city', { required: 'City is required' })}>
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.value} value={city.value}>{city.label}</option>
            ))}
          </select>
        </FormField>
        <FormField id="addr-district" label="District (İlçe)" error={errors.district}>
          <input id="addr-district" className={inputClass} {...register('district', required('District'))} />
        </FormField>
      </div>
      <FormField id="addr-neighborhood" label="Neighborhood (Mahalle)" error={errors.neighborhood}>
        <input id="addr-neighborhood" className={inputClass} {...register('neighborhood', required('Neighborhood'))} />
      </FormField>
      <FormField id="addr-address" label="Address (street, building and door numbers)" error={errors.address}>
        <textarea id="addr-address" rows={3} className={inputClass} {...register('address', required('Address'))} />
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

export default AddressForm
