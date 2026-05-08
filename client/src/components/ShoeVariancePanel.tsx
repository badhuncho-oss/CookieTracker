import { useBaccaratContext } from "@/context/BaccaratContext";

export default function ShoeVariancePanel() {
  const { shoeVariance } = useBaccaratContext();

  return (
    <div className="bg-black border border-gray-800 h-full">
      <div className="flex items-center px-2 py-1 border-b border-gray-800 gap-1">
        <span className="text-[8px] text-green-500">◆</span>
        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Shoe Variance</span>
      </div>
      <div className="p-2 space-y-2">
        <div className="grid grid-cols-3 gap-1">
          <div className="border border-red-900 bg-red-950 bg-opacity-30 rounded p-1 text-center">
            <div className="text-[8px] text-red-400 font-bold uppercase">BANKER</div>
            <div className="text-lg font-black text-white">{shoeVariance.bankerCount}</div>
            <div className="text-[8px] text-red-400">{shoeVariance.bankerPct}%</div>
          </div>
          <div className="border border-cyan-900 bg-cyan-950 bg-opacity-30 rounded p-1 text-center">
            <div className="text-[8px] text-cyan-400 font-bold uppercase">PLAYER</div>
            <div className="text-lg font-black text-white">{shoeVariance.playerCount}</div>
            <div className="text-[8px] text-cyan-400">{shoeVariance.playerPct}%</div>
          </div>
          <div className="border border-yellow-900 bg-yellow-950 bg-opacity-30 rounded p-1 text-center">
            <div className="text-[8px] text-yellow-400 font-bold uppercase">TIE</div>
            <div className="text-lg font-black text-white">{shoeVariance.tieCount}</div>
            <div className="text-[8px] text-yellow-400">{shoeVariance.tiePct}%</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          <div className="flex justify-between">
            <span className="text-[9px] text-gray-500">VARIANCE</span>
            <span className="text-[9px] text-white font-bold">{shoeVariance.variance}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[9px] text-gray-500">Z-SCORE</span>
            <span className={`text-[9px] font-bold ${Math.abs(shoeVariance.zScore) > 1.5 ? 'text-red-400' : 'text-gray-300'}`}>
              {shoeVariance.zScore > 0 ? '+' : ''}{shoeVariance.zScore}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[9px] text-gray-500">VOLATILITY</span>
            <span className={`text-[9px] font-bold ${shoeVariance.volatility === 'HIGH' ? 'text-red-400' : shoeVariance.volatility === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}`}>
              {shoeVariance.volatility}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[9px] text-gray-500">TREND</span>
            <span className={`text-[9px] font-bold ${shoeVariance.trend === 'NEUTRAL' ? 'text-gray-400' : shoeVariance.trend === 'BANKER' ? 'text-red-400' : shoeVariance.trend === 'PLAYER' ? 'text-cyan-400' : 'text-yellow-400'}`}>
              {shoeVariance.trend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
