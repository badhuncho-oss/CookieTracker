import { useBaccaratContext } from "@/context/BaccaratContext";

export default function NStrategyRawPanel() {
  const { nStrategiesRaw, tieAnalysis } = useBaccaratContext();

  const recColor = (rec: string) => {
    if (rec === 'PLAYER') return 'text-cyan-400';
    if (rec === 'BANKER') return 'text-red-400';
    if (rec === 'TIE') return 'text-yellow-400';
    return 'text-gray-500';
  };

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
        {/* Raw N patterns (includes Ties) */}
        <div className="space-y-0.5 mb-1">
          {nStrategiesRaw.map((entry, i) => (
            <div key={i} className="flex items-center gap-1 px-1 py-0.5">
              <span className="text-[9px] text-gray-600 w-4">{entry.level}</span>
              <span className="text-[9px] text-gray-400 flex-1 font-mono">{entry.pattern || '-'}</span>
              {entry.lowSamples !== undefined ? (
                <span className="text-[8px] text-gray-600">Low ({entry.lowSamples})</span>
              ) : entry.recommendation ? (
                <>
                  <span className={`text-[9px] font-bold ${recColor(entry.recommendation)}`}>{entry.recommendation}</span>
                  <span className={`text-[9px] ml-1 ${entry.confidence >= 65 ? 'text-white' : 'text-gray-500'}`}>{entry.confidence}%</span>
                </>
              ) : (
                <span className="text-[9px] text-gray-700">—</span>
              )}
            </div>
          ))}
        </div>

        {/* Tie analysis */}
        <div className="border-t border-gray-800 pt-1 space-y-1">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[8px] text-gray-500 uppercase">Tie Disturbance</div>
              <div className={`text-lg font-black ${tieAnalysis.disturbance > 15 ? 'text-red-400' : 'text-gray-300'}`}>
                {tieAnalysis.disturbance}%
              </div>
            </div>
            <div>
              <div className="text-[8px] text-gray-500 uppercase">Tie Clusters</div>
              <div className="text-lg font-black text-white">{tieAnalysis.clusters}</div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-gray-500">BEHAVIOR</span>
            <span className={`text-[9px] font-bold ${tieAnalysis.behavior === 'ABNORMAL' ? 'text-red-400' : 'text-green-400'}`}>
              {tieAnalysis.behavior}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-gray-500">VOLATILITY</span>
            <div className="flex-1 mx-2 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${tieAnalysis.disturbance > 20 ? 'bg-red-500' : 'bg-gray-500'}`}
                style={{ width: `${Math.min(100, tieAnalysis.disturbance * 4)}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-gray-500">CONF IMPACT</span>
            <span className={`text-[9px] font-bold ${tieAnalysis.confImpact < 0 ? 'text-red-400' : 'text-green-400'}`}>
              {tieAnalysis.confImpact > 0 ? '+' : ''}{tieAnalysis.confImpact} p%
            </span>
          </div>
          <div className="border-t border-gray-800 pt-1">
            <div className="text-[8px] text-gray-600 italic">Supporting signal only. Tie is PUSH unless Tie Mode enabled.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
