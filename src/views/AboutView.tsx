import { Closing } from '@/components/layout/Closing';
import { ProcessSteps } from '@/components/services/ProcessSteps';
import { ClosingMark } from '@/components/ui/ClosingMark';
import { PageHero } from '@/components/ui/PageHero';
import { Placeholder } from '@/components/ui/Placeholder';
import { Reveal } from '@/components/ui/Reveal';
import { about } from '@/content/about';
import { site } from '@/content/site';

export function AboutView() {
  return (
    <>
      <main id="main" className="ab">
        <PageHero lines={about.heroLines} theme="paper" piece={3} lede={about.lede} />

        <section className="ab-story t-ink" data-nav="ink" aria-label="Our story">
          <Reveal>
            <p className="ab-big">{about.story[0]}</p>
          </Reveal>
          <div className="ab-name">
            <ClosingMark className="ab-mark" />
            <Reveal className="ab-name-txt">
              <h2 className="disp">{about.name.title}</h2>
              <p>{about.name.text}</p>
              <p className="ab-eq disp" aria-label={`${about.name.equation[0]} plus ${about.name.equation[1]} equals ${about.name.equation[2]}`}>
                {about.name.equation[0]} <b>+</b> {about.name.equation[1]} <b>=</b> {about.name.equation[2]}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="ab-approach" aria-labelledby="ab-approach-title">
          <h2 className="disp" id="ab-approach-title">
            {about.approach.title}
          </h2>
          <Reveal className="ab-approach-txt">
            <p className="big">{about.approach.lead}</p>
            {about.approach.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
        </section>

        <section className="ab-pillars t-orange" data-nav="orange" aria-label="What we stand on">
          <ul>
            {about.pillars.map((pillar, i) => (
              <li key={pillar.name}>
                <Reveal delay={i * 90}>
                  <h3 className="disp">{pillar.name}</h3>
                  <p>{pillar.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <section className="ab-process">
          <ProcessSteps />
        </section>

        {about.team.length || site.showPlaceholders ? (
          <section className="ab-team" aria-labelledby="ab-team-title">
            <h2 className="disp" id="ab-team-title">
              The team
            </h2>
            {about.team.length ? (
              <ul className="ab-people">
                {about.team.map((person) => (
                  <li key={person.name}>
                    <b>{person.name}</b>
                    <span>{person.role}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <Placeholder title="Team members">Names, roles and photos of the people at partt. Add them to content/about.ts.</Placeholder>
            )}
          </section>
        ) : null}
      </main>
      <Closing />
    </>
  );
}
