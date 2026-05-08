import { useBaccaratContext } from "@/context/BaccaratContext";
import type { RegimeStatus } from "@/utils/analytics";
const sCls: Record<RegimeStatus, string> = {
  'STABLE': 'text-green-400', 'ANOMALY': 'text-yellow-400', 'BROKEN': 'text-red-400',
  'TRANSITION WATCH': 'text-orange-400', 'PATTERN CONFIRMED': 'text-cyan-400', 'LOW DATA': 'text-gray-500',
};
const lvlCls: Record<string, string> = {
  'N1': 'text-cyan-400', 'N2': 'text-blue-400', 'N3': 'text-purple-400', 'N4+': 'text-pink-400', 'UNKNOWN': 'text-gray-600'
};
const tpCls: Record<string, string> = { 'LOW': 'text-green-500', 'BUILDING': 'text-yellow-500', 'HIGH': 'text-orange-400', 'CRITICAL': 'text-red-500' };
export default function DominantPatternPanel() {
  const { dominantPattern: dp, stabilityScore, transitionPressure, anomalyCluster } = useBaccaratContext();
  const stabCol = stabilityScore >= 80 ? 'text-green-400' : stabilityScore >= 60 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="px-1.5 py-0.5 border-b border-gray-800">
      {/* Row 1: status + stability + pressure */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[7px] text-purple-400 font-bold">DOM.PAT</span>
        <span className={`text-[7px] font-bold ${sCls[dp.regimeStatus]}`}>{dp.regimeStatus}</span>
        <span className="text-gray-700">|</span>
        <span className="text-[6px] text-gray-600">STAB</span>
        <span className={`text-[7px] font-black ${stabCol}`}>{stabilityScore}</span>
        <span className="text-gray-700">|</span>
        <span className="text-[6px] text-gray-600">PRESS</span>
        <span className={`text-[7px] font-bold ${tpCls[transitionPressure]}`}>{transitionPressure}</span>
        <span className="text-gray-700">|</span>
        <span className="text-[6px] text-gray-600">ANOM</span>
        <span className={`text-[7px] font-bold ${anomalyCluster.pressure === 'CRITICAL' ? 'text-red-500' : anomalyCluster.pressure === 'HIGH' ? 'text-orange-400' : anomalyCluster.pressure === 'BUILDING' ? 'text-yellow-500' : 'text-gray-600'}`}>{anomalyCluster.clusterCount}</span>
        {anomalyCluster.warning && <span className="text-[6px] text-red-600 italic">{anomalyCluster.warning}</span>}
      </div>
      {/* Row 2: pattern path + bet permission */}
      <div className="flex items-center gap-1 flex-wrap mt-0.5">
        <span className="text-[6px] text-gray-600">INIT</span>
        <span className={`text-[7px] font-black ${lvlCls[dp.initialPattern]}`}>{dp.initialPattern}</span>
        <span className="text-gray-700">→</span>
        <span className="text-[6px] text-gray-600">NOW</span>
        <span className={`text-[7px] font-black ${lvlCls[dp.currentPattern]}`}>{dp.currentPattern}</span>
        {dp.candidatePattern && <>
          <span className="text-gray-700">→</span>
          <span className="text-[6px] text-gray-600">CAND</span>
          <span className={`text-[7px] font-black ${lvlCls[dp.candidatePattern]}`}>{dp.candidatePattern}</span>
          <span className="text-[6px] text-gray-600">({dp.confirmationCount}/{dp.confirmationNeeded})</span>
        </>}
        {dp.breakHandNumber > 0 && <span className="text-[6px] text-red-600">BRK#{dp.breakHandNumber}</span>}
        <span className="text-gray-700 ml-auto">|</span>
        <span className={`text-[7px] font-bold ${dp.betPermission === 'BET ALLOWED' ? 'text-green-400' : 'text-red-400'}`}>
          {dp.betPermission === 'BET ALLOWED' ? '✓BET' : '✗NO BET'}
        </span>
      </div>
      {/* Row 3: last 10 reads */}
      <div className="flex gap-0.5 mt-0.5 items-center flex-wrap">
        <span className="text-[6px] text-gray-700">reads:</span>
        {dp.last10CoreReads.map((r, i) => (
          <span key={i} className={`text-[7px] font-bold ${lvlCls[r] || 'text-gray-600'}`}>{r}</span>
        ))}
        {dp.last10CoreReads.length === 0 && <span className="text-[6px] text-gray-700">—</span>}
      </div>
    </div>
  );
}
