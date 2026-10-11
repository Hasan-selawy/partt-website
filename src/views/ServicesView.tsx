import { Closing } from '@/components/layout/Closing';
import { ProcessSteps } from '@/components/services/ProcessSteps';
import { ServiceSheet } from '@/components/services/ServiceSheet';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { customNote, services } from '@/content/services';

export function ServicesView() {
  return (
    <>
      <main id="main" className="sv">
        <PageHero lines={['Four parts.', 'One fit.']} theme="paper" piece={1} lede="Everything we do to help brands grow, connect, and stand out. Take one part, or all four." />
        <div className="svp-list">
          {services.map((service) => (
            <ServiceSheet key={service.slug} service={service} mode="page" />
          ))}
        </div>
        <section className="sv-after">
          <Reveal className="sv-custom">
            <h2 className="disp">{customNote.title}</h2>
            <p>{customNote.text}</p>
          </Reveal>
          <ProcessSteps />
        </section>
      </main>
      <Closing />
    </>
  );
}
