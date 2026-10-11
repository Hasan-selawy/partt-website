/** Homepage copy. Project names, statements and images come from content/projects.ts. */

export const hero = {
  /** "Part" inside "Partner" is set in red: part + partner = partt. */
  lineOne: 'Hello,',
  lineTwoAccent: 'Part',
  lineTwoRest: 'ner.',
  lede: 'A strategic marketing agency that works as part of your team, from brand strategy to growth.',
  equation: ['Part', 'partner', 'partt'] as [string, string, string],
};

/** Who partt is: the main statement, then the supporting sentence. Words starting with "part" take the accent. */
export const statement = {
  main: 'partt is a strategic marketing agency built on true partnership.',
  sub: 'We work as part of your team, from strategy and brand to execution, growth and long-term sustainability.',
};

export const clientsLabel = 'Brands we work with';

export const workTitle = 'Selected work';

/**
 * The projects shown in Selected Work, in order. Every project gets the same tile: its hero photo, and its first
 * gallery photo on hover. To add a brand, add its slug here.
 */
export const workShowcase = ['levo', 'salt-beach', 'incharge', 'dwego', 'dtale'];

export const workIntro = 'Brands we are part of, across tourism, hospitality, retail and services.';
