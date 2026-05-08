import { useBaccaratContext } from "@/context/BaccaratContext";
const rCol = (r: string) => r === 'PLAYER' ? 'text-cyan-400' : r === 'BANKER' ? 'text-red-400' : r === 'TIE' ? 'text-yellow-400' : 'text-gray-600';
const tCol = (t: string) => t === '↑↑' ? 'text-green-400' : t === '↑' ? 'text-green-600' : 'text-red-500';
export default function NStrategyCorePanel() {
  const { nStrategies } = useBaccaratContext();
  return (
    <div>
      <div className="flex items-center justify-between px-1.5 py-0.5 border-b border-gray-800">
        <span className="text-[7px] text-gray-400 font-bold uppercase">N-Core <span className="text-gray-600">(B/P)</span></span>
      </div>
      <div className="px-1.5 py-0.5">
        {nStrategies.map((e, i) => (
          <div key={i} className="flex items-center gap-1 leading-tight">
            <span className="text-[7px] text-gray-700 w-3">{e.level}</span>
            <span className="text-[7px] text-gray-500 font-mono w-10 truncate">{e.pattern || '-'}</span>
            {e.lowSamples !== undefined
              ? <span className="text-[7px] text-gray-700">Low({e.lowSamples})</span>
              : <>
                  <span className={`text-[7px] font-bold ${rCol(e.recommendation)}`}>{e.recommendation.slice(0, 1)}</span>
                  <span className="text-[7px] text-gray-500">{e.confidence}%</span>
                  <span className={`text-[7px] ${tCol(e.trend)}`}>{e.trend}</span>
                  <span className="text-[7px] text-gray-600">{e.category}</span>
                </>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
