/**
 * Projects and case studies. This is the single source for every place a project appears:
 * the homepage Selected Work scene (composed in content/home.ts), the Work page, each case-study page, the sitemap and page metadata.
 *
 * Honesty rule: `brand` text is taken from each client's own brand guideline. Anything about what partt did
 * (services, challenge, approach, results, year) is `null` until partt supplies it, and the page shows a
 * "Content needed" box in its place. Nothing here is invented.
 */

export type Media = {
  src: string;
  alt: string;
  w: number;
  h: number;
  /** horizontal focus point for tight crops, as a CSS percentage */
  focus?: string;
};

export type Project = {
  slug: string;
  client: string;
  /** short display name used in large type */
  displayName: string;
  sector: string;
  location: string | null;
  /** The client's own line, shown as the project statement until partt writes one about the work. */
  statement: string;
  /** About the client, from their brand guideline. */
  brand: string[];
  hero: Media;
  gallery: Media[];
  /** name of the matching entry in content/clients.ts, when a one-colour logo exists */
  logoClient: string | null;

  // ---- content partt still needs to supply ----
  year: string | null;
  /** service slugs from content/services.ts */
  services: string[] | null;
  challenge: string[] | null;
  approach: string[] | null;
  /** the creative work itself: what was made and how it looks */
  execution: string[] | null;
  results: string[] | null;
};

const img = (slug: string, n: number, w: number, h: number, alt: string, focus?: string): Media => ({
  src: `/img/work/${slug}/${String(n).padStart(2, '0')}.jpg`,
  alt,
  w,
  h,
  focus,
});

export const projects: Project[] = [
  {
    slug: 'salt-beach',
    client: 'Salt Beach',
    displayName: 'Salt Beach',
    sector: 'Beach destination',
    location: 'Dead Sea, Jordan',
    statement: 'Calm luxury at the lowest point on Earth.',
    brand: [
      'At the lowest point on Earth, where the stillness of the Dead Sea meets the glow of salt under the sun, Salt Beach was born.',
      'More than a beach, Salt Beach is a private VIP destination designed for those who seek calm, comfort, and refined exclusivity. As part of the Dead Sea Tourist Beach, it introduces a more elevated side of the Dead Sea.',
    ],
    // 01.jpg (the branded beach set) is too low resolution to show: the pattern leads until a sharper photo arrives
    hero: img('salt-beach', 4, 1914, 1472, 'The Salt Beach wave pattern in navy'),
    gallery: [img('salt-beach', 3, 2200, 1605, 'Salt Beach logo in its colour variations')],
    logoClient: 'Salt Beach',
    year: null,
    services: null,
    challenge: null,
    approach: null,
    execution: null,
    results: null,
  },
  {
    slug: 'levo',
    client: 'LÉVO Café',
    displayName: 'LÉVO',
    sector: 'Café',
    location: null,
    statement: 'Elevating everyday life.',
    brand: [
      'Derived from the Latin-inspired root "elevare," meaning "to elevate" or "to lift up," Lévo embodies the art of refinement and transformation.',
      'From the morning ritual of a perfectly brewed coffee to the quiet joy of a well-crafted pastry, Lévo celebrates the beauty found in everyday indulgences.',
    ],
    hero: img('levo', 1, 2200, 1237, 'LÉVO Café paper cups under an espresso machine', '56%'),
    gallery: [
      img('levo', 3, 2200, 1237, 'Croissants wrapped in LÉVO printed paper'),
      img('levo', 2, 2200, 1237, 'LÉVO Café interior with the logo'),
      img('levo', 4, 2200, 1237, 'Green LÉVO paper shopping bag'),
      img('levo', 5, 2200, 1237, 'LÉVO staff apron in olive green'),
      img('levo', 6, 2200, 1237, 'LÉVO newspaper-style wrapping paper'),
    ],
    logoClient: 'LÉVO Café',
    year: null,
    services: null,
    challenge: null,
    approach: null,
    execution: null,
    results: null,
  },
  {
    slug: 'incharge',
    client: 'INCHARGE',
    displayName: 'Incharge',
    sector: 'Maintenance experts',
    location: null,
    statement: 'Peace of mind comes standard.',
    brand: [
      'InCharge is a network of trusted maintenance experts, bringing skilled hands and dependable service to everyday needs.',
      'They simplify repairs, cleaning, and upkeep by connecting people with professionals who show up, care, and get it done right.',
    ],
    hero: img('incharge', 1, 2200, 1237, 'INCHARGE branded truck on the road at night', '60%'),
    gallery: [
      img('incharge', 2, 2200, 1237, 'INCHARGE logo on a white safety helmet', '58%'),
      img('incharge', 3, 2200, 1237, 'INCHARGE branded toolbox with tools'),
      img('incharge', 4, 2200, 1237, 'INCHARGE business cards'),
      img('incharge', 5, 2200, 1237, 'INCHARGE staff lanyards and ID cards'),
    ],
    logoClient: 'INCHARGE',
    year: null,
    services: null,
    challenge: null,
    approach: null,
    execution: null,
    results: null,
  },
  {
    slug: 'dwego',
    client: 'DWEGO',
    displayName: 'DWEGO',
    sector: 'Sportswear',
    location: null,
    statement: 'Double it up.',
    brand: [
      'DWEGO is a dynamic and innovative sportswear brand aimed at those who seek both performance and style.',
      'The name suggests motion, energy, and a sense of forward momentum, capturing the essence of athleticism and the drive to excel.',
    ],
    hero: img('dwego', 1, 2200, 1338, 'DWEGO campaign visual: a runner in front of the double W mark'),
    gallery: [
      img('dwego', 2, 2200, 1555, 'DWEGO sign on a building facade', '78%'),
      img('dwego', 3, 2200, 1353, 'DWEGO campaign visual: sit-ups in front of the double W mark'),
      img('dwego', 5, 2200, 1353, 'DWEGO campaign visual: running shoes in front of the double W mark'),
      img('dwego', 4, 2200, 1555, 'DWEGO paper shopping bag'),
    ],
    logoClient: null,
    year: null,
    services: null,
    challenge: null,
    approach: null,
    execution: null,
    results: null,
  },
  {
    slug: 'dtale',
    client: 'DTALE',
    displayName: 'DTALE',
    sector: 'Retail',
    location: null,
    statement: "It's all in the details.",
    brand: [
      'D-Tale tells the story of its name: the "D" honors the Daraghmeh family, and "Tale" celebrates the journey shared with every customer.',
      'From that idea, the visual identity is built around one simple truth: details matter.',
    ],
    hero: img('dtale', 1, 2200, 828, 'DTALE tote bag on a salmon background'),
    gallery: [
      img('dtale', 2, 2200, 928, 'DTALE black shopping bag'),
      img('dtale', 3, 2200, 1027, 'DTALE delivery bags in black and white'),
      img('dtale', 4, 2200, 990, 'DTALE socks in front of the D mark'),
      img('dtale', 5, 2200, 904, 'DTALE gift box'),
    ],
    logoClient: 'DTALE',
    year: null,
    services: null,
    challenge: null,
    approach: null,
    execution: null,
    results: null,
  },
  {
    slug: 'dead-sea-tourist-beach',
    client: 'Dead Sea Tourist Beach',
    displayName: 'Dead Sea Tourist Beach',
    sector: 'Tourism',
    location: 'Dead Sea, Jordan',
    statement: 'Slow down, breathe, and reconnect.',
    brand: [
      'A refined destination where nature, wellness, and serenity come together on the shores of the Dead Sea.',
      "Inspired by the world's lowest point and its timeless beauty, it creates experiences that restore balance and awaken the senses.",
    ],
    hero: img('dead-sea', 1, 2054, 1140, 'Dead Sea Tourist Beach flags against a blue sky'),
    gallery: [
      img('dead-sea', 2, 1914, 1138, 'Dead Sea Tourist Beach roadside billboard'),
      img('dead-sea', 3, 1495, 2046, 'Dead Sea Tourist Beach welcome and safety signs in Arabic and English'),
    ],
    logoClient: 'Dead Sea Tourist Beach',
    year: null,
    services: null,
    challenge: null,
    approach: null,
    execution: null,
    results: null,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const projectPath = (slug: string) => `/work/${slug}`;

/** The project after this one, wrapping round to the first. */
export const nextProject = (slug: string): Project => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
