import { useBaccaratContext } from "@/context/BaccaratContext";
export default function ShoeVariancePanel() {
  const { shoeVariance: sv } = useBaccaratContext();
  return (
    <div>
      <div className="flex items-center justify-between px-1.5 py-0.5 border-b border-gray-800">
        <span className="text-[7px] text-gray-400 font-bold uppercase">Shoe Variance</span>
        <span className={`text-[7px] font-bold ${sv.volatility === 'HIGH' ? 'text-red-400' : sv.volatility === 'MEDIUM' ? 'text-yellow-400' : 'text-green-500'}`}>{sv.volatility}</span>
      </div>
      <div className="px-1.5 py-0.5">
        <div className="grid grid-cols-3 gap-0.5 mb-0.5">
          <div className="text-center bg-red-950 border border-red-900 rounded px-0.5 py-0.5">
            <div className="text-[7px] text-red-400">B</div>
            <div className="text-[9px] font-black text-white">{sv.bankerCount}</div>
            <div className="text-[6px] text-red-400">{sv.bankerPct}%</div>
          </div>
          <div className="text-center bg-cyan-950 border border-cyan-900 rounded px-0.5 py-0.5">
            <div className="text-[7px] text-cyan-400">P</div>
            <div className="text-[9px] font-black text-white">{sv.playerCount}</div>
            <div className="text-[6px] text-cyan-400">{sv.playerPct}%</div>
          </div>
          <div className="text-center bg-yellow-950 border border-yellow-900 rounded px-0.5 py-0.5">
            <div className="text-[7px] text-yellow-400">T</div>
            <div className="text-[9px] font-black text-white">{sv.tieCount}</div>
            <div className="text-[6px] text-yellow-400">{sv.tiePct}%</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-2 text-[7px]">
          <div className="flex justify-between"><span className="text-gray-600">VAR</span><span className="text-white">{sv.variance}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Z</span><span className={Math.abs(sv.zScore) > 1.5 ? 'text-red-400' : 'text-gray-300'}>{sv.zScore}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">TREND</span><span className={sv.trend === 'BANKER' ? 'text-red-400' : sv.trend === 'PLAYER' ? 'text-cyan-400' : sv.trend === 'TIE' ? 'text-yellow-400' : 'text-gray-500'}>{sv.trend}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">STK</span><span className="text-white">{sv.currentStreak || '—'}</span></div>
        </div>
      </div>
    </div>
  );
}
