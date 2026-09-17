import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from '../components/SocialIcons.jsx'

const offices = [
  { id: 'phone', Icon: Phone, dark: false },
  { id: 'location', Icon: MapPin, dark: true },
  { id: 'mail', Icon: Mail, dark: false },
]

// Figma: "desktop-contact-1" (2879:7582) / "mobile-contact-1" (2879:7782)
function ContactPage() {
  return (
    <div className="flex w-full flex-col">
      <section className="flex w-full">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-10 px-10 py-20 lg:flex-row lg:justify-between lg:px-0 lg:py-0">
          <div className="flex flex-col items-center gap-9 text-center lg:items-start lg:text-left">
            <h5 className="text-base font-bold leading-6 tracking-[0.1px] text-text-color">CONTACT US</h5>
            <h1 className="max-w-[378px] text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color lg:text-[58px] lg:leading-[80px]">
              Get in touch today!
            </h1>
            <p className="max-w-[376px] text-xl leading-[30px] tracking-[0.2px] text-second-text-color">
              We know how large objects will act, but things on a small scale
            </p>
            <div className="flex flex-col gap-2 text-xl font-bold leading-8 tracking-[0.1px] text-text-color">
              <p>Phone : +451 215 215</p>
              <p>Fax : +451 215 215</p>
            </div>
            <div className="flex items-center gap-8 text-text-color">
              <TwitterIcon size={30} />
              <FacebookIcon size={30} />
              <InstagramIcon size={30} />
              <LinkedinIcon size={30} />
            </div>
          </div>
          <img src="/images/contact/hero.png" alt="Family carrying shopping bags" className="w-full max-w-[400px] object-contain lg:max-w-[614px]" />
        </div>
      </section>

      <section className="flex w-full py-20">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-20 px-10 lg:px-0">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <h6 className="text-sm font-bold leading-6 tracking-[0.2px] text-text-color">VISIT OUR OFFICE</h6>
            <h2 className="max-w-[607px] text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color">
              We help small businesses with big ideas
            </h2>
          </div>
          <div className="flex w-full flex-col lg:flex-row">
            {offices.map(({ id, Icon, dark }) => (
              <div
                key={id}
                className={`flex w-full flex-col items-center gap-4 px-10 py-12 text-center lg:w-1/3 lg:py-20 ${dark ? 'bg-dark-background-color text-white' : 'bg-white text-text-color'}`}
              >
                <Icon size={72} strokeWidth={1.5} className="text-primary-color" />
                <div className="flex flex-col text-sm font-bold leading-6 tracking-[0.2px]">
                  <span>georgia.young@example.com</span>
                  <span>georgia.young@ple.com</span>
                </div>
                <h5 className="text-base font-bold leading-6 tracking-[0.1px]">Get Support</h5>
                <a
                  href="mailto:georgia.young@example.com"
                  className="rounded-[37px] border border-primary-color px-9 py-4 text-sm font-bold leading-[22px] tracking-[0.2px] text-primary-color hover:bg-primary-color hover:text-white"
                >
                  Submit Request
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col items-center gap-9 px-10 pb-28 pt-10 text-center">
        <h6 className="text-base font-bold leading-6 tracking-[0.1px] text-text-color">WE Can&apos;t WAIT TO MEET YOU</h6>
        <h2 className="text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color lg:text-[58px] lg:leading-[80px]">Let&apos;s Talk</h2>
        <Link to="/signup" className="rounded-[5px] bg-primary-color px-10 py-4 text-sm font-bold leading-[22px] tracking-[0.2px] text-white hover:opacity-90">
          Try it free now
        </Link>
      </section>
    </div>
  )
}

export default ContactPage
