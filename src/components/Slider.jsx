import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Lightweight, dependency-free slider. Each slide is rendered by `renderSlide`.
function Slider({ slides, renderSlide, autoPlayMs = 6000, className = '' }) {
  const [current, setCurrent] = useState(0)
  const count = slides.length

  const goTo = (index) => setCurrent((index + count) % count)

  useEffect(() => {
    if (!autoPlayMs || count < 2) return undefined
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % count), autoPlayMs)
    return () => clearInterval(timer)
  }, [autoPlayMs, count])

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id ?? index} className="flex w-full shrink-0" aria-hidden={index !== current}>
            {renderSlide(slide, index)}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo(current - 1)}
            className="absolute left-2 top-1/2 flex -translate-y-1/2 p-2 text-white md:left-8"
          >
            <ChevronLeft size={48} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo(current + 1)}
            className="absolute right-2 top-1/2 flex -translate-y-1/2 p-2 text-white md:right-8"
          >
            <ChevronRight size={48} strokeWidth={1.5} />
          </button>

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2">
            {slides.map((slide, index) => (
              <button
                key={slide.id ?? index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goTo(index)}
                className={`h-2.5 w-16 ${index === current ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Slider
