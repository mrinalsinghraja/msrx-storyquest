export default function ProgressBadge({ current, total }) {
  const safeTotal = Math.max(1, Number(total) || 1);
  const safeCurrent = Math.min(safeTotal, Math.max(1, Number(current) || 1));

  return (
    <span className="shrink-0 rounded-full border border-[#00c4df]/30 bg-[#00c4df]/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-[#0891a5]">
      {safeCurrent}/{safeTotal}
    </span>
  );
}
