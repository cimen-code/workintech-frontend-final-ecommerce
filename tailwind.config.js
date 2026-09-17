/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        'primary-color': '#23A6F0',
        'text-color': '#252B42',
        'second-text-color': '#737373',
        'success-color': '#2DC071',
        'secondary-color-1': '#23856D',
        'dark-background-color': '#252B42',
        'light-background-color': '#FFFFFF',
        'light-text-color': '#FFFFFF',
        'light-text-gray-1': '#FAFAFA',
        'light-gray-1': '#FAFAFA',
        'muted-color': '#BDBDBD',
        'muted-text-color': '#BDBDBD',
        'danger-color': '#E74040',
        'alert-color': '#E77C40',
        'disabled-element-color': '#8EC2F2',
      },
    },
  },
  plugins: [],
}
