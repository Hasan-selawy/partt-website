import type { Metadata } from 'next';
import { site } from '@/content/site';
import { HomeView } from '@/views/HomeView';

export const metadata: Metadata = {
  title: { absolute: `${site.name} | ${site.slogan}` },
  description: site.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return <HomeView />;
}
