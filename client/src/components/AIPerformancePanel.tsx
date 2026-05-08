import { useBaccaratContext } from "@/context/BaccaratContext";
export default function AIPerformancePanel() {
  const { totalCorrect, totalWrong, totalPushes, totalSkipped, secondAIPerf } = useBaccaratContext();
  const tot = totalCorrect + totalWrong;
  const acc = tot > 0 ? ((totalCorrect / tot) * 100).toFixed(1) : '0.0';
  const allHands = totalCorrect + totalWrong + totalPushes;
  const wr = allHands > 0 ? Math.round((totalCorrect / allHands) * 100) : 0;
  const lr = allHands > 0 ? Math.round((totalWrong / allHands) * 100) : 0;
  const pr = allHands > 0 ? Math.round((totalPushes / allHands) * 100) : 0;
  return (
    <div className="px-1.5 py-1">
      <div className="text-[7px] text-gray-600 uppercase mb-0.5">AI Perf <span className="text-purple-500">/ 2nd AI</span></div>
      {/* Main AI */}
      <div className="grid grid-cols-4 text-center gap-0.5 mb-0.5">
        <div><div className="text-[6px] text-gray-600">WIN</div><div className="text-[8px] font-black text-green-400">{totalCorrect}</div></div>
        <div><div className="text-[6px] text-gray-600">LOSS</div><div className="text-[8px] font-black text-red-400">{totalWrong}</div></div>
        <div><div className="text-[6px] text-gray-600">PSH</div><div className="text-[8px] font-black text-yellow-400">{totalPushes}</div></div>
        <div><div className="text-[6px] text-gray-600">SKIP</div><div className="text-[8px] font-black text-gray-600">{totalSkipped}</div></div>
      </div>
      <div className="flex gap-1.5 text-[7px] mb-0.5">
        <span className="text-gray-600">ACC <span className="text-yellow-400 font-bold">{acc}%</span></span>
        <span className="text-gray-600">W<span className="text-green-500">{wr}%</span></span>
        <span className="text-gray-600">L<span className="text-red-400">{lr}%</span></span>
        <span className="text-gray-600">P<span className="text-yellow-500">{pr}%</span></span>
      </div>
      {/* Divider */}
      <div className="border-t border-gray-800 mb-0.5" />
      {/* 2nd AI */}
      <div className="grid grid-cols-4 text-center gap-0.5 mb-0.5">
        <div><div className="text-[6px] text-purple-600">WIN</div><div className="text-[8px] font-black text-green-400">{secondAIPerf.wins}</div></div>
        <div><div className="text-[6px] text-purple-600">LOSS</div><div className="text-[8px] font-black text-red-400">{secondAIPerf.losses}</div></div>
        <div><div className="text-[6px] text-purple-600">PSH</div><div className="text-[8px] font-black text-yellow-400">{secondAIPerf.pushes}</div></div>
        <div><div className="text-[6px] text-purple-600">ACC</div><div className={`text-[8px] font-black ${secondAIPerf.accuracy >= 50 ? 'text-green-400' : 'text-red-400'}`}>{secondAIPerf.accuracy}%</div></div>
      </div>
      <div className="flex gap-1.5 text-[7px]">
        <span className="text-gray-600">ROI <span className={`font-bold ${secondAIPerf.roi >= 0 ? 'text-green-500' : 'text-red-400'}`}>{secondAIPerf.roi > 0 ? '+' : ''}{secondAIPerf.roi}%</span></span>
        <span className={`font-bold ${secondAIPerf.flatBetPL >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>₱{secondAIPerf.flatBetPL >= 0 ? '' : '-'}{Math.abs(secondAIPerf.flatBetPL).toLocaleString()}</span>
      </div>
    </div>
  );
}
