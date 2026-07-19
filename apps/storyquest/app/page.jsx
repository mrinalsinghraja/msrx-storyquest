import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import HeroLab from '../components/HeroLab';
import { curriculum } from '../lib/curriculum';
import { CATALOGUE, gradeRange, perSubject } from '../lib/catalogue-stats';

/**
 * The hero mission.
 *
 * Looked up by slug, not by the position-derived `physics-01` id: mission ids
 * shift when a topic is inserted ahead of them, and a home page that silently
 * started demonstrating a different lab would be a hard bug to notice.
 *
 * Torque balance earns the slot because the apparatus explains itself with no
 * caption — a beam tips, and everyone already knows what a tipping beam means.
 */
const HERO_SLUG = 'torque-balance';
const heroMission = curriculum.find((mission) => mission.slug === HERO_SLUG) ?? curriculum[0];

const worlds = [
  { id: 'physics', label: 'Physics', blurb: 'Levers, circuits, light and orbits — the rules the world runs on.' },
  { id: 'chemistry', label: 'Chemistry', blurb: 'Particles, bonds, reactions and what matter does under pressure.' },
  { id: 'mathematics', label: 'Mathematics', blurb: 'Ratios, shapes, coordinates and the shape of data.' },
  { id: 'biology', label: 'Biology', blurb: 'Cells, lungs, ecosystems and how living things stay balanced.' },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="bench flex-1" data-world={heroMission.subject}>
        <section className="shell" style={{ paddingBlock: 'clamp(2.5rem, 6vw, 5rem)' }}>
          <div
            style={{
              display: 'grid',
              gap: 'clamp(2rem, 5vw, 3.5rem)',
              alignItems: 'center',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 26rem), 1fr))',
            }}
          >
            <div>
              <p className="eyebrow">
                {CATALOGUE.missions} live labs · {gradeRange}
              </p>

              {/* Leads with the one thing no other STEM site can claim: the
                * answer is solved out of a real equation, so it cannot be
                * guessed or copied off the panel. The line this replaces —
                * "Something is going wrong. You get one dial." — named a vague
                * problem and a mechanic. It said what you are given, not why
                * anyone should stay.
                *
                * The turn is coloured rather than bolded so the claim and its
                * payoff read as one sentence with a pivot, not two headlines.
                * `--pigment-ink` is the contrast-checked ramp; the display
                * ramp is too light to carry text. */}
              <h1 style={{ marginTop: '1.2rem' }}>
                Guessing won’t get you through.
                <br />
                <span style={{ color: 'var(--pigment-ink)' }}>That’s the point.</span>
              </h1>

              {/* Kept short on purpose. The audience starts at class 1, and the
                * first draft ran 71 words explaining that there is no multiple
                * choice — which the headline has already said. Saying it twice
                * argued with the reader instead of inviting them in. */}
              <p className="lede" style={{ marginTop: '1.4rem' }}>
                Every mission drops you into something breaking — a crane tipping, a circuit
                overloading, a pond losing its fish. You get one dial and a real lab. Move it until
                both sides of the equation agree, and the lab tells you the moment they do.
              </p>

              <div className="actions" style={{ marginTop: '2rem' }}>
                <Link className="btn btn-primary" href={heroMission.path}>
                  Try this one
                </Link>
                <Link className="btn btn-quiet" href="/learn">
                  Browse all {CATALOGUE.missions}
                </Link>
              </div>

              <p className="eyebrow" style={{ marginTop: '1.6rem' }}>
                Free · No sign-up · Works on any phone
              </p>
            </div>

            <HeroLab mission={heroMission} />
          </div>
        </section>

        <section className="shell" style={{ paddingBlock: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
          <h2>Four worlds. One way in.</h2>
          <p className="lede" style={{ marginTop: '0.9rem', marginBottom: '2rem' }}>
            Each world is the same deal — a real apparatus, a real equation, one thing you control.
          </p>

          <div className="worlds">
            {worlds.map((world) => (
              <Link key={world.id} className="world" data-world={world.id} href={`/learn/${world.id}`}>
                {/* Per-world, derived. All four held 25 when this page was first
                  * written, so a single shared constant looked right on every
                  * card and became wrong on all four at once. */}
                <span className="world-count">{perSubject[world.label]} missions</span>
                <h3 style={{ marginTop: '0.5rem' }}>{world.label}</h3>
                <p>{world.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
