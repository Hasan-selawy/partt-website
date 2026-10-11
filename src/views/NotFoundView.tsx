import { Closing } from '@/components/layout/Closing';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';

export function NotFoundView() {
  return (
    <>
      <main id="main" className="nf">
        <PageHero lines={['This part', 'is missing.']} theme="paper" piece={2} lede="The page you were looking for is not here. It may have moved, or the link may be wrong.">
          <Button href="/">Back to the homepage</Button>
        </PageHero>
      </main>
      <Closing mode="footer" />
    </>
  );
}
