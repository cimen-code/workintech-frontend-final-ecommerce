// T06 team data.
// Real people use a neutral initials avatar (no scraped profile photos).
// Remaining cards are Figma placeholders to be replaced with the student's real team members.
export const teamMembers = [
  {
    id: 1,
    name: 'Gökhan Özdemir',
    role: 'Project Manager',
    initials: 'GÖ',
    avatarClass: 'bg-dark-background-color',
  },
  {
    id: 2,
    name: 'Hakan Çimen',
    role: 'Full Stack Developer',
    initials: 'HÇ',
    avatarClass: 'bg-primary-color',
    github: 'https://github.com/cimen-code',
  },
  ...[3, 4, 5, 6, 7, 8, 9].map((id) => ({
    id,
    name: 'Team Member',
    role: 'Workintech Student',
    image: `/images/team/member-${id}.png`,
  })),
]
