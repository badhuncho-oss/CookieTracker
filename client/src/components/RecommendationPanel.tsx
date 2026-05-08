import { useBaccaratContext } from "@/context/BaccaratContext";

export default function RecommendationPanel() {
  const { recommendation, secondaryRecommendation, winStreak, lossStreak, signalData, dominantPattern } = useBaccaratContext();

  const recColor =
    recommendation.type === 'banker' ? 'text-red-400' :
    recommendation.type === 'player' ? 'text-cyan-400' :
    recommendation.type === 'tie' ? 'text-yellow-400' : 'text-gray-300';

  const regimeNote =
    dominantPattern.regimeStatus === 'TRANSITION WATCH' ? '⚠ Transition Watch — NO BET forced' :
    dominantPattern.regimeStatus === 'LOW DATA' ? '⏳ Low data mode' :
    dominantPattern.regimeStatus === 'ANOMALY' ? '⚡ Anomaly detected — confidence reduced' :
    dominantPattern.regimeStatus === 'BROKEN' ? '✗ Pattern broken' :
    dominantPattern.regimeStatus === 'PATTERN CONFIRMED' ? '✓ Pattern confirmed' : '';

  const regimeNoteColor =
    dominantPattern.regimeStatus === 'TRANSITION WATCH' ? 'text-orange-400' :
    dominantPattern.regimeStatus === 'LOW DATA' ? 'text-gray-600' :
    dominantPattern.regimeStatus === 'ANOMALY' ? 'text-yellow-500' :
    dominantPattern.regimeStatus === 'BROKEN' ? 'text-red-500' :
    dominantPattern.regimeStatus === 'PATTERN CONFIRMED' ? 'text-cyan-400' : 'text-green-600';

  return (
    <div className="bg-black border border-gray-800 p-2 h-full">
      <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">Recommendation</div>
      <div className={`text-2xl font-black tracking-tight mb-1 ${recColor}`}>
        {recommendation.text || 'NO BET'}
      </div>
      <div className="text-[9px] text-gray-500 mb-1">
        - Confidence {recommendation.confidence < 57 ? 'below' : 'above'} 57%
      </div>

      <div className="space-y-1 mb-1">
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-gray-500 w-8">→ {recommendation.text || 'NO BET'}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-gray-400 w-6">CONF</span>
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gray-500 rounded-full" style={{ width: `${recommendation.confidence}%` }} />
          </div>
          <span className="text-[9px] text-gray-400 w-6 text-right">{recommendation.confidence}%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-yellow-500 w-6">CONS</span>
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${signalData.confidence}%` }} />
          </div>
          <span className="text-[9px] text-yellow-400 font-bold w-6 text-right">{signalData.confidence}%</span>
        </div>
      </div>

      {secondaryRecommendation && (
        <div className="border border-gray-800 rounded px-1 py-0.5 mb-1">
          <div className="text-[9px] text-yellow-500">⚠ High tie disturbance</div>
        </div>
      )}

      {regimeNote && (
        <div className={`text-[9px] leading-tight mb-1 ${regimeNoteColor}`}>{regimeNote}</div>
      )}

      <div className="text-[9px] text-green-700 leading-tight">
        {signalData.recommendation && signalData.recommendation !== 'NO BET'
          ? `Core shows trend for ${signalData.recommendation} — ${dominantPattern.currentPattern} regime ${dominantPattern.regimeStatus.toLowerCase()}`
          : 'Enter plays to begin analysis'}
      </div>
    </div>
  );
}
