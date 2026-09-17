import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb.jsx'
import TeamCard from '../components/TeamCard.jsx'
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from '../components/SocialIcons.jsx'
import { teamMembers } from '../data/teamData.js'

// Figma: "desktop-team-1" (2874:4077) / "mobile-team-1" (2874:4338)
function TeamPage() {
  return (
    <div className="flex w-full flex-col">
      <section className="flex w-full flex-col items-center gap-3 px-10 py-12 text-center">
        <h5 className="text-base font-bold leading-6 tracking-[0.1px] text-second-text-color">WHAT WE DO</h5>
        <h1 className="text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color lg:text-[58px] lg:leading-[80px]">
          Innovation tailored for you
        </h1>
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Team' }]} />
      </section>

      <section className="flex w-full flex-col gap-2.5 lg:h-[530px] lg:flex-row">
        <img src="/images/team/hero-main.png" alt="Fashion model in a floral dress" className="h-[530px] w-full object-cover lg:h-full lg:w-[calc(50%-5px)]" />
        <div className="flex w-full flex-col gap-2.5 lg:w-[calc(50%-5px)]">
          {[
            ['/images/team/hero-1.png', '/images/team/hero-2.png'],
            ['/images/team/hero-3.png', '/images/team/hero-4.png'],
          ].map((row) => (
            <div key={row[0]} className="flex h-[260px] gap-2.5 lg:h-1/2">
              {row.map((src) => (
                <img key={src} src={src} alt="Fashion collection" className="h-full w-[calc(50%-5px)] object-cover" />
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="flex w-full py-28">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-28 px-10 lg:px-0">
          <h2 className="text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color">Meet Our Team</h2>
          <div className="flex w-full flex-col gap-8 md:flex-row md:flex-wrap md:justify-center md:gap-x-[30px] md:gap-y-12">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex w-full md:w-[calc(50%-15px)] lg:w-[calc(33.333%-20px)]">
                <TeamCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col items-center gap-9 px-10 py-20 text-center">
        <h2 className="text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color">Start your 14 days free trial</h2>
        <p className="max-w-[411px] text-sm leading-5 tracking-[0.2px] text-second-text-color">
          Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent.
        </p>
        <Link to="/signup" className="rounded-[5px] bg-primary-color px-10 py-4 text-sm font-bold leading-[22px] tracking-[0.2px] text-white hover:opacity-90">
          Try it free now
        </Link>
        <div className="flex items-center gap-8">
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
