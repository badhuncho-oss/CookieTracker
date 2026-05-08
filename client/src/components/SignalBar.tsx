import { useBaccaratContext } from "@/context/BaccaratContext";
export default function SignalBar() {
  const { signalData, tieAnalysis } = useBaccaratContext();
  return (
    <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-gray-950 border-t border-b border-gray-800 text-[7px] flex-wrap">
      <span className="text-gray-600">SIG</span>
      <span className="text-yellow-400 font-bold">{signalData.level}</span>
      <span className="text-gray-400 font-mono">{signalData.patternLabel}</span>
      <span className="text-white font-bold">{signalData.confidence}%</span>
      <span className="text-gray-700">|</span>
      <span className="text-gray-400">{signalData.patternSequence}</span>
      <span className="text-cyan-400 font-bold">{signalData.recommendation}</span>
      {signalData.hasExtremeTieRatio && <span className="bg-red-900 text-red-300 px-1 rounded">⚠TIE</span>}
      <span className="text-gray-700">|</span>
      <span className={`font-bold ${signalData.btAccuracy >= 50 ? 'text-green-400' : 'text-red-400'}`}>BT{signalData.btAccuracy}%</span>
    </div>
  );
}
