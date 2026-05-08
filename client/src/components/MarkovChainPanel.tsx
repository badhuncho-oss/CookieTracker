import { useBaccaratContext } from "@/context/BaccaratContext";

export default function MarkovChainPanel() {
  const { markov } = useBaccaratContext();

  return (
    <div className="bg-black border border-gray-800 h-full">
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-800">
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-green-500">◆</span>
          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Markov Chain</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-cyan-400 font-bold">{markov.signalLevel}</span>
          <span className="text-[8px] text-gray-600">|</span>
          <span className="text-[8px] text-green-400 font-bold">{markov.signalLabel}</span>
          <span className="text-[8px] text-gray-600">|</span>
          <span className="text-[8px] text-gray-500">n={markov.sampleCount}</span>
        </div>
      </div>
      <div className="p-2 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-500">PATTERN</span>
          <span className="text-sm font-black text-white font-mono">{markov.currentPattern || '—'}</span>
          <span className="text-[8px] text-gray-600">depth={markov.activeDepth}</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-red-400 font-bold w-10">BANKER</span>
            <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${markov.bankerPct}%` }} />
            </div>
            <span className="text-[9px] text-gray-400 w-7 text-right">{markov.bankerPct}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-cyan-400 font-bold w-10">PLAYER</span>
            <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${markov.playerPct}%` }} />
            </div>
            <span className="text-[9px] text-gray-400 w-7 text-right">{markov.playerPct}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-yellow-400 font-bold w-10">TIE</span>
            <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${markov.tiePct}%` }} />
            </div>
            <span className="text-[9px] text-gray-400 w-7 text-right">{markov.tiePct}%</span>
          </div>
        </div>
        <div className="text-[8px] text-gray-700 italic">Adaptive depth: N4→N3→N2→N1. Core history only.</div>
      </div>
    </div>
  );
}
