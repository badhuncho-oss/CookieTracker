import { useBaccaratContext } from "@/context/BaccaratContext";

export default function AIPerformancePanel() {
  const { totalCorrect, totalWrong, statistics } = useBaccaratContext();
  const total = totalCorrect + totalWrong;
  const accuracy = total > 0 ? ((totalCorrect / total) * 100).toFixed(1) : '0.0';
  const winRate = accuracy;
  const lossRate = total > 0 ? ((totalWrong / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-black border border-gray-800 p-2 h-full">
      <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">AI Performance</div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        <div>
          <div className="text-[9px] text-gray-500">CORRECT</div>
          <div className="text-base font-bold text-white">{totalCorrect}</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-gray-500">WIN RATE</div>
          <div className="text-base font-bold text-green-400">{winRate}%</div>
        </div>
        <div>
          <div className="text-[9px] text-gray-500">WRONG</div>
          <div className="text-base font-bold text-white">{totalWrong}</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-gray-500">LOSS RATE</div>
          <div className="text-base font-bold text-red-400">{lossRate}%</div>
        </div>
        <div className="col-span-2 border-t border-gray-800 pt-0.5 mt-0.5 flex justify-between">
          <div>
            <div className="text-[9px] text-gray-500">ACCURACY</div>
            <div className="text-sm font-bold text-yellow-400">{accuracy}%</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-gray-500">◆ PLAYS</div>
            <div className="text-sm font-bold text-white">
              {statistics.totalPlays}
              <span className="text-[8px] text-gray-500 ml-1">
                {statistics.bankerWins}B|{statistics.playerWins}P|{statistics.tieWins}T
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
