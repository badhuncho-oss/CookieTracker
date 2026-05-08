import { useBaccaratContext } from "@/context/BaccaratContext";
import type { RegimeStatus } from "@/utils/analytics";

const statusColors: Record<RegimeStatus, string> = {
  'STABLE': 'bg-green-900 border-green-600 text-green-300',
  'ANOMALY': 'bg-yellow-900 border-yellow-600 text-yellow-300',
  'BROKEN': 'bg-red-900 border-red-600 text-red-300',
  'TRANSITION WATCH': 'bg-orange-900 border-orange-500 text-orange-300',
  'PATTERN CONFIRMED': 'bg-cyan-900 border-cyan-500 text-cyan-300',
  'LOW DATA': 'bg-gray-800 border-gray-600 text-gray-400',
};

const betPermColors = {
  'BET ALLOWED': 'text-green-400',
  'NO BET: TRANSITION UNCONFIRMED': 'text-red-400',
  'NO BET: LOW DATA': 'text-gray-500',
};

const levelColors: Record<string, string> = {
  'N1': 'text-cyan-400',
  'N2': 'text-blue-400',
  'N3': 'text-purple-400',
  'N4+': 'text-pink-400',
  'UNKNOWN': 'text-gray-600',
};

export default function DominantPatternPanel() {
  const { dominantPattern } = useBaccaratContext();
  const dp = dominantPattern;
  const statusCls = statusColors[dp.regimeStatus] || statusColors['LOW DATA'];

  return (
    <div className="bg-black border border-gray-800">
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-800">
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-purple-400">◆</span>
          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Dominant Pattern</span>
        </div>
        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${statusCls}`}>
          {dp.regimeStatus}
        </span>
      </div>

      <div className="p-2 space-y-2">
        {/* Main grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div>
            <div className="text-[8px] text-gray-600 uppercase">Initial Pattern</div>
            <div className={`text-sm font-black ${levelColors[dp.initialPattern] || 'text-gray-400'}`}>{dp.initialPattern}</div>
          </div>
          <div>
            <div className="text-[8px] text-gray-600 uppercase">Initial Range</div>
            <div className="text-[9px] text-gray-400">{dp.initialPatternRange}</div>
          </div>
          <div>
            <div className="text-[8px] text-gray-600 uppercase">Current Dominant</div>
            <div className={`text-sm font-black ${levelColors[dp.currentPattern] || 'text-gray-400'}`}>{dp.currentPattern}</div>
          </div>
          <div>
            <div className="text-[8px] text-gray-600 uppercase">Candidate</div>
            <div className={`text-sm font-black ${dp.candidatePattern ? (levelColors[dp.candidatePattern] || 'text-gray-400') : 'text-gray-700'}`}>
              {dp.candidatePattern || '—'}
            </div>
          </div>
          <div>
            <div className="text-[8px] text-gray-600 uppercase">Break Hand #</div>
            <div className="text-[9px] text-gray-400">{dp.breakHandNumber > 0 ? `#${dp.breakHandNumber}` : '—'}</div>
          </div>
          <div>
            <div className="text-[8px] text-gray-600 uppercase">Break Type</div>
            <div className="text-[9px] text-red-400">{dp.breakType || '—'}</div>
          </div>
          <div>
            <div className="text-[8px] text-gray-600 uppercase">Transition Path</div>
            <div className="text-[9px] text-yellow-400">{dp.validTransitionPath}</div>
          </div>
          <div>
            <div className="text-[8px] text-gray-600 uppercase">Confirmation</div>
            <div className="text-[9px] text-white font-bold">{dp.confirmationCount}/{dp.confirmationNeeded}</div>
          </div>
        </div>

        {/* Last 10 core reads */}
        <div>
          <div className="text-[8px] text-gray-600 uppercase mb-1">Last 10 Core Pattern Reads</div>
          <div className="flex gap-1 flex-wrap">
            {dp.last10CoreReads.length === 0
              ? <span className="text-[8px] text-gray-700">—</span>
              : dp.last10CoreReads.map((r, i) => (
                <span key={i} className={`text-[9px] font-bold px-1 py-0.5 rounded border border-gray-800 bg-gray-900 ${levelColors[r] || 'text-gray-500'}`}>
                  {r}
                </span>
              ))
            }
          </div>
        </div>

        {/* Bet permission */}
        <div className="border-t border-gray-800 pt-1 flex items-center justify-between">
          <span className="text-[8px] text-gray-600 uppercase">Bet Permission</span>
          <span className={`text-[9px] font-black uppercase ${betPermColors[dp.betPermission]}`}>
            {dp.betPermission}
          </span>
        </div>
      </div>
    </div>
  );
}
