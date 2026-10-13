import type { Agent } from '../types';

/** Demo agents. Contact details use reserved 555 numbers and .example domains. */
export const agents = {
  olivia: {
    id: 'olivia-bennett',
    name: 'Olivia Bennett',
    role: 'Senior Luxury Advisor',
    phone: '+1 (305) 555-0187',
    email: 'olivia@luxeestate.example',
    photo: '1573496359142-b8d87734a5a2',
    languages: ['English', 'French'],
    yearsExperience: 14,
  },
  james: {
    id: 'james-carter',
    name: 'James Carter',
    role: 'Commercial Property Director',
    phone: '+1 (312) 555-0119',
    email: 'james@luxeestate.example',
    photo: '1560250097-0b93528c311a',
    languages: ['English'],
    yearsExperience: 18,
  },
  sophia: {
    id: 'sophia-martinez',
    name: 'Sophia Martinez',
    role: 'Rentals & Leasing Manager',
    phone: '+1 (305) 555-0164',
    email: 'sophia@luxeestate.example',
    photo: '1580489944761-15a19d654956',
    languages: ['English', 'Spanish'],
    yearsExperience: 9,
  },
  daniel: {
    id: 'daniel-reyes',
    name: 'Daniel Reyes',
    role: 'Residential Sales Specialist',
    phone: '+1 (512) 555-0133',
    email: 'daniel@luxeestate.example',
    photo: '1507003211169-0a1dd7228f2d',
    languages: ['English', 'Spanish', 'Portuguese'],
    yearsExperience: 11,
  },
} satisfies Record<string, Agent>;

export const agentList: Agent[] = Object.values(agents);
