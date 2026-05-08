import { useBaccaratContext } from "@/context/BaccaratContext";

export default function SignalBar() {
  const { signalData, tieAnalysis } = useBaccaratContext();

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-gray-950 border-t border-b border-gray-800 text-[9px] flex-wrap">
      <span className="text-gray-500">SIGNAL</span>
      <span className="text-yellow-400 font-bold">{signalData.level}</span>
      <span className="text-gray-400">{signalData.patternLabel}</span>
      <span className="text-white font-bold">{signalData.confidence}%</span>
      <span className="text-gray-600 mx-1">|</span>
      <span className="text-gray-500">PATTERN</span>
      <span className="text-gray-300">{signalData.patternSequence}</span>
      <span className="text-cyan-400 font-bold">{signalData.recommendation}</span>
      <span className="text-gray-500">({signalData.samples} samples)</span>
      {signalData.hasExtremeTieRatio && (
        <span className="bg-red-900 border border-red-600 text-red-300 px-1.5 py-0.5 rounded text-[8px] font-bold">
          ⚠ Extreme Tie Ratio
        </span>
      )}
      <span className="text-gray-600 mx-1">|</span>
      <span className="text-gray-500">BT</span>
      <span className={`font-bold ${signalData.btAccuracy >= 50 ? 'text-green-400' : 'text-red-400'}`}>
        {signalData.btAccuracy}%
      </span>
      <span className={`font-bold ${signalData.btUnits >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        / {signalData.btUnits > 0 ? '+' : ''}{signalData.btUnits}u
      </span>
    </div>
  );
}
