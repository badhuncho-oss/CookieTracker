import { useBaccaratContext } from "@/context/BaccaratContext";
const rCol = (r: string) => r === 'PLAYER' ? 'text-cyan-400' : r === 'BANKER' ? 'text-red-400' : r === 'TIE' ? 'text-yellow-400' : 'text-gray-600';
export default function NStrategyRawPanel() {
  const { nStrategiesRaw, tieAnalysis } = useBaccaratContext();
  return (
    <div>
      <div className="flex items-center justify-between px-1.5 py-0.5 border-b border-gray-800">
        <span className="text-[7px] text-gray-400 font-bold uppercase">N-Raw <span className="text-gray-600">(+Tie)</span></span>
        <span className={`text-[7px] font-bold ${tieAnalysis.behavior === 'ABNORMAL' ? 'text-red-400' : 'text-green-600'}`}>{tieAnalysis.behavior}</span>
      </div>
      <div className="px-1.5 py-0.5">
        {nStrategiesRaw.map((e, i) => (
          <div key={i} className="flex items-center gap-1 leading-tight">
            <span className="text-[7px] text-gray-700 w-3">{e.level}</span>
            <span className="text-[7px] text-gray-500 font-mono w-10 truncate">{e.pattern || '-'}</span>
            {e.lowSamples !== undefined
              ? <span className="text-[7px] text-gray-700">Low({e.lowSamples})</span>
              : e.recommendation
                ? <><span className={`text-[7px] font-bold ${rCol(e.recommendation)}`}>{e.recommendation.slice(0, 1)}</span><span className="text-[7px] text-gray-500">{e.confidence}%</span></>
                : <span className="text-[7px] text-gray-700">—</span>
            }
          </div>
        ))}
        <div className="border-t border-gray-800 mt-0.5 pt-0.5 grid grid-cols-3 gap-0.5">
          <div><div className="text-[7px] text-gray-600">DIST</div><div className={`text-[8px] font-bold ${tieAnalysis.disturbance > 15 ? 'text-red-400' : 'text-gray-300'}`}>{tieAnalysis.disturbance}%</div></div>
          <div><div className="text-[7px] text-gray-600">CLUST</div><div className="text-[8px] font-bold text-white">{tieAnalysis.clusters}</div></div>
          <div><div className="text-[7px] text-gray-600">IMP</div><div className={`text-[8px] font-bold ${tieAnalysis.confImpact < 0 ? 'text-red-400' : 'text-green-400'}`}>{tieAnalysis.confImpact}p%</div></div>
        </div>
      </div>
    </div>
  );
}
