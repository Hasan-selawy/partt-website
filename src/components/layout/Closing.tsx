import Link from 'next/link';
import { mainNav, primaryCta, site } from '@/content/site';
import { Button } from '@/components/ui/Button';
import { ClosingMark } from '@/components/ui/ClosingMark';
import { Wordmark } from '@/components/ui/Wordmark';

/**
 * The end of every page: the "Have a project in mind?" call to action, then the footer and the large wordmark.
 * `mode="footer"` drops the call to action (used on the Contact page, which already is that action).
 */
export function Closing({ mode = 'cta' }: { mode?: 'cta' | 'footer' }) {
  return (
    <div className={`closing${mode === 'footer' ? ' closing--footer' : ''}`} id="closing" data-nav="deep">
      {mode === 'cta' && (
        <section aria-labelledby="closing-title">
          <h2 className="disp" id="closing-title">
            Have a project
            <br />
            in mind?
            <ClosingMark className="cm" />
          </h2>
          <div className="go">
            <p>Tell us what you&apos;re working on and how partt can help bring it to life.</p>
            <Button href={primaryCta.href} variant="inv" magnetic>
              {primaryCta.label}
            </Button>
          </div>
        </section>
      )}
      <footer className="foot">
        <nav aria-label="Footer">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <address>
          <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span>{site.location}</span>
        </address>
        <p className="legal">
          © {new Date().getFullYear()} {site.legalName}
        </p>
      </footer>
      <Wordmark className="wm" label={null} />
    </div>
  );
}
