import { useEffect, useState } from 'react'
import { gravatarUrl } from '../utils/helpers.js'

function Gravatar({ email, size = 32, className = '' }) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    let active = true
    gravatarUrl(email, size * 2).then((url) => {
      if (active) setSrc(url)
    })
    return () => {
      active = false
    }
  }, [email, size])

  return (
    <span className={`inline-flex shrink-0 overflow-hidden rounded-full bg-light-gray-1 ${className}`}>
      {src && <img src={src} alt={email} className="h-full w-full object-cover" />}
    </span>
  )
}

export default Gravatar
