import { FacebookIcon, InstagramIcon, TwitterIcon } from './SocialIcons.jsx'

function TeamCard({ member }) {
  return (
    <div className="flex w-full flex-col items-center bg-white">
      <div className="flex h-[231px] w-full overflow-hidden">
        {member.image ? (
          <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
        ) : (
          <div className={`flex h-full w-full items-center justify-center text-6xl font-bold text-white ${member.avatarClass}`}>
            {member.initials}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-2.5 px-8 pt-8 text-center">
        <h5 className="text-base font-bold leading-6 tracking-[0.1px] text-text-color">{member.name}</h5>
        <p className="-mt-0.5 text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color">{member.role}</p>
        <div className="mt-2 flex items-center gap-5 lg:mt-0">
          <FacebookIcon size={24} className="text-[#335BF5] lg:text-primary-color" />
          <InstagramIcon size={24} className="text-[#E61F5A] lg:text-primary-color" />
          <TwitterIcon size={24} className="text-[#21A6DF] lg:text-primary-color" />
        </div>
      </div>
    </div>
  )
}

export default TeamCard
