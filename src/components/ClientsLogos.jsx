// Figma "mobile-clients-3" stacks the six logos; tablet keeps the single row image; 1280 and up places each logo as drawn
const logos = [
  { name: 'Hooli', image: '/images/clients/hooli.png', desktopClass: 'xl:w-[103px]' },
  { name: 'Lyft', image: '/images/clients/lyft.png', desktopClass: 'xl:ml-[86px] xl:w-[84px]' },
  { name: 'Robinhood', image: '/images/clients/pied-piper.png', desktopClass: 'xl:ml-[86px] xl:w-[102px]' },
  { name: 'Stripe', image: '/images/clients/stripe.png', desktopClass: 'xl:ml-[79px] xl:w-[103px]' },
  { name: 'AWS', image: '/images/clients/aws.png', desktopClass: 'xl:ml-[77px] xl:w-[105px]' },
  { name: 'Reddit', image: '/images/clients/reddit.png', desktopClass: 'xl:ml-[90px] xl:w-[77px]' },
]

function ClientsLogos({ className = 'py-12' }) {
  return (
    <section className={`flex w-full bg-light-gray-1 ${className}`}>
      <div className="mx-auto flex w-full max-w-[1050px] justify-center px-8 xl:px-0">
        <div className="flex flex-col items-center gap-[60px] md:hidden xl:-ml-3 xl:flex xl:shrink-0 xl:flex-row xl:gap-0">
          {logos.map((logo) => (
            <img key={logo.name} src={logo.image} alt={`${logo.name} logo`} className={logo.desktopClass} />
          ))}
        </div>
        <img
          src="/images/clients/logos.png"
          alt="Hooli, Lyft, Robinhood, Stripe, AWS and Reddit logos"
          className="hidden w-full object-contain md:block xl:hidden"
        />
      </div>
    </section>
  )
}

export default ClientsLogos
