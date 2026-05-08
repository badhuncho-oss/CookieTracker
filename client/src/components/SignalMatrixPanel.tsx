import { useBaccaratContext } from "@/context/BaccaratContext";
const vCol = (v: string) => v === 'B' ? 'text-red-400 font-bold' : v === 'P' ? 'text-cyan-400 font-bold' : v === 'OK' ? 'text-green-400' : v === 'NO' ? 'text-red-500' : 'text-gray-600';
const WEIGHTS = [
  { key: 'ncore', label: 'NCORE', w: 35 },
  { key: 'markov', label: 'MARKOV', w: 30 },
  { key: 'texture', label: 'TEXTURE', w: 15 },
  { key: 'variance', label: 'VARIANCE', w: 10 },
];
export default function SignalMatrixPanel() {
  const { signalAgreement: sa, dominantSidePressure: dp, tieDistortionIndex, sampleQuality, betQualityGrade, recommendation } = useBaccaratContext();
  const gradeCol = betQualityGrade === 'A+' || betQualityGrade === 'A' ? 'text-green-400' : betQualityGrade === 'B' ? 'text-yellow-400' : betQualityGrade === 'C' || betQualityGrade === 'D' ? 'text-red-400' : 'text-gray-600';
  const sqCol = sampleQuality === 'STRONG' ? 'text-green-400' : sampleQuality === 'GOOD' ? 'text-yellow-400' : sampleQuality === 'FAIR' ? 'text-orange-400' : 'text-red-500';
  const tdiCol = tieDistortionIndex === 'HIGH' ? 'text-red-500' : tieDistortionIndex === 'MODERATE' ? 'text-orange-400' : 'text-green-500';
  const dsCol = dp.dominantSide === 'BANKER' ? 'text-red-400' : dp.dominantSide === 'PLAYER' ? 'text-cyan-400' : 'text-gray-500';
  return (
    <div className="border-b border-gray-800">
      <div className="grid grid-cols-2 divide-x divide-gray-800">
        {/* Left: Signal Agreement Matrix */}
        <div className="px-1.5 py-0.5">
          <div className="text-[6px] text-gray-600 uppercase mb-0.5 font-bold">Signal Matrix</div>
          <div className="grid grid-cols-5 text-center gap-0.5">
            {[
              { label: 'NCORE', val: sa.ncore },
              { label: 'MARKOV', val: sa.markov },
              { label: 'TEXTURE', val: sa.texture },
              { label: 'VARIANCE', val: sa.variance },
              { label: 'REGIME', val: sa.regime },
            ].map(({ label, val }) => (
              <div key={label}>
                <div className="text-[5px] text-gray-700">{label}</div>
                <div className={`text-[8px] font-black ${vCol(val)}`}>{val}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-0.5 text-[6px]">
            <span className="text-gray-600">AGR <span className={sa.agreementPct >= 75 ? 'text-green-400 font-bold' : sa.agreementPct >= 50 ? 'text-yellow-400 font-bold' : 'text-red-400 font-bold'}>{sa.agreementPct}%</span></span>
            <span className="text-gray-600">VOTE <span className={sa.dominantVote === 'B' ? 'text-red-400 font-bold' : sa.dominantVote === 'P' ? 'text-cyan-400 font-bold' : 'text-gray-500'}>{sa.dominantVote}</span></span>
          </div>
        </div>
        {/* Right: Weights + Quality + Pressure */}
        <div className="px-1.5 py-0.5">
          <div className="text-[6px] text-gray-600 uppercase mb-0.5 font-bold">Weights / Quality</div>
          <div className="space-y-0.5 mb-0.5">
            {WEIGHTS.map(({ key, label, w }) => (
              <div key={key} className="flex items-center gap-1">
                <span className="text-[5px] text-gray-700 w-8">{label}</span>
                <div className="flex-1 h-0.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-500 rounded-full" style={{ width: `${w}%` }} />
                </div>
                <span className="text-[5px] text-gray-600 w-4 text-right">{w}%</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-0.5 text-[6px]">
            <div className="flex justify-between"><span className="text-gray-700">QUAL</span><span className={`font-bold ${sqCol}`}>{sampleQuality}</span></div>
            <div className="flex justify-between"><span className="text-gray-700">GRADE</span><span className={`font-bold ${gradeCol}`}>{betQualityGrade}</span></div>
            <div className="flex justify-between"><span className="text-gray-700">TIE-DI</span><span className={`font-bold ${tdiCol}`}>{tieDistortionIndex}</span></div>
            <div className="flex justify-between"><span className="text-gray-700">DOM</span><span className={`font-bold ${dsCol}`}>{dp.dominantSide.slice(0,3)} {dp.momentum}</span></div>
            <div className="col-span-2 flex justify-between">
              <span className="text-gray-700">B-PRESS</span>
              <div className="flex-1 mx-1 h-0.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: `${dp.bankerPressure}%` }} />
              </div>
              <span className="text-red-400 font-bold">{dp.bankerPressure}%</span>
            </div>
            <div className="col-span-2 flex justify-between">
              <span className="text-gray-700">P-PRESS</span>
              <div className="flex-1 mx-1 h-0.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${dp.playerPressure}%` }} />
              </div>
              <span className="text-cyan-400 font-bold">{dp.playerPressure}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
