import { useBaccaratContext } from "@/context/BaccaratContext";

export default function NStrategyRawPanel() {
  const { tieAnalysis, shoeVariance } = useBaccaratContext();

  return (
    <div className="bg-black border border-gray-800 h-full">
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-800">
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-green-500">◆</span>
          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">N-Strategy Raw</span>
        </div>
        <span className="text-[8px] text-gray-500 uppercase tracking-wide">Tie Analysis</span>
      </div>
      <div className="p-2 space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[8px] text-gray-500 uppercase tracking-wide">Tie Disturbance</div>
            <div className={`text-xl font-black ${tieAnalysis.disturbance > 15 ? 'text-red-400' : 'text-gray-300'}`}>
              {tieAnalysis.disturbance}%
            </div>
          </div>
          <div>
            <div className="text-[8px] text-gray-500 uppercase tracking-wide">Tie Clusters</div>
            <div className="text-xl font-black text-white">{tieAnalysis.clusters}</div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-gray-500">BEHAVIOR</span>
            <span className={`text-[9px] font-bold ${tieAnalysis.behavior === 'ABNORMAL' ? 'text-red-400' : 'text-green-400'}`}>
              {tieAnalysis.behavior}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-gray-500">VOLATILITY</span>
            <div className="flex-1 mx-2 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${tieAnalysis.disturbance > 20 ? 'bg-red-500' : 'bg-gray-500'}`}
                style={{ width: `${Math.min(100, tieAnalysis.disturbance * 4)}%` }} />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-gray-500">CONF IMPACT</span>
            <span className={`text-[9px] font-bold ${tieAnalysis.confImpact < 0 ? 'text-red-400' : 'text-green-400'}`}>
              {tieAnalysis.confImpact > 0 ? '+' : ''}{tieAnalysis.confImpact} p%
            </span>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-1">
          <div className="text-[8px] text-gray-600 italic">Supporting signal only. Does not factor tie bets.</div>
        </div>
      </div>
    </div>
  );
}
