import { ContactForm } from '@/components/contact/ContactForm';
import { Closing } from '@/components/layout/Closing';
import { PageHero } from '@/components/ui/PageHero';
import { site } from '@/content/site';

export function ContactView() {
  return (
    <>
      <main id="main" className="ct">
        <PageHero lines={['Start a', 'project.']} theme="red" piece={0} lede="Tell us what you're working on and how partt can help bring it to life." />
        <div className="ct-body">
          <aside className="ct-side" aria-label="Contact details">
            <h2 className="disp">Or reach us directly</h2>
            <address>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
              <span>{site.location}</span>
            </address>
          </aside>
          <ContactForm />
        </div>
      </main>
      <Closing mode="footer" />
    </>
  );
}
