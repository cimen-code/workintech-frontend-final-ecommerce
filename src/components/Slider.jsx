import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

// T02: Swiper slider, driven by the arrow and indicator buttons. Each slide is rendered by `renderSlide(slide, isActive)`.
function Slider({ slides, renderSlide, className = '', arrowClassName = 'top-1/2 -translate-y-1/2' }) {
  const [swiper, setSwiper] = useState(null)
  const [current, setCurrent] = useState(0)
  const count = slides.length

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* z-0 keeps Swiper's own z-index below the arrow and indicator buttons */}
      <div className="relative z-0 w-full">
        <Swiper
          rewind
          speed={700}
          onSwiper={setSwiper}
          onSlideChange={(instance) => setCurrent(instance.activeIndex)}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id ?? index} aria-hidden={index !== current}>
              {renderSlide(slide, index === current)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => swiper?.slidePrev()}
            className={`absolute left-3 flex text-white ${arrowClassName}`}
          >
            <ChevronLeft size={80} strokeWidth={0.9} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => swiper?.slideNext()}
            className={`absolute right-[3px] flex text-white lg:right-1.5 ${arrowClassName}`}
          >
            <ChevronRight size={80} strokeWidth={0.9} />
          </button>

          <div className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 md:flex">
            {slides.map((slide, index) => (
              <button
                key={slide.id ?? index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => swiper?.slideTo(index)}
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
