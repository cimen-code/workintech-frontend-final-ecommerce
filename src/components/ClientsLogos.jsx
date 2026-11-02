// Figma "mobile-clients-3" stacks the six logos; tablet/desktop keep the single row
const logos = [
  { name: 'Hooli', image: '/images/clients/hooli.png' },
  { name: 'Lyft', image: '/images/clients/lyft.png' },
  { name: 'Robinhood', image: '/images/clients/pied-piper.png' },
  { name: 'Stripe', image: '/images/clients/stripe.png' },
  { name: 'AWS', image: '/images/clients/aws.png' },
  { name: 'Reddit', image: '/images/clients/reddit.png' },
]

function ClientsLogos() {
  return (
    <section className="flex w-full bg-light-gray-1 py-12">
      <div className="mx-auto flex w-full max-w-[1050px] justify-center px-8">
        <div className="flex flex-col items-center gap-[60px] md:hidden">
          {logos.map((logo) => (
            <img key={logo.name} src={logo.image} alt={`${logo.name} logo`} />
          ))}
        </div>
        <img
          src="/images/clients/logos.png"
          alt="Hooli, Lyft, Robinhood, Stripe, AWS and Reddit logos"
          className="hidden w-full object-contain md:block"
        />
      </div>
    </section>
  )
}

export default ClientsLogos
