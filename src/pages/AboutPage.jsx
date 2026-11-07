import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import ClientsLogos from '../components/ClientsLogos.jsx'
import TeamCard from '../components/TeamCard.jsx'
import { teamMembers } from '../data/teamData.js'

const stats = [
  { value: '15K', label: 'Happy Customers' },
  { value: '150K', label: 'Monthly Visitors' },
  { value: '15', label: 'Countries\u00A0 Worldwide' },
  { value: '100+', label: 'Top Partners' },
]

function AboutPage() {
  return (
    <div className="flex w-full flex-col">
      <section className="flex w-full">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-[219px] pt-[152px] lg:flex-row lg:justify-between lg:gap-10 lg:pt-[27px] xl:h-[670px] xl:items-start">
          <div className="flex flex-col items-center gap-10 text-center lg:items-start lg:gap-[35px] lg:text-left xl:pt-[100px]">
            <h5 className="hidden text-base font-bold leading-6 tracking-[0.1px] text-text-color lg:flex">ABOUT COMPANY</h5>
            <h1 className="text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color lg:text-[58px] lg:leading-[80px]">ABOUT US</h1>
            <p className="max-w-[272px] text-xl leading-[30px] tracking-[0.2px] text-second-text-color lg:-mt-px lg:max-w-[376px]">
              We know how large objects will act, but things on a small scale<span className="lg:hidden"> just do not act that way.</span>
            </p>
            <Link to="/contact" className="flex h-[53px] w-[194px] items-center justify-center rounded-[5px] bg-primary-color text-sm font-bold leading-[22px] tracking-[0.2px] text-white hover:opacity-90 lg:h-[52px] lg:w-[193px]">
              Get Quote Now
            </Link>
          </div>
          <picture className="ml-[9px] flex w-[calc(100%-9px)] max-w-[385px] lg:ml-0 lg:w-1/2 lg:max-w-[415px] xl:-mr-[102px] xl:w-[605px] xl:max-w-none xl:shrink-0">
            <source media="(min-width: 1024px)" srcSet="/images/about/hero-desktop.jpg" />
            <img src="/images/about/mobile-hero.jpg" alt="Woman holding shopping bags" className="w-full object-contain" />
          </picture>
        </div>
      </section>

      <section className="flex w-full">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col gap-[82px] pb-12 pt-[108px] md:gap-14 md:px-10 lg:h-[286px] lg:flex-row lg:items-start lg:gap-[60px] lg:px-[34px] lg:pb-0 lg:pt-[18px]">
          <div className="flex flex-col items-center gap-[26px] px-10 text-center md:items-start md:gap-6 md:px-0 md:text-left lg:gap-[25px]">
            <p className="text-sm leading-5 tracking-[0.2px] text-danger-color">Problems trying</p>
            <h3 className="max-w-[300px] text-2xl font-bold leading-8 tracking-[0.1px] text-text-color md:max-w-[394px] lg:w-[394px]">
              Met minim Mollie non desert Alamo est sit cliquey dolor do met sent.
            </h3>
          </div>
          <p className="max-w-[545px] pl-[54px] pr-4 text-sm leading-5 tracking-[0.2px] text-second-text-color md:px-0 lg:mt-[49px]">
            Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics
          </p>
        </div>
      </section>

      <section className="flex w-full">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-[101px] px-10 pb-[176px] pt-[179px] md:flex-row md:justify-between md:gap-10 md:py-20 lg:gap-0 lg:px-0 lg:pb-[190px] lg:pt-0 xl:max-w-[1080px]">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center xl:w-[270px]">
              <span className="text-[58px] font-bold leading-[80px] tracking-[0.2px] text-text-color">{stat.value}</span>
              <span className="-mt-px text-base font-bold leading-6 tracking-[0.1px] text-second-text-color lg:mt-px">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex w-full py-12 lg:order-1 lg:py-28">
        <div className="relative mx-auto flex w-full max-w-[307px] overflow-hidden md:max-w-[989px] md:px-10 lg:rounded-[20px] lg:px-0">
          <picture className="flex w-full">
            <source media="(min-width: 1024px)" srcSet="/images/about/video-desktop.jpg" />
            <img src="/images/about/video.png" alt="Mountain lake landscape" className="h-[316px] w-full rounded-[20px] object-cover lg:h-[540px]" />
          </picture>
          <button type="button" aria-label="Play video" className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-color text-white lg:h-[92px] lg:w-[92px]">
            <Play fill="white" className="h-5 w-5 lg:h-[26px] lg:w-[26px]" />
          </button>
        </div>
      </section>

      <section className="flex w-full pb-[90px] pt-[109px] lg:pb-[149px] lg:pt-0">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-[45px] px-10 lg:gap-28 lg:px-0">
          <div className="flex flex-col items-center gap-[9px] text-center lg:gap-2.5">
            <h2 className="max-w-[250px] text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color md:max-w-none">Meet Our Team</h2>
            <p className="max-w-[265px] text-sm leading-5 tracking-[0.2px] text-second-text-color md:max-w-[469px]">
              Problems trying to resolve<br className="md:hidden" /> the conflict between<br className="hidden lg:inline" /> the two major realms of Classical physics: Newtonian mechanics
            </p>
          </div>
          <div className="flex w-full flex-col items-center gap-[72px] md:flex-row md:items-start md:justify-center md:gap-[30px]">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex w-[317px] max-w-full md:w-1/3 xl:w-[316px]">
                <TeamCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col items-center gap-[29px] bg-light-gray-1 px-10 pt-[121px] text-center lg:pt-[81px]">
        <h2 className="max-w-[250px] text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color md:max-w-none">Big Companies Are Here</h2>
        <p className="max-w-[547px] text-sm leading-5 tracking-[0.2px] text-second-text-color">
          Problems trying to resolve the conflict between<br className="hidden lg:inline" /> the two major realms of Classical physics: Newtonian mechanics
        </p>
      </section>
      <ClientsLogos className="pb-[182px] pt-[50px] md:py-12 xl:pb-[131px] xl:pt-[74px]" />

      <section className="flex w-full flex-col bg-[#2A7CC7] lg:order-1 lg:flex-row">
        <div className="flex w-full flex-col items-center gap-[26px] px-10 pb-[102px] pt-[91px] text-center text-white lg:gap-6 lg:w-[59.03%] lg:items-start lg:pb-0 lg:pl-[195px] lg:pt-[200px] lg:text-left">
          <h5 className="text-base font-bold leading-6 tracking-[0.1px]">WORK WITH US</h5>
          <h2 className="max-w-[250px] text-[40px] font-bold leading-[50px] tracking-[0.2px] md:max-w-none">Now Let’s grow Yours</h2>
          <p className="-mt-[5px] max-w-[240px] text-sm leading-5 tracking-[0.2px] md:max-w-[438px] lg:-mt-px">
            The gradual accumulation of information about atomic and small-scale behavior during the first quarter of the 20th
          </p>
          <Link to="/team" className="-mt-0.5 flex h-[52px] w-[130px] items-center justify-center rounded-[5px] border border-white text-sm font-bold leading-[22px] tracking-[0.2px] hover:bg-white hover:text-[#2A7CC7] lg:mt-0">
            Button
          </Link>
        </div>
        <img src="/images/about/work-desktop.jpg" alt="Woman in a pink sweater" className="hidden h-[636px] w-[40.97%] object-cover lg:flex" />
      </section>
    </div>
  )
}

export default AboutPage
