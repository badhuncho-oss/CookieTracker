import { useBaccaratContext } from "@/context/BaccaratContext";
import { useState } from "react";

export default function BacktestingPanel() {
  const { backtesting, flatBetAmount, setFlatBetAmount } = useBaccaratContext();
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(String(flatBetAmount));

  const plColor = backtesting.flatBetPL >= 0 ? 'text-cyan-400' : 'text-red-400';
  const roiColor = backtesting.roi >= 0 ? 'text-green-400' : 'text-red-400';
  const strengthColor = backtesting.strength === 'STRONG' ? 'bg-green-800 text-green-200' : backtesting.strength === 'NEUTRAL' ? 'bg-yellow-800 text-yellow-200' : 'bg-red-900 text-red-300';

  const handleFlatBetSave = () => {
    const v = parseInt(editVal);
    if (!isNaN(v) && v > 0) setFlatBetAmount(v);
    setEditing(false);
  };

  return (
    <div className="bg-black border border-gray-800">
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-green-500">◆</span>
          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Backtesting</span>
          <span className="text-[8px] text-gray-500">— THIS SHOE</span>
          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${strengthColor}`}>
            {backtesting.strength}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-gray-500">
          <span>FLAT BET ₱</span>
          {editing ? (
            <input
              autoFocus
              className="w-14 bg-gray-800 border border-gray-600 text-white text-[9px] px-1 rounded"
              value={editVal}
              onChange={e => setEditVal(e.target.value.replace(/\D/g, ''))}
              onBlur={handleFlatBetSave}
              onKeyDown={e => e.key === 'Enter' && handleFlatBetSave()}
            />
          ) : (
            <button onClick={() => { setEditVal(String(flatBetAmount)); setEditing(true); }}
              className="text-white font-bold hover:text-yellow-400 underline decoration-dotted">
              {flatBetAmount}
            </button>
          )}
        </div>
      </div>

      <div className="p-2 space-y-2">
        {/* Main counters */}
        <div className="grid grid-cols-6 gap-1 text-center">
          {[
            { label: 'EVALUATED', value: backtesting.evaluated, color: 'text-gray-400' },
            { label: 'BETS', value: backtesting.bets, color: 'text-white' },
            { label: 'WINS', value: backtesting.wins, color: 'text-green-400' },
            { label: 'LOSSES', value: backtesting.losses, color: 'text-red-400' },
            { label: 'PUSHES', value: backtesting.pushes, color: 'text-yellow-400' },
            { label: 'SKIPPED', value: backtesting.skipped, color: 'text-gray-600' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="text-[7px] text-gray-700 uppercase">{label}</div>
              <div className={`text-sm font-black ${color}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* ROI / accuracy */}
        <div className="grid grid-cols-3 gap-1 border-t border-gray-800 pt-1">
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-gray-500">ACCURACY</span>
            <span className={`text-[9px] font-bold ${backtesting.accuracy >= 50 ? 'text-green-400' : 'text-red-400'}`}>
              {backtesting.accuracy}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-gray-500">ROI</span>
            <span className={`text-[9px] font-bold ${roiColor}`}>{backtesting.roi > 0 ? '+' : ''}{backtesting.roi}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-gray-500">MAX DD</span>
            <span className="text-[9px] font-bold text-red-400">{backtesting.maxDD > 0 ? `-${backtesting.maxDD}u` : '0'}</span>
          </div>
        </div>

        {/* P/L box */}
        <div className="border border-gray-800 rounded px-2 py-1.5 flex items-center justify-between">
          <div>
            <div className="text-[8px] text-gray-500 mb-0.5">FLAT BET P/L ₱{flatBetAmount}</div>
            <div className={`text-xl font-black ${plColor}`}>
              ₱{backtesting.flatBetPL >= 0 ? '' : '-'}{Math.abs(backtesting.flatBetPL).toLocaleString()}
            </div>
            <div className="text-[8px] text-gray-600">
              {backtesting.bets} bets • {backtesting.betBreakdown} • {backtesting.skipped} skip
            </div>
          </div>
          <div className="text-right space-y-0.5">
            <div>
              <div className="text-[7px] text-gray-600">WIN RATE</div>
              <div className={`text-sm font-black ${backtesting.accuracy >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                {backtesting.accuracy}%
              </div>
            </div>
            <div>
              <div className="text-[7px] text-gray-600">PUSH RATE</div>
              <div className="text-[9px] text-yellow-400 font-bold">
                {backtesting.bets > 0 ? Math.round((backtesting.pushes / (backtesting.bets + backtesting.pushes)) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Streak stats */}
        <div className="grid grid-cols-5 gap-1 border-t border-gray-800 pt-1">
          {[
            { label: 'LONGEST WIN', value: backtesting.longestWin, color: 'text-green-400' },
            { label: 'LONGEST LOSS', value: backtesting.longestLoss, color: 'text-red-400' },
            { label: 'AVG WIN CONF', value: `${backtesting.avgWinConf}%`, color: 'text-green-400' },
            { label: 'AVG LOSS CONF', value: `${backtesting.avgLossConf}%`, color: 'text-red-400' },
            { label: 'NOW', value: backtesting.now, color: 'text-yellow-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <div className="text-[7px] text-gray-600 uppercase leading-tight">{label}</div>
              <div className={`text-sm font-black ${color}`}>{value || '—'}</div>
            </div>
          ))}
        </div>
        <div className="text-[8px] text-gray-700 italic">
          Accuracy = wins/(wins+losses). Pushes &amp; skips excluded.
        </div>
      </div>
    </div>
  );
}
