import { useBaccaratContext } from "@/context/BaccaratContext";

export default function ProbabilitiesPanel() {
  const { statistics } = useBaccaratContext();
  const total = statistics.totalPlays || 1;
  const bPct = Math.round((statistics.bankerWins / total) * 100) || 50;
  const pPct = Math.round((statistics.playerWins / total) * 100) || 17;
  const tPct = Math.round((statistics.tieWins / total) * 100) || 33;

  return (
    <div className="bg-black border border-gray-800 p-2 h-full">
      <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-2">Probabilities</div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-red-400 w-10 font-bold">BANKER</span>
          <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${bPct}%` }} />
          </div>
          <span className="text-[9px] text-gray-400 w-7 text-right">{bPct}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-cyan-400 w-10 font-bold">PLAYER</span>
          <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${pPct}%` }} />
          </div>
          <span className="text-[9px] text-gray-400 w-7 text-right">{pPct}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-yellow-400 w-10 font-bold">TIE</span>
          <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${tPct}%` }} />
          </div>
          <span className="text-[9px] text-gray-400 w-7 text-right">{tPct}%</span>
        </div>
      </div>
    </div>
  );
}
