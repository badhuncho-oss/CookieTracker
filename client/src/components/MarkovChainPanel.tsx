import { useBaccaratContext } from "@/context/BaccaratContext";
export default function MarkovChainPanel() {
  const { markov } = useBaccaratContext();
  return (
    <div>
      <div className="flex items-center justify-between px-1.5 py-0.5 border-b border-gray-800">
        <span className="text-[7px] text-gray-400 font-bold uppercase">Markov</span>
        <div className="flex gap-1 text-[7px]">
          <span className="text-cyan-400">{markov.signalLevel}</span>
          <span className="text-green-400">{markov.signalLabel}</span>
          <span className="text-gray-600">n={markov.sampleCount}</span>
        </div>
      </div>
      <div className="px-1.5 py-0.5">
        <div className="flex items-center gap-0.5 mb-0.5">
          <span className="text-[7px] text-gray-500">PAT:</span>
          <span className="text-[8px] font-black text-white font-mono">{markov.currentPattern || '—'}</span>
          <span className="text-[7px] text-gray-700 ml-1">d{markov.activeDepth}</span>
        </div>
        {[
          { l: 'B', pct: markov.bankerPct, bg: 'bg-red-500', col: 'text-red-400' },
          { l: 'P', pct: markov.playerPct, bg: 'bg-cyan-500', col: 'text-cyan-400' },
          { l: 'T', pct: markov.tiePct, bg: 'bg-yellow-400', col: 'text-yellow-400' },
        ].map(r => (
          <div key={r.l} className="flex items-center gap-1 mb-0.5">
            <span className={`text-[7px] font-bold w-3 ${r.col}`}>{r.l}</span>
            <div className="flex-1 h-1 bg-gray-900 rounded-full overflow-hidden">
              <div className={`h-full ${r.bg} rounded-full`} style={{ width: `${r.pct}%` }} />
            </div>
            <span className="text-[7px] text-gray-500 w-5 text-right">{r.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
