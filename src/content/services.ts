/** partt's four services and five-step process. Wording is partt's own. */

export type SheetTheme = 'paper' | 'orange' | 'red' | 'ink';

export type Service = {
  slug: string;
  number: string;
  /** The name split over two display lines. */
  lines: [string, string];
  name: string;
  summary: string;
  items: string[];
  /** Colour of the sheet this service sits on. */
  theme: SheetTheme;
  /** Which of the four mark pieces belongs to this service (index into MARK_PIECES). */
  piece: number;
};

export const services: Service[] = [
  {
    slug: 'strategy-brand',
    number: '01',
    lines: ['Strategy', '& Brand'],
    name: 'Strategy & Brand',
    summary: 'Direction, positioning, and foundations built around the brand.',
    items: [
      'Strategy & planning',
      'Brand development',
      'End-to-end marketing strategy development',
      'Direction, priorities, and growth roadmaps',
      'Market research, brand and competitor analysis',
      'Brand identity development and positioning',
      'Messaging frameworks and tone of voice',
      'Brand repositioning and strategic refinement',
    ],
    theme: 'paper',
    piece: 1,
  },
  {
    slug: 'content-communication',
    number: '02',
    lines: ['Content &', 'Communication'],
    name: 'Content & Communication',
    summary: 'Purposeful content and consistent communication across every touchpoint.',
    items: [
      'Content strategy development',
      'Purpose-driven content creation',
      'Consistent messaging across all brand touchpoints',
    ],
    theme: 'orange',
    piece: 3,
  },
  {
    slug: 'events-activations',
    number: '03',
    lines: ['Events &', 'Activations'],
    name: 'Events & Activations',
    summary: 'Brand experiences planned and delivered with consistency and impact.',
    items: [
      'Event strategy, planning, and management',
      'Exhibitions, conferences, and trade shows',
      'Brand experience design within events',
      'On-ground coordination for consistency and impact',
    ],
    theme: 'red',
    piece: 0,
  },
  {
    slug: 'digital-growth',
    number: '04',
    lines: ['Digital', '& Growth'],
    name: 'Digital & Growth',
    summary: 'Channel management, measurable performance, and sustainable growth.',
    items: [
      'Digital marketing & channel management',
      'Social media management',
      'Digital campaign planning and execution',
      'Content management aligned with strategic objectives',
      'Performance & growth',
      'Data-driven optimization and improvement',
      'Support for scalable and sustainable growth',
    ],
    theme: 'ink',
    piece: 2,
  },
];

export type ProcessStep = { name: string; text: string };

export const processIntro = {
  title: ['A simple process.', 'Powerful results.'] as [string, string],
  text: 'We follow a clear, collaborative process that turns ideas into impact.',
};

export const processSteps: ProcessStep[] = [
  { name: 'Discover', text: 'Understanding your brand, audience, and goals.' },
  { name: 'Strategize', text: 'Turning insights into a focused plan.' },
  { name: 'Create', text: 'Bringing the strategy to life creatively.' },
  { name: 'Execute', text: 'Delivering across the right channels.' },
  { name: 'Optimize', text: 'Testing, learning, and improving.' },
];

export const customNote = {
  title: 'Need a part we have not listed?',
  text: 'We build custom solutions when your direction calls for something more specialized.',
};
