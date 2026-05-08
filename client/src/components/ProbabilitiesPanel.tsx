import { useBaccaratContext } from "@/context/BaccaratContext";
export default function ProbabilitiesPanel() {
  const { statistics } = useBaccaratContext();
  const t = statistics.totalPlays || 1;
  const b = Math.round((statistics.bankerWins / t) * 100) || 50;
  const p = Math.round((statistics.playerWins / t) * 100) || 17;
  const tie = Math.round((statistics.tieWins / t) * 100) || 33;
  const rows = [
    { label: 'B', pct: b, bg: 'bg-red-500' },
    { label: 'P', pct: p, bg: 'bg-cyan-500' },
    { label: 'T', pct: tie, bg: 'bg-yellow-400' },
  ];
  return (
    <div className="px-1.5 py-1">
      <div className="text-[7px] text-gray-600 uppercase mb-0.5">Probabilities</div>
      {rows.map(r => (
        <div key={r.label} className="flex items-center gap-1 mb-0.5">
          <span className="text-[7px] font-bold text-gray-400 w-3">{r.label}</span>
          <div className="flex-1 h-1.5 bg-gray-900 rounded-full overflow-hidden">
            <div className={`h-full ${r.bg} rounded-full`} style={{ width: `${r.pct}%` }} />
          </div>
          <span className="text-[7px] text-gray-500 w-5 text-right">{r.pct}%</span>
        </div>
      ))}
    </div>
  );
}
