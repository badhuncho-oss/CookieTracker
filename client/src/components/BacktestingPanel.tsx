import { useBaccaratContext } from "@/context/BaccaratContext";
import { useState } from "react";
export default function BacktestingPanel() {
  const { backtesting: bt, flatBetAmount, setFlatBetAmount } = useBaccaratContext();
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(String(flatBetAmount));
  const save = () => { const v = parseInt(editVal); if (!isNaN(v) && v > 0) setFlatBetAmount(v); setEditing(false); };
  const plCol = bt.flatBetPL >= 0 ? 'text-cyan-400' : 'text-red-400';
  const sc = bt.strength === 'STRONG' ? 'bg-green-800 text-green-200' : bt.strength === 'NEUTRAL' ? 'bg-yellow-800 text-yellow-200' : 'bg-red-900 text-red-300';
  return (
    <div>
      <div className="flex items-center justify-between px-1.5 py-0.5 border-b border-gray-800">
        <div className="flex items-center gap-1">
          <span className="text-[7px] text-gray-400 font-bold uppercase">Backtesting</span>
          <span className={`text-[7px] font-bold px-1 rounded ${sc}`}>{bt.strength}</span>
        </div>
        <div className="flex items-center gap-0.5 text-[7px]">
          <span className="text-gray-600">₱</span>
          {editing
            ? <input autoFocus className="w-10 bg-gray-800 border border-gray-600 text-white text-[7px] px-0.5 rounded" value={editVal}
                onChange={e => setEditVal(e.target.value.replace(/\D/g,''))} onBlur={save} onKeyDown={e => e.key==='Enter' && save()} />
            : <button onClick={() => { setEditVal(String(flatBetAmount)); setEditing(true); }} className="text-white font-bold hover:text-yellow-400">{flatBetAmount}</button>
          }
        </div>
      </div>
      <div className="px-1.5 py-0.5">
        {/* Row 1: key counters */}
        <div className="grid grid-cols-6 text-center gap-0.5 mb-0.5">
          {[['EVAL',bt.evaluated,'text-gray-500'],['BETS',bt.bets,'text-white'],['WIN',bt.wins,'text-green-400'],['LOSS',bt.losses,'text-red-400'],['PUSH',bt.pushes,'text-yellow-400'],['SKIP',bt.skipped,'text-gray-600']].map(([l,v,c])=>(
            <div key={String(l)}><div className="text-[6px] text-gray-700">{l}</div><div className={`text-[9px] font-black ${c}`}>{v}</div></div>
          ))}
        </div>
        {/* Row 2: stats */}
        <div className="flex items-center gap-2 flex-wrap text-[7px] mb-0.5">
          <span className="text-gray-600">ACC <span className={`font-bold ${bt.accuracy >= 50 ? 'text-green-400' : 'text-red-400'}`}>{bt.accuracy}%</span></span>
          <span className="text-gray-600">ROI <span className={`font-bold ${bt.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>{bt.roi > 0 ? '+' : ''}{bt.roi}%</span></span>
          <span className="text-gray-600">DD <span className="text-red-400 font-bold">{bt.maxDD > 0 ? `-${bt.maxDD}u` : '0'}</span></span>
          <span className={`font-bold ${plCol}`}>P/L: ₱{bt.flatBetPL >= 0 ? '' : '-'}{Math.abs(bt.flatBetPL).toLocaleString()}</span>
        </div>
        {/* Row 3: streaks */}
        <div className="flex items-center gap-2 text-[7px]">
          <span className="text-gray-600">W↑<span className="text-green-400 font-bold">{bt.longestWin}</span></span>
          <span className="text-gray-600">L↓<span className="text-red-400 font-bold">{bt.longestLoss}</span></span>
          <span className="text-gray-600">WC<span className="text-green-400 font-bold">{bt.avgWinConf}%</span></span>
          <span className="text-gray-600">LC<span className="text-red-400 font-bold">{bt.avgLossConf}%</span></span>
          <span className="text-gray-600">NOW <span className="text-yellow-400 font-bold">{bt.now}</span></span>
          <span className="text-gray-700">{bt.betBreakdown}</span>
        </div>
      </div>
    </div>
  );
}
