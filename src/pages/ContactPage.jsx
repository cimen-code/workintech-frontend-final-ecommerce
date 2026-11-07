import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from '../components/SocialIcons.jsx'

const offices = [
  { id: 'phone', Icon: Phone, dark: false },
  { id: 'location', Icon: MapPin, filled: true, dark: true },
  { id: 'mail', Icon: Mail, MobileIcon: Send, dark: false },
]

function ContactPage() {
  return (
    <div className="flex w-full flex-col">
      <section className="flex w-full">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-[91px] pb-[21px] pt-9 lg:flex-row lg:justify-between lg:gap-10 lg:p-0 xl:items-start">
          <div className="flex flex-col items-center gap-[38px] text-center lg:items-start lg:gap-[35px] lg:text-left xl:pt-[141px]">
            <h5 className="text-base font-bold leading-6 tracking-[0.1px] text-text-color">CONTACT US</h5>
            <h1 className="max-w-[378px] text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color lg:text-[58px] lg:leading-[80px]">
              Get in touch today!
            </h1>
            <p className="mt-0.5 max-w-[272px] text-xl leading-[30px] tracking-[0.2px] text-second-text-color lg:-mt-px lg:max-w-[376px]">
              We know how large objects will act, but things on a small scale<span className="lg:hidden"> just do not act that way.</span>
            </p>
            <div className="mt-1 flex flex-col gap-[21px] text-2xl font-bold leading-8 tracking-[0.1px] text-text-color lg:mt-0.5 lg:gap-5">
              <p>Phone ; +451 215 215</p>
              <p>Fax : +451 215 215</p>
            </div>
            <div className="mt-2 flex items-center gap-[34px] text-text-color lg:ml-2.5 lg:mt-[7px]">
              <TwitterIcon size={30} />
              <FacebookIcon size={30} />
              <InstagramIcon size={30} />
              <LinkedinIcon size={30} />
            </div>
          </div>
          <picture className="mr-3.5 flex w-full max-w-[362px] max-[374px]:mr-0 lg:mr-0 lg:w-1/2 lg:max-w-[614px] xl:-mr-[110px] xl:w-[614px] xl:shrink-0">
            <source media="(max-width: 1023px)" srcSet="/images/contact/mobile-hero.jpg" />
            <img src="/images/contact/hero.png" alt="Family carrying shopping bags" className="w-full object-contain" />
          </picture>
        </div>
      </section>

      <section className="flex w-full bg-light-gray-1 pb-[93px] pt-[76px] lg:bg-white lg:pb-[29px] lg:pt-[134px]">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-[59px] px-10 lg:gap-[79px] lg:px-0">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <h6 className="text-sm font-bold leading-6 tracking-[0.2px] text-text-color">VISIT OUR OFFICE</h6>
            <h2 className="max-w-[607px] text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color">
              We help small businesses with big ideas
            </h2>
          </div>
          <div className="flex w-full flex-col items-center gap-[30px] lg:flex-row lg:gap-0 xl:justify-center">
            {offices.map(({ id, Icon, MobileIcon, filled, dark }) => (
              <div
                key={id}
                className={`flex w-full max-w-[329px] flex-col items-center gap-3.5 px-10 text-center lg:w-1/3 lg:pb-20 lg:pt-[77px] xl:w-[329px] ${dark ? 'bg-dark-background-color pb-20 pt-[77px] text-white' : 'bg-white pb-[50px] pt-[47px] text-text-color'}`}
              >
                {MobileIcon && <MobileIcon size={80} strokeWidth={1.5} className="-my-px text-primary-color lg:hidden" />}
                <Icon size={filled ? 74 : 80} strokeWidth={1.5} fill={filled ? 'currentColor' : 'none'} className={`text-primary-color ${filled ? 'my-0.5 [&>circle]:fill-dark-background-color' : '-my-px'} ${MobileIcon ? 'hidden lg:flex' : ''}`} />
                <div className="flex flex-col text-sm font-bold leading-6 tracking-[0.2px]">
                  <span>georgia.young@example.com</span>
                  <span>georgia.young@ple.com</span>
                </div>
                <h5 className="text-base font-bold leading-6 tracking-[0.1px]">Get Support</h5>
                <a
                  href="mailto:georgia.young@example.com"
                  className="flex h-11 w-[157px] items-center justify-center rounded-[5px] border border-primary-color text-sm font-bold leading-[22px] tracking-[0.2px] text-primary-color hover:bg-primary-color hover:text-white lg:h-[54px] lg:w-[189px] lg:rounded-[37px]"
                >
                  Submit Request
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col items-center gap-2 px-10 pb-28 pt-10 text-center lg:gap-[17px] lg:pb-[81px] lg:pt-14">
        <img src="/images/contact/arrow.png" alt="" aria-hidden="true" className="mr-5 h-16 w-16 lg:mr-[27px]" />
        <h6 className="text-base font-bold leading-6 tracking-[0.1px] text-text-color">WE Can&apos;t WAIT TO MEET YOU</h6>
        <h2 className="mt-6 text-[58px] font-bold leading-[80px] tracking-[0.2px] text-text-color lg:-mt-px">Let’s Talk</h2>
        <Link to="/signup" className="mt-5 flex h-[52px] w-[187px] items-center justify-center rounded-[5px] bg-primary-color text-sm font-bold leading-[22px] tracking-[0.2px] text-white hover:opacity-90 lg:-mt-[3px] lg:w-[186px]">
          Try it free now
        </Link>
      </section>
    </div>
  )
}

export default ContactPage
