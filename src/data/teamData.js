// T06 team data.
// NEEDS USER INPUT:
// - the student's display name is not confirmed yet, so the verifiable GitHub handle (git config) is shown;
// - the real teammate list was not supplied; the "Teammate (to be added)" cards are explicit placeholders,
//   not real people, and must be replaced with real names/roles before T06 can be accepted.
// Real people use a neutral initials avatar (no scraped profile photos).
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
    name: 'cimen-code',
    role: 'Full Stack Developer',
    initials: 'CC',
    avatarClass: 'bg-primary-color',
    github: 'https://github.com/cimen-code',
  },
  ...[3, 4, 5, 6, 7, 8, 9].map((id) => ({
    id,
    name: 'Teammate (to be added)',
    role: 'Role pending',
    image: `/images/team/member-${id}.png`,
  })),
]
