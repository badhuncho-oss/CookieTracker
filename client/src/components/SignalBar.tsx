import { useBaccaratContext } from "@/context/BaccaratContext";
export default function SignalBar() {
  const { signalData, shoePhase, memoryWindows, varianceZone, signalAgreement, backtesting } = useBaccaratContext();
  const vzCol = varianceZone === 'CHAOTIC' ? 'text-red-500' : varianceZone === 'HIGH SWING' ? 'text-orange-400' : varianceZone === 'NORMAL' ? 'text-yellow-500' : 'text-green-500';
  const phaseCol = shoePhase === 'LATE' ? 'text-orange-400' : shoePhase === 'MID' ? 'text-yellow-500' : 'text-green-500';
  const memCol = memoryWindows.shortVsMid === 'CONFLICT' ? 'text-red-400' : 'text-gray-500';
  const agreeCol = signalAgreement.agreementPct >= 75 ? 'text-green-400' : signalAgreement.agreementPct >= 50 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-gray-950 border-t border-b border-gray-800 text-[6px] flex-wrap">
      <span className="text-yellow-400 font-bold">{signalData.level}</span>
      <span className="text-gray-400">{signalData.patternLabel}</span>
      <span className="text-white font-bold">{signalData.confidence}%</span>
      <span className="text-cyan-400 font-bold">{signalData.recommendation}</span>
      {signalData.hasExtremeTieRatio && <span className="bg-red-900 text-red-300 px-0.5 rounded">TIE⚠</span>}
      <span className="text-gray-700">|</span>
      <span className={`font-bold ${phaseCol}`}>{shoePhase}</span>
      <span className="text-gray-700">|</span>
      <span className={vzCol}>{varianceZone}</span>
      <span className="text-gray-700">|</span>
      <span className="text-gray-600">MEM S<span className={memoryWindows.shortTrend === 'B' ? 'text-red-400 font-bold' : memoryWindows.shortTrend === 'P' ? 'text-cyan-400 font-bold' : 'text-gray-600'}>{memoryWindows.shortTrend}</span> M<span className={memoryWindows.midTrend === 'B' ? 'text-red-400 font-bold' : memoryWindows.midTrend === 'P' ? 'text-cyan-400 font-bold' : 'text-gray-600'}>{memoryWindows.midTrend}</span> L<span className={memoryWindows.longTrend === 'B' ? 'text-red-400 font-bold' : memoryWindows.longTrend === 'P' ? 'text-cyan-400 font-bold' : 'text-gray-600'}>{memoryWindows.longTrend}</span></span>
      {memoryWindows.shortVsMid === 'CONFLICT' && <span className={`font-bold ${memCol}`}>CONFLICT</span>}
      <span className="text-gray-700">|</span>
      <span className={`font-bold ${agreeCol}`}>AGR{signalAgreement.agreementPct}%</span>
      <span className="text-gray-700">|</span>
      <span className={`font-bold ${backtesting.accuracy >= 50 ? 'text-green-400' : 'text-red-400'}`}>BT{backtesting.accuracy}%</span>
    </div>
  );
}
