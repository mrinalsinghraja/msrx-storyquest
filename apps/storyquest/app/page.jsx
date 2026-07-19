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

              {/* States the situation the learner is dropped into, in their
                * words. The page this replaces opened "Think deeply. Change the
                * outcome." — an instruction and a promise, neither of which
                * tells you what the thing actually is. */}
              <h1 style={{ marginTop: '1.2rem' }}>
                Something is going wrong.
                <br />
                You get one dial.
              </h1>

              <p className="lede" style={{ marginTop: '1.4rem' }}>
                Every mission drops you into a system that is failing — a crane creeping, a circuit
                overloading, a pond losing its fish. You get one real control and a live lab. Move it
                until the equation balances. There is nothing to guess at: the numbers have to agree.
              </p>

              <div className="actions" style={{ marginTop: '2rem' }}>
                <Link className="btn btn-primary" href={heroMission.path}>
                  Start this mission
                </Link>
                <Link className="btn btn-quiet" href="/learn">
                  Browse all {CATALOGUE.missions}
                </Link>
              </div>

              <p className="eyebrow" style={{ marginTop: '1.6rem' }}>
                Free · No sign-up · Nothing stored
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
