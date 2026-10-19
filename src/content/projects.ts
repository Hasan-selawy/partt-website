/**
 * Projects and case studies. This is the single source for every place a project appears:
 * the homepage Selected Work scene (composed in content/home.ts), the Work page, each case-study page, the sitemap and page metadata.
 *
 * Project stories describe supplied imagery, approved INCHARGE concepts and established brand details. Dates, services and
 * project-specific claims stay empty until partt supplies them.
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
  sector: string | null;
  location: string | null;
  /** The client's own line, shown as the project statement until partt writes one about the work. */
  statement: string | null;
  /** About the client, based on supplied brand material or photographs. */
  brand: string[];
  /** null until photos arrive: the project then shows a navy cover with its logo or name (components/ui/Cover.tsx) */
  hero: Media | null;
  /** Optional case-study banner when it differs from the work-list cover. */
  banner?: Media;
  gallery: Media[];
  /** name of the matching entry in content/clients.ts, when a one-colour logo exists */
  logoClient: string | null;

  // ---- case-study details ----
  year: string | null;
  /** service slugs from content/services.ts */
  services: string[] | null;
  challenge: string[] | null;
  approach: string[] | null;
  /** the creative work itself: what was made and how it looks */
  execution: string[] | null;
  results: string[] | null;
};

const img = (slug: string, file: number | string, w: number, h: number, alt: string, focus?: string): Media => ({
  // Fresh URLs prevent previously optimized project photos from being reused after replacement.
  src: `/img/work/${slug}/${typeof file === 'number' ? `${String(file).padStart(2, '0')}.jpg` : file}?v=client-files-20261014`,
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
    hero: img('salt-beach', 1, 2200, 1466, 'Salt Beach pools and blue umbrellas beside the Dead Sea'),
    gallery: [
      img('salt-beach', 2, 2200, 1467, 'Salt Beach entrance with welcome signs'),
      img('salt-beach', 3, 2200, 1466, 'Salt Beach pool framed by palm trees'),
      img('salt-beach', 4, 2200, 2750, 'Palm trees and poolside umbrellas at Salt Beach'),
      img('salt-beach', 5, 2200, 1466, 'Salt Beach entrance signs and flags'),
      img('salt-beach', 6, 2200, 1467, 'Wide view across the Salt Beach pool'),
    ],
    logoClient: 'Salt Beach',
    year: null,
    services: null,
    challenge: null,
    approach: ['Blue umbrellas, palms and open views of the Dead Sea give the destination its visual character.'],
    execution: ['The photographs move from the branded entrance to the pools and quiet spaces along the shore.'],
    results: ['Together, the images show Salt Beach as a distinct place within the wider Dead Sea destination.'],
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
    hero: img('levo', 'cafe-terrace.png', 1730, 909, 'LÉVO Café terrace and entrance surrounded by greenery'),
    banner: img('levo', 'storefront.png', 1730, 909, 'Black-and-white photograph of the LÉVO Café storefront'),
    gallery: [
      img('levo', 1, 1080, 1349, 'Coffee being poured into a LÉVO Café cup'),
      img('levo', 3, 1088, 1344, 'LÉVO drink and pastry on a table'),
      img('levo', 4, 1088, 1344, 'Fresh croissants served at LÉVO Café'),
      img('levo', 5, 1120, 1408, 'LÉVO takeaway coffee and baguette'),
      img('levo', 6, 1024, 1376, 'Stack of white LÉVO Café cups'),
    ],
    logoClient: 'LÉVO Café',
    year: null,
    services: null,
    challenge: null,
    approach: ['The visual story stays close to the café ritual: coffee, pastries and the moments between them.'],
    execution: ['Storefront and product photography bring LÉVO’s name into the space and onto its cups.'],
    results: ['The collection connects the café itself with the food and drinks people come to enjoy.'],
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
    hero: img('incharge', 'concept-fleet-v3.webp', 1536, 1024, 'INCHARGE fleet concept with white lettering on an orange service van', '35%'),
    gallery: [
      img('incharge', 'concept-workwear-v3.webp', 1536, 1024, 'INCHARGE workwear concept: charcoal jacket with an orange branded back panel'),
      img('incharge', 'concept-tool-roll-v3.webp', 1536, 1024, 'INCHARGE orange canvas tool-roll concept with three maintenance tools'),
      img('incharge', 'offices.jpg', 1440, 1801, 'INCHARGE offices campaign graphic'),
      img('incharge', 4, 1440, 1801, 'INCHARGE clinics campaign graphic'),
      img('incharge', 5, 1440, 1801, 'INCHARGE residential buildings campaign graphic'),
      img('incharge', 6, 1440, 1801, 'INCHARGE retail stores campaign graphic'),
      img('incharge', 7, 1350, 1688, 'Before and after interior renovation with INCHARGE branding'),
    ],
    logoClient: 'INCHARGE',
    year: null,
    services: null,
    challenge: null,
    approach: ['Orange, charcoal and white give the maintenance identity a clear, practical visual language.'],
    execution: ['Fleet, workwear and tool-roll concepts carry the identity into everyday maintenance, alongside the supplied facility campaign.'],
    results: ['A consistent visual language across vehicles, textiles and the spaces the brand serves.'],
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
    hero: img('dwego', 'movement-campaign.png', 4500, 5625, 'DWEGO movement campaign with three athletes'),
    gallery: [
      img('dwego', 1, 2200, 2750, 'DWEGO sportswear campaign on a blue court'),
      img('dwego', 3, 2200, 2750, 'DWEGO summer sportswear campaign'),
      img('dwego', 4, 2200, 2750, 'DWEGO grey outfit campaign layout'),
      img('dwego', 5, 2200, 2750, 'DWEGO activewear campaign in pink'),
      img('dwego', 6, 2200, 2750, 'DWEGO summer campaign in red sportswear'),
    ],
    logoClient: null,
    year: null,
    services: null,
    challenge: null,
    approach: ['Movement, confident poses and strong colour carry the sportswear story.'],
    execution: ['The supplied campaign layouts pair athletes with short headlines and clear product focus.'],
    results: ['The series gives DWEGO a consistent look across several outfits and settings.'],
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
    hero: img('dtale', 'store-entrance-20261019.jpg', 720, 1280, 'DTALE store entrance with arched doorways and bilingual signage'),
    gallery: [
      img('dtale', 'store-front-20261019.jpg', 720, 1280, 'DTALE storefront with illuminated lettering and clothing displays'),
      img('dtale', 1, 494, 619, 'DTALE formal office outfits campaign'),
    ],
    logoClient: 'DTALE',
    year: null,
    services: null,
    challenge: null,
    approach: ['The supplied images bring the fashion and the physical store into one story.'],
    execution: ['A formal outfit campaign sits alongside a photograph of the DTALE storefront.'],
    results: ['Together, they show the brand in both its campaign and retail setting.'],
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
    hero: img('dead-sea', 1, 2200, 1467, 'I love Dead Sea sign at the Tourist Beach'),
    gallery: [
      img('dead-sea', 2, 2200, 2750, 'Jordanian flag above the Dead Sea shore'),
      img('dead-sea', 3, 2200, 2750, 'Dead Sea Tourist Beach logo on a building'),
      img('dead-sea', 4, 2200, 1467, 'Shade umbrellas along the Dead Sea shore'),
      img('dead-sea', 5, 2200, 2750, 'Colourful play area at Dead Sea Tourist Beach'),
      img('dead-sea', 6, 2200, 1467, 'Bilingual welcome sign at Dead Sea Tourist Beach'),
    ],
    logoClient: 'Dead Sea Tourist Beach',
    year: null,
    services: null,
    challenge: null,
    approach: ['Shoreline views and recognizable arrival points introduce the place before its details.'],
    execution: ['The photographs show the beach, welcome signage, amenities and family spaces.'],
    results: ['The collection presents a fuller view of the destination, from entrance to water’s edge.'],
  },
  {
    slug: 'olvy',
    client: 'OLVY',
    displayName: 'OLVY',
    sector: 'Skincare',
    location: null,
    // the line set under the OLVY logo
    statement: 'Rooted in Nature.',
    brand: ['OLVY presents soaps and body care in a palette of greens, warm neutrals and natural textures.'],
    hero: img('olvy', 1, 1152, 1440, 'OLVY body care product among green leaves'),
    gallery: [
      img('olvy', 2, 1440, 1920, 'OLVY soap bars in several colours'),
      img('olvy', 3, 1339, 1661, 'Hands holding OLVY soap bars'),
      img('olvy', 4, 1639, 2048, 'OLVY bottle framed by pink stone'),
      img('olvy', 5, 1638, 2048, 'OLVY bottle and lemons in a woven bag'),
      img('olvy', 6, 1152, 1440, 'OLVY packaged products on a wooden table'),
      img('olvy', 7, 1122, 1402, 'OLVY soap bars among rose petals'),
    ],
    logoClient: 'OLVY',
    year: null,
    services: null,
    challenge: null,
    approach: ['Natural light, plants and tactile surfaces echo the “Rooted in Nature” line.'],
    execution: ['The images move between the soaps, bottled products and ingredients used in the styling.'],
    results: ['The product range reads as one visual family across the supplied photographs.'],
  },
  {
    slug: 'dead-sea-corniche',
    client: 'Dead Sea Corniche',
    displayName: 'Dead Sea Corniche',
    sector: 'Public waterfront',
    location: 'Dead Sea, Jordan',
    // public facts from the opening (Petra news agency, May 2026), until the brand guideline arrives
    statement: 'A 1.2 km promenade on the northern Dead Sea shore.',
    brand: ['A public space on the northern Dead Sea shore, with shaded paths, places to sit and views over the water.'],
    hero: img('dead-sea-corniche', 1, 2200, 1467, 'I love Dead Sea sign on the Corniche promenade'),
    gallery: [
      img('dead-sea-corniche', 2, 2200, 2750, 'Bench overlooking the Dead Sea from the Corniche'),
      img('dead-sea-corniche', 3, 2200, 1466, 'Palm-lined pedestrian space at the Dead Sea Corniche'),
      img('dead-sea-corniche', 4, 2200, 1467, 'Blue visitor train at the Dead Sea Corniche'),
      img('dead-sea-corniche', 5, 2200, 1467, 'Children’s playground at the Corniche'),
      img('dead-sea-corniche', 6, 2200, 1467, 'Sports court at the Dead Sea Corniche'),
      img('dead-sea-corniche', 7, 2200, 1467, 'Palm trees along a Corniche walkway'),
      img('dead-sea-corniche', 8, 2200, 1467, 'Shaded seating along the Corniche'),
    ],
    logoClient: null,
    year: null,
    services: null,
    challenge: null,
    approach: ['The photography follows the public space through its landscape, paths and activities.'],
    execution: ['Views of the water sit beside playgrounds, sports facilities, seating and the visitor train.'],
    results: ['The images show the Corniche as a place to explore and spend time by the Dead Sea.'],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const projectPath = (slug: string) => `/work/${slug}`;

/** The project after this one, wrapping round to the first. */
export const nextProject = (slug: string): Project => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
