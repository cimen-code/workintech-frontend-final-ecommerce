import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/axiosInstance.js'
import FormField, { inputClass } from '../components/FormField.jsx'
import Spinner from '../components/Spinner.jsx'
import { fetchRolesIfNeeded } from '../store/actions/clientActions.js'
import { EMAIL_PATTERN, isValidIban, isValidTurkishPhone, PASSWORD_PATTERN, TAX_NO_PATTERN } from '../utils/validators.js'

const ACTIVATION_MESSAGE = 'You need to click link in email to activate your account!'

function SignupPage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const roles = useSelector((state) => state.client.roles)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', role_id: '' },
  })

  // T09: roles are fetched only when this form needs them
  useEffect(() => {
    dispatch(fetchRolesIfNeeded())
      .then((list) => {
        const customer = list.find((role) => role.code === 'customer')
        if (customer && !getValues('role_id')) setValue('role_id', String(customer.id))
      })
      .catch(() => toast.error('Roles could not be loaded.'))
  }, [dispatch, getValues, setValue])

  const selectedRoleId = useWatch({ control, name: 'role_id' })
  const selectedRole = roles.find((role) => String(role.id) === String(selectedRoleId))
  const isStore = selectedRole?.code === 'store'

  const onSubmit = async (data) => {
    setServerError('')
    // Exact backend payload shape (extra/renamed fields cause backend errors)
    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      role_id: Number(data.role_id),
    }
    if (isStore) {
      payload.store = {
        name: data.store.name.trim(),
        phone: data.store.phone.replace(/[\s()-]/g, ''),
        tax_no: data.store.tax_no.trim(),
        bank_account: data.store.bank_account.replace(/\s+/g, '').toUpperCase(),
      }
    }

    try {
      await api.post('/signup', payload)
      toast.warning(ACTIVATION_MESSAGE, { autoClose: 8000 })
      const from = location.state?.from
      if (from) history.push(from)
      else if (history.location.key) history.goBack()
      else history.push('/')
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.response?.data?.err?.code === 'SQLITE_CONSTRAINT'
          ? 'This email or store is already registered.'
          : 'Sign up failed. Please check your information and try again.')
      setServerError(message)
      toast.error(message)
    }
  }

  return (
    <section className="flex w-full bg-light-gray-1 px-4 py-16">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-6 rounded-md bg-white p-6 shadow-md sm:p-10">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">Create an account</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <FormField id="name" label="Name" error={errors.name}>
            <input
              id="name"
              className={inputClass}
              {...register('name', {
                required: 'Name is required',
                validate: (value) => value.trim().length >= 3 || 'Name must be at least 3 characters',
              })}
            />
          </FormField>

          <FormField id="email" label="Email" error={errors.email}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={inputClass}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: EMAIL_PATTERN, message: 'Please enter a valid email address' },
              })}
            />
          </FormField>

          <FormField id="password" label="Password" error={errors.password}>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className={inputClass}
              {...register('password', {
                required: 'Password is required',
                pattern: {
                  value: PASSWORD_PATTERN,
                  message: 'Min 8 characters with a number, lower case, upper case and special character',
                },
              })}
            />
          </FormField>

          <FormField id="confirmPassword" label="Confirm Password" error={errors.confirmPassword}>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={inputClass}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === getValues('password') || 'Passwords do not match',
              })}
            />
          </FormField>

          <FormField id="role_id" label="Role" error={errors.role_id}>
            <select id="role_id" className={inputClass} {...register('role_id', { required: 'Role is required' })}>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </FormField>

          {isStore && (
            <fieldset className="flex flex-col gap-4 rounded-md border border-[#ECECEC] p-4">
              <legend className="px-2 text-sm font-bold text-primary-color">Store Information</legend>

              <FormField id="store-name" label="Store Name" error={errors.store?.name}>
                <input
                  id="store-name"
                  className={inputClass}
                  {...register('store.name', {
                    required: 'Store name is required',
                    validate: (value) => value.trim().length >= 3 || 'Store name must be at least 3 characters',
                  })}
                />
              </FormField>

              <FormField id="store-phone" label="Store Phone" error={errors.store?.phone}>
                <input
                  id="store-phone"
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  className={inputClass}
                  {...register('store.phone', {
                    required: 'Store phone is required',
                    validate: (value) => isValidTurkishPhone(value) || 'Please enter a valid Türkiye phone number',
                  })}
                />
              </FormField>

              <FormField id="store-tax" label="Store Tax ID" error={errors.store?.tax_no}>
                <input
                  id="store-tax"
                  placeholder="T1234V123456"
                  className={inputClass}
                  {...register('store.tax_no', {
                    required: 'Tax ID is required',
                    pattern: { value: TAX_NO_PATTERN, message: 'Tax ID must match TXXXXVXXXXXX (X is a digit)' },
                  })}
                />
              </FormField>

              <FormField id="store-iban" label="Store Bank Account" error={errors.store?.bank_account}>
                <input
                  id="store-iban"
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  className={inputClass}
                  {...register('store.bank_account', {
                    required: 'IBAN is required',
                    validate: (value) => isValidIban(value) || 'Please enter a valid IBAN',
                  })}
                />
              </FormField>
            </fieldset>
          )}

          {serverError && (
            <p role="alert" className="rounded-md bg-danger-color/10 px-4 py-3 text-sm font-bold text-danger-color">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || roles.length === 0}
            className="mt-2 flex items-center justify-center gap-3 rounded-md bg-primary-color px-6 py-3.5 text-sm font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-disabled-element-color"
          >
            {isSubmitting && <Spinner size="sm" className="border-white border-t-transparent" />}
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default SignupPage
