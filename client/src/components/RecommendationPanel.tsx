import { useBaccaratContext } from "@/context/BaccaratContext";
export default function RecommendationPanel() {
  const { recommendation, signalData, dominantPattern, secondRec, noBetType, betQualityGrade, edgeEstimate, ev, recalibration, confidenceBreakdown, flatBetAmount } = useBaccaratContext();
  const col = recommendation.type === 'banker' ? 'text-red-400' : recommendation.type === 'player' ? 'text-cyan-400' : 'text-gray-400';
  const s2Col = secondRec.type === 'BANKER' ? 'text-red-400' : 'text-cyan-400';
  const gradeCol = betQualityGrade === 'A+' || betQualityGrade === 'A' ? 'text-green-400' : betQualityGrade === 'B' ? 'text-yellow-400' : betQualityGrade === 'C' || betQualityGrade === 'D' ? 'text-red-400' : 'text-gray-600';
  const noBetLabel = noBetType ? `NO BET: ${noBetType}` : '';
  return (
    <div className="px-1.5 py-1">
      {/* Main rec */}
      <div className="flex items-baseline gap-1.5 mb-0.5">
        <div className={`text-sm font-black leading-none ${col}`}>{recommendation.text || 'NO BET'}</div>
        {recommendation.type && betQualityGrade !== '—' && <span className={`text-[8px] font-black ${gradeCol}`}>[{betQualityGrade}]</span>}
      </div>
      {/* Smart NO BET reason */}
      {!recommendation.type && noBetLabel && <div className="text-[6px] text-orange-500 mb-0.5">{noBetLabel}</div>}
      {/* Confidence breakdown */}
      <div className="flex items-center gap-1 mb-0.5">
        <div className="text-[6px] text-gray-600 w-6">CONF</div>
        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gray-500 rounded-full" style={{ width: `${recommendation.confidence}%` }} />
        </div>
        <div className="text-[7px] text-gray-400 w-5 text-right">{recommendation.confidence}%</div>
      </div>
      <div className="flex items-center gap-1 mb-0.5">
        <div className="text-[6px] text-yellow-700 w-6">CONS</div>
        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-700 rounded-full" style={{ width: `${signalData.confidence}%` }} />
        </div>
        <div className="text-[7px] text-yellow-600 w-5 text-right">{signalData.confidence}%</div>
      </div>
      {/* Conf breakdown tiny */}
      <div className="flex gap-1 text-[6px] text-gray-700 mb-0.5">
        <span>B{confidenceBreakdown.base}</span>
        <span className={confidenceBreakdown.ncore >= 0 ? 'text-green-800' : 'text-red-800'}>N{confidenceBreakdown.ncore >= 0 ? '+' : ''}{confidenceBreakdown.ncore}</span>
        <span className={confidenceBreakdown.markov >= 0 ? 'text-green-800' : 'text-red-800'}>M{confidenceBreakdown.markov >= 0 ? '+' : ''}{confidenceBreakdown.markov}</span>
        <span className={confidenceBreakdown.volatility >= 0 ? 'text-green-800' : 'text-red-800'}>V{confidenceBreakdown.volatility >= 0 ? '+' : ''}{confidenceBreakdown.volatility}</span>
        <span className={confidenceBreakdown.regime >= 0 ? 'text-green-800' : 'text-red-800'}>R{confidenceBreakdown.regime >= 0 ? '+' : ''}{confidenceBreakdown.regime}</span>
        <span className="text-gray-500">={confidenceBreakdown.final}%</span>
      </div>
      {/* Edge + EV */}
      {recommendation.type && (
        <div className="flex gap-2 text-[6px] mb-0.5">
          <span className="text-gray-600">EDGE <span className={`font-bold ${edgeEstimate > 0 ? 'text-green-500' : 'text-red-500'}`}>{edgeEstimate > 0 ? '+' : ''}{edgeEstimate}%</span></span>
          <span className="text-gray-600">EV <span className={`font-bold ${ev >= 0 ? 'text-green-400' : 'text-red-400'}`}>{ev >= 0 ? '+' : ''}₱{ev}</span></span>
        </div>
      )}
      {/* Recalibration warning */}
      {recalibration.active && <div className="text-[6px] text-orange-500 mb-0.5">⚠ RECAL: {recalibration.reason}</div>}
      {/* 2nd Rec divider */}
      <div className="border-t border-gray-800 pt-0.5 mt-0.5">
        <div className="flex items-center gap-1">
          <span className="text-[6px] text-purple-500">2ND</span>
          <span className={`text-[8px] font-black ${s2Col}`}>{secondRec.type}</span>
          <span className="text-[6px] text-gray-600">{secondRec.confidence}%</span>
          <span className="text-[6px] text-gray-700">(always bets)</span>
        </div>
      </div>
    </div>
  );
}
