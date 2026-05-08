import { useBaccaratContext } from "@/context/BaccaratContext";
export default function RecommendationPanel() {
  const { recommendation, signalData, dominantPattern } = useBaccaratContext();
  const col = recommendation.type === 'banker' ? 'text-red-400' : recommendation.type === 'player' ? 'text-cyan-400' : recommendation.type === 'tie' ? 'text-yellow-400' : 'text-gray-400';
  const regCol = dominantPattern.regimeStatus === 'STABLE' ? 'text-green-500' : dominantPattern.regimeStatus === 'ANOMALY' ? 'text-yellow-500' : dominantPattern.regimeStatus === 'PATTERN CONFIRMED' ? 'text-cyan-400' : 'text-red-400';
  return (
    <div className="px-1.5 py-1">
      <div className="text-[7px] text-gray-600 uppercase">Recommendation</div>
      <div className={`text-base font-black leading-tight ${col}`}>{recommendation.text || 'NO BET'}</div>
      <div className="flex items-center gap-1 mt-0.5">
        <div className="text-[7px] text-gray-500 w-6">CONF</div>
        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gray-500 rounded-full" style={{ width: `${recommendation.confidence}%` }} />
        </div>
        <div className="text-[7px] text-gray-400 w-5 text-right">{recommendation.confidence}%</div>
      </div>
      <div className="flex items-center gap-1">
        <div className="text-[7px] text-yellow-600 w-6">CONS</div>
        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-600 rounded-full" style={{ width: `${signalData.confidence}%` }} />
        </div>
        <div className="text-[7px] text-yellow-500 font-bold w-5 text-right">{signalData.confidence}%</div>
      </div>
      <div className={`text-[7px] mt-0.5 ${regCol}`}>{dominantPattern.regimeStatus}</div>
    </div>
  );
}
