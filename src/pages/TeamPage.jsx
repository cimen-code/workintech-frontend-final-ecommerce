import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb.jsx'
import TeamCard from '../components/TeamCard.jsx'
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from '../components/SocialIcons.jsx'
import { teamMembers } from '../data/teamData.js'

// Order classes put the black sweatshirt before the light denim on mobile only
const galleryTiles = [
  { src: '/images/team/hero-1-desktop.jpg', mobileSrc: '/images/team/mobile-hero-1.jpg', order: 'order-1' },
  { src: '/images/team/hero-2-desktop.jpg', mobileSrc: '/images/team/mobile-hero-2.jpg', order: 'order-3' },
  { src: '/images/team/hero-3-desktop.jpg', mobileSrc: '/images/team/mobile-hero-3.jpg', order: 'order-2' },
  { src: '/images/team/hero-4-desktop.jpg', mobileSrc: '/images/team/mobile-hero-4.jpg', order: 'order-4' },
]

// Figma: "desktop-team-1" (2874:4077) / "mobile-team-1" (2874:4338)
function TeamPage() {
  return (
    <div className="flex w-full flex-col">
      <section className="flex w-full flex-col items-center gap-[13px] px-10 pb-[53px] pt-[85px] text-center lg:gap-3 lg:pb-[50px] lg:pt-[65px]">
        <h5 className="text-base font-bold leading-6 tracking-[0.1px] text-second-text-color lg:mb-[7px]">WHAT WE DO</h5>
        <h1 className="mt-[3px] text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color lg:mt-0 lg:text-[58px] lg:leading-[80px]">
          Innovation tailored for you
        </h1>
        <div className="mt-0.5 flex lg:mt-0">
          <Breadcrumb gapClassName="gap-[15px]" lastClassName="text-second-text-color" items={[{ label: 'Home', to: '/' }, { label: 'Team' }]} />
        </div>
      </section>

      <section className="flex w-full flex-col gap-2.5 lg:h-[530px] lg:flex-row lg:gap-[9px]">
        <picture className="flex h-[530px] w-full lg:h-full lg:w-[48.61%]">
          <source media="(max-width: 767px)" srcSet="/images/team/mobile-hero-main.jpg" />
          <img src="/images/team/hero-main-desktop.jpg" alt="Fashion model in a floral dress" className="h-full w-full object-cover" />
        </picture>
        <div className="flex w-full flex-wrap gap-x-[5px] gap-y-2.5 md:gap-x-2.5 lg:h-full lg:flex-1 lg:gap-x-[9px]">
          {galleryTiles.map((tile) => (
            <picture key={tile.src} className={`flex h-[260px] w-[calc(50%-2.5px)] md:order-none md:w-[calc(50%-5px)] lg:h-[calc(50%-5px)] lg:w-[calc(50%-4.5px)] ${tile.order}`}>
              <source media="(max-width: 767px)" srcSet={tile.mobileSrc} />
              <img src={tile.src} alt="Fashion collection" className="h-full w-full object-cover" />
            </picture>
          ))}
        </div>
      </section>

      <section className="flex w-full pt-[75px] lg:pt-28">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-[45px] px-10 lg:gap-28 lg:px-0">
          <h2 className="max-w-[250px] text-center text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color md:max-w-none">Meet Our Team</h2>
          <div className="flex w-full flex-col items-center gap-[72px] md:flex-row md:flex-wrap md:items-start md:justify-center md:gap-x-[30px] md:gap-y-12">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex w-[317px] max-w-full md:w-[calc(50%-15px)] lg:w-[calc(33.333%-20px)] xl:w-[316px]">
                <TeamCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col items-center gap-[29px] px-[30px] pb-[132px] pt-[247px] text-center lg:px-10 lg:pb-[90px] lg:pt-[224px]">
        <h2 className="mb-0.5 text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color lg:mb-px">Start your<br className="md:hidden" /> 14 days free trial</h2>
        <p className="max-w-[334px] text-sm leading-5 tracking-[0.2px] text-second-text-color lg:max-w-[411px]">
          Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent.
        </p>
        <Link to="/signup" className="flex h-[52px] w-[187px] items-center justify-center rounded-[5px] bg-primary-color text-sm font-bold leading-[22px] tracking-[0.2px] text-white hover:opacity-90 lg:w-[186px]">
          Try it free now
        </Link>
        <div className="mt-[11px] flex items-center gap-[34px]">
          <TwitterIcon size={30} className="text-[#55ACEE]" />
          <FacebookIcon size={30} className="text-[#395185]" />
          <InstagramIcon size={30} className="text-black" />
          <LinkedinIcon size={30} className="text-[#0A66C2]" />
        </div>
      </section>
    </div>
  )
}

export default TeamPage
