const columns = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-2',
};

export default function ChoiceBar({ choices, onChoose }) {
  if (!choices?.length) return null;
  const columnClass = columns[choices.length] ?? 'grid-cols-2';

  return (
    <div className={`grid gap-2 ${columnClass}`}>
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          onClick={() => onChoose(choice.id)}
          className="focus-ring group min-h-[54px] rounded-xl border border-[var(--border-strong)] bg-white px-3 py-2 text-[13px] font-semibold leading-tight text-[var(--text-primary)] shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-[#00c4df] hover:text-[#0891a5] active:translate-y-0"
        >
          <span>{choice.label}</span><span aria-hidden="true" className="ml-1.5 inline-block text-[#00c4df] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">→</span>
        </button>
      ))}
    </div>
  );
}
