import Link from 'next/link';
import { mainNav, primaryCta, site } from '@/content/site';
import { policies } from '@/content/policies';
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
        <section className="closing-cta" aria-labelledby="closing-title">
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
      <footer className="foot" role="contentinfo">
        <Wordmark className="wm" label={null} />
        <div className="foot-main">
          <div className="foot-brand">
            <Link href="/" className="foot-logo" aria-label="partt home">
              <Wordmark label={null} />
            </Link>
            <p>{site.footerLine}</p>
          </div>
          <nav className="foot-nav" aria-labelledby="footer-links-title">
            <h2 id="footer-links-title">Quick links</h2>
            <ul>
              <li><Link href="/">Home</Link></li>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="foot-nav policy-links" aria-labelledby="footer-resources-title">
            <h2 id="footer-resources-title">Resources</h2>
            <ul>
              {Object.values(policies).map((policy) => (
                <li key={policy.path}>
                  <Link href={policy.path}>{policy.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="foot-contact">
            <h2 id="footer-contact-title">Contact</h2>
            <address aria-labelledby="footer-contact-title">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
              <span>{site.location}</span>
            </address>
          </div>
        </div>
        <div className="foot-bottom">
          <p className="legal">© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <p className="slogan disp">Partner in every <b>Part</b></p>
          <a className="foot-top" href="#main">
            Back to top
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 20V4m-6 6 6-6 6 6" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
