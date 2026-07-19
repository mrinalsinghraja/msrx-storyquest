import Link from 'next/link';

/**
 * Quarter plates are too small to carry a typeset equation legibly, and a
 * construct or explore simulator has no equation to carry in the first place.
 */
const showsSpecimen = (plate) => plate.size !== 'quarter' && Boolean(plate.formulaHtml);

/**
 * One catalogue plate.
 *
 * Shared by the full catalogue and every chapter index so the two cannot drift.
 * The whole plate is the link: an earlier lobby made you select a card and then
 * press a separate button in a sidebar, which cost a click and hid the
 * destination.
 */
export default function CataloguePlate({ plate }) {
  return (
    <Link
      href={plate.path}
      className="plate focus"
      data-world={plate.subject}
      data-size={plate.size}
    >
      <span className="plate-head">
        <span className="data plate-no">M{String(plate.number).padStart(3, '0')}</span>
        <span className="data plate-level">{plate.difficulty}</span>
      </span>

      <h3>{plate.title}</h3>

      {showsSpecimen(plate) && (
        <div className="specimen">
          <div
            className="specimen-body"
            aria-label={`Formula: ${plate.formula}`}
            dangerouslySetInnerHTML={{ __html: plate.formulaHtml }}
          />
        </div>
      )}

      <p className="caption">{plate.scenario}</p>

      <span className="plate-foot">
        <span className="data plate-lab">{plate.lab}</span>
        <span className="data plate-cta">
          Enter mission <span aria-hidden="true">→</span>
        </span>
      </span>
    </Link>
  );
}
