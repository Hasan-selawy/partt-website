import Link from 'next/link';
import { Closing } from '@/components/layout/Closing';
import { PageHero } from '@/components/ui/PageHero';
import { policies, policyUpdated, type Policy } from '@/content/policies';
import { site } from '@/content/site';

/** All three policies share the existing inner-page typography, colours, and footer. */
export function PolicyView({ policy }: { policy: Policy }) {
  return (
    <>
      <main id="main" className="policy">
        <PageHero lines={policy.lines} lede={policy.introduction} piece={1} />
        <article className="policy-body" aria-label={policy.title}>
          <div className="policy-top">
            <p className="policy-updated">
              Last updated <time dateTime={policyUpdated.date}>{policyUpdated.label}</time>
            </p>
            <nav aria-label="Policy pages">
              <ul className="policy-nav">
                {Object.values(policies).map((item) => (
                  <li key={item.path}>
                    <Link href={item.path} aria-current={item.path === policy.path ? 'page' : undefined}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {policy.sections.map((section) => (
            <section className="policy-section" key={section.id} aria-labelledby={section.id}>
              <h2 className="disp" id={section.id}>{section.title}</h2>
              <div className="policy-copy">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                {section.links?.map((link) => (
                  <p key={link.href}><a href={link.href}>{link.label}</a></p>
                ))}
              </div>
            </section>
          ))}
          <section className="policy-section" aria-labelledby="policy-contact-title">
            <h2 className="disp" id="policy-contact-title">Questions? Contact us.</h2>
            <address className="policy-copy policy-contact">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
              <span>{site.legalName} · {site.location}</span>
            </address>
          </section>
        </article>
      </main>
      <Closing mode="footer" />
    </>
  );
}
