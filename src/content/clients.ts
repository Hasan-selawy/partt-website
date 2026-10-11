/** Brands partt works with. One-colour logo files live in /public/img/logos. */

export type Client = {
  name: string;
  logo: string;
  /** intrinsic size of the logo file */
  w: number;
  h: number;
  /** optical size correction so wide and tall logos carry the same weight in a row */
  scale: number;
};

export const clients: Client[] = [
  { name: 'Salt Beach', logo: '/img/logos/l-saltbeach.png', w: 700, h: 236, scale: 1 },
  { name: 'LÉVO Café', logo: '/img/logos/l-levo.png', w: 700, h: 361, scale: 1.15 },
  { name: 'INCHARGE', logo: '/img/logos/l-incharge.png', w: 700, h: 243, scale: 0.9 },
  { name: 'DTALE', logo: '/img/logos/l-dtale.png', w: 700, h: 90, scale: 0.4 },
  { name: 'Dead Sea Tourist Beach', logo: '/img/logos/l-deadsea.png', w: 700, h: 171, scale: 0.85 },
  { name: 'OLVY', logo: '/img/logos/l-olvy.png', w: 700, h: 287, scale: 1 },
  { name: 'Celatte', logo: '/img/logos/l-celatte.png', w: 700, h: 409, scale: 1.3 },
];

export const clientByName = (name: string) => clients.find((c) => c.name === name);
