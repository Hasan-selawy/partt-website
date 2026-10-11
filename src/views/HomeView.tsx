import { ClientMarquee } from '@/components/home/ClientMarquee';
import { Hero } from '@/components/home/Hero';
import { HomeExperience } from '@/components/home/HomeExperience';
import { SelectedWork } from '@/components/home/SelectedWork';
import { ServicesStack } from '@/components/home/ServicesStack';
import { Statement } from '@/components/home/Statement';
import { Closing } from '@/components/layout/Closing';

/**
 * The homepage: partt first, then the brands that trust it, then the work, then the services.
 * Navy carries the intro and the brands; the rest sits on paper.
 * The closing sheet sits inside the services stack so it can slide over the last service.
 */
export function HomeView() {
  return (
    <main id="main">
      <HomeExperience>
        <Hero />
        <div className="run" id="run" data-nav="ink">
          <Statement />
          <ClientMarquee />
        </div>
        <SelectedWork />
        <ServicesStack>
          <Closing />
        </ServicesStack>
      </HomeExperience>
    </main>
  );
}
