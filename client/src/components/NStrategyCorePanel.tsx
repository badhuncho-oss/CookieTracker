import { useBaccaratContext } from "@/context/BaccaratContext";
import { useState } from "react";

export default function NStrategyCorePanel() {
  const { nStrategies } = useBaccaratContext();
  const [bpOnly, setBpOnly] = useState(true);

  const recColor = (rec: string) => {
    if (rec === 'PLAYER') return 'text-cyan-400';
    if (rec === 'BANKER') return 'text-red-400';
    if (rec === 'TIE') return 'text-yellow-400';
    return 'text-gray-500';
  };

  const catColor = (cat: string) => {
    if (cat === 'REV') return 'text-orange-400';
    if (cat === 'TIE') return 'text-yellow-400';
    if (cat === 'STK') return 'text-green-400';
    return 'text-gray-500';
  };

  const trendColor = (trend: string) => {
    if (trend === '↑↑') return 'text-green-400';
    if (trend === '↑') return 'text-green-500';
    if (trend === '↓') return 'text-red-500';
    return 'text-red-400';
  };

  return (
    <div className="bg-black border border-gray-800 h-full">
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-800">
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-green-500">◆</span>
          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">N-Strategy Core</span>
        </div>
        <button
          onClick={() => setBpOnly(!bpOnly)}
          className={`text-[8px] px-1.5 py-0.5 rounded border transition-colors ${bpOnly ? 'border-cyan-700 text-cyan-400' : 'border-gray-700 text-gray-500'}`}
        >
          B/P ONLY
        </button>
      </div>
      <div className="p-1 space-y-0.5">
        {nStrategies.map((entry, i) => (
          <div key={i} className={`flex items-center gap-1 px-1 py-0.5 rounded ${entry.lowSamples !== undefined ? 'opacity-50' : ''}`}>
            <span className="text-[9px] text-gray-600 w-4">{entry.level}</span>
            <span className="text-[9px] text-gray-400 flex-1 font-mono">{entry.pattern || '-'}</span>
            {entry.lowSamples !== undefined ? (
              <span className="text-[8px] text-gray-600">Low samples ({entry.lowSamples})</span>
            ) : (
              <>
                <span className="text-[8px] text-gray-600">→</span>
                <span className={`text-[9px] font-bold ${recColor(entry.recommendation)}`}>{entry.recommendation}</span>
                <span className={`text-[9px] font-bold ml-auto ${entry.confidence >= 65 ? 'text-white' : 'text-gray-500'}`}>{entry.confidence > 0 ? `${entry.confidence}%` : '-'}</span>
                <span className={`text-[9px] ${trendColor(entry.trend)}`}>{entry.trend}</span>
                <span className={`text-[8px] ${catColor(entry.category)}`}>{entry.category}</span>
              </>
            )}
          </div>
        ))}
        {nStrategies.length === 0 && (
          <div className="text-[9px] text-gray-600 px-1 py-2 text-center">Enter plays to begin analysis</div>
        )}
      </div>
    </div>
  );
}
