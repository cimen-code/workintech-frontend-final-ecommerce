import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import FormField, { inputClass } from '../components/FormField.jsx'
import { loginUser } from '../store/actions/clientActions.js'
import { EMAIL_PATTERN } from '../utils/validators.js'

function LoginPage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '', rememberMe: false } })

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data))
      history.replace(location.state?.from || '/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
    }
  }

  return (
    <section className="flex w-full bg-light-gray-1 px-4 py-16">
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-6 rounded-md bg-white p-6 shadow-md sm:p-10">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">Login</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <FormField id="login-email" label="Email" error={errors.email}>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className={inputClass}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: EMAIL_PATTERN, message: 'Please enter a valid email address' },
              })}
            />
          </FormField>

          <FormField id="login-password" label="Password" error={errors.password}>
            <input id="login-password" type="password" autoComplete="current-password" className={inputClass} {...register('password')} />
          </FormField>

          <label className="flex items-center gap-2 text-sm text-second-text-color">
            <input type="checkbox" className="h-4 w-4 accent-primary-color" {...register('rememberMe')} />
            Remember Me
          </label>

          <button
            type="submit"
            className="mt-2 flex items-center justify-center rounded-md bg-primary-color px-6 py-3.5 text-sm font-bold text-white hover:opacity-90"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  )
}

export default LoginPage
