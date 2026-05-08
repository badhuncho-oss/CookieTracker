import { useBaccaratContext } from "@/context/BaccaratContext";
export default function AIPerformancePanel() {
  const { totalCorrect, totalWrong, statistics } = useBaccaratContext();
  const tot = totalCorrect + totalWrong;
  const acc = tot > 0 ? ((totalCorrect / tot) * 100).toFixed(1) : '0.0';
  const loss = tot > 0 ? ((totalWrong / tot) * 100).toFixed(1) : '0.0';
  return (
    <div className="px-1.5 py-1">
      <div className="text-[7px] text-gray-600 uppercase mb-0.5">AI Performance</div>
      <div className="grid grid-cols-2 gap-x-1 gap-y-0">
        <div><span className="text-[7px] text-gray-500">OK </span><span className="text-[8px] font-bold text-white">{totalCorrect}</span></div>
        <div className="text-right"><span className="text-[7px] text-green-500 font-bold">{acc}%</span></div>
        <div><span className="text-[7px] text-gray-500">✗ </span><span className="text-[8px] font-bold text-white">{totalWrong}</span></div>
        <div className="text-right"><span className="text-[7px] text-red-400 font-bold">{loss}%</span></div>
      </div>
      <div className="text-[7px] text-yellow-500 font-bold mt-0.5">{acc}% <span className="text-gray-600">acc</span></div>
      <div className="text-[7px] text-gray-600">{statistics.totalPlays}pl {statistics.bankerWins}B/{statistics.playerWins}P/{statistics.tieWins}T</div>
    </div>
  );
}
