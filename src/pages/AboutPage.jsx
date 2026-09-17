import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import ClientsLogos from '../components/ClientsLogos.jsx'
import TeamCard from '../components/TeamCard.jsx'
import { teamMembers } from '../data/teamData.js'

const stats = [
  { value: '15K', label: 'Happy Customers' },
  { value: '150K', label: 'Monthly Visitors' },
  { value: '15', label: 'Countries Worldwide' },
  { value: '100+', label: 'Top Partners' },
]

// Figma: "desktop-about-1" (2865:3805) / "mobile-about-1" (2865:3876)
function AboutPage() {
  return (
    <div className="flex w-full flex-col">
      <section className="flex w-full">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-10 px-10 py-16 lg:flex-row lg:justify-between lg:px-0 lg:py-0">
          <div className="flex flex-col items-center gap-9 text-center lg:items-start lg:text-left">
            <h5 className="hidden text-base font-bold leading-6 tracking-[0.1px] text-text-color lg:block">ABOUT COMPANY</h5>
            <h1 className="text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color lg:text-[58px] lg:leading-[80px]">ABOUT US</h1>
            <p className="max-w-[376px] text-xl leading-[30px] tracking-[0.2px] text-second-text-color">
              We know how large objects will act, but things on a small scale
            </p>
            <Link to="/contact" className="rounded-[5px] bg-primary-color px-10 py-4 text-sm font-bold leading-[22px] tracking-[0.2px] text-white hover:opacity-90">
              Get Quote Now
            </Link>
          </div>
          <img src="/images/about/hero.png" alt="Woman holding shopping bags" className="w-full max-w-[387px] object-contain lg:max-w-[415px]" />
        </div>
      </section>

      <section className="flex w-full">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col gap-14 px-10 py-12 lg:flex-row lg:items-center lg:gap-16 lg:px-5">
          <div className="flex flex-col gap-6">
            <p className="text-sm leading-5 tracking-[0.2px] text-danger-color">Problems trying</p>
            <h3 className="max-w-[394px] text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">
              Met minim Mollie non desert Alamo est sit cliquey dolor do met sent.
            </h3>
          </div>
          <p className="max-w-[545px] text-sm leading-5 tracking-[0.2px] text-second-text-color">
            Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics
          </p>
        </div>
      </section>

      <section className="flex w-full">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-24 px-10 py-20 md:flex-row md:justify-between lg:px-0">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
              <span className="text-[58px] font-bold leading-[80px] tracking-[0.2px] text-text-color">{stat.value}</span>
              <span className="text-base font-bold leading-6 tracking-[0.1px] text-second-text-color">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex w-full py-12">
        <div className="relative mx-auto flex w-full max-w-[989px] overflow-hidden px-10 lg:rounded-[20px] lg:px-0">
          <img src="/images/about/video.png" alt="Mountain lake landscape" className="h-[316px] w-full rounded-[20px] object-cover lg:h-[540px]" />
          <button type="button" aria-label="Play video" className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-color text-white">
            <Play size={32} fill="white" />
          </button>
        </div>
      </section>

      <section className="flex w-full py-20">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-24 px-10 lg:px-0">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <h2 className="text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color">Meet Our Team</h2>
            <p className="max-w-[469px] text-sm leading-5 tracking-[0.2px] text-second-text-color">
              Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics
            </p>
          </div>
          <div className="flex w-full flex-col gap-8 md:flex-row md:justify-center md:gap-[30px]">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex w-full md:w-1/3">
                <TeamCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col items-center gap-2.5 bg-light-gray-1 px-10 pt-20 text-center">
        <h2 className="text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color">Big Companies Are Here</h2>
        <p className="max-w-[547px] text-sm leading-5 tracking-[0.2px] text-second-text-color">
          Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics
        </p>
      </section>
      <ClientsLogos />

      <section className="flex w-full flex-col bg-[#2A7CC7] lg:flex-row">
        <div className="flex w-full flex-col items-center gap-6 px-10 py-24 text-center text-white lg:w-3/5 lg:items-start lg:pl-[195px] lg:text-left">
          <h5 className="text-base font-bold leading-6 tracking-[0.1px]">WORK WITH US</h5>
          <h2 className="text-[40px] font-bold leading-[50px] tracking-[0.2px]">Now Let&apos;s grow Yours</h2>
          <p className="max-w-[438px] text-sm leading-5 tracking-[0.2px]">
            The gradual accumulation of information about atomic and small-scale behavior during the first quarter of the 20th
          </p>
          <Link to="/team" className="rounded-[5px] border border-white px-10 py-4 text-sm font-bold leading-[22px] tracking-[0.2px] hover:bg-white hover:text-[#2A7CC7]">
            Button
          </Link>
        </div>
        <img src="/images/about/work-with-us.png" alt="Woman in a pink sweater" className="hidden w-2/5 object-cover lg:block" />
      </section>
    </div>
  )
}

export default AboutPage
