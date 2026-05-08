import { useBaccaratContext } from "@/context/BaccaratContext";
export default function Header() {
  const { backtesting, resetGame, statistics } = useBaccaratContext();
  return (
    <div className="flex items-center justify-between px-1.5 py-0.5 border-b border-gray-800 bg-black">
      <div className="flex items-center gap-1">
        <span className="text-[8px] font-bold text-gray-300 tracking-widest">AI ANALYSIS</span>
        <span className="bg-pink-600 text-white text-[7px] font-bold px-1 rounded">AI</span>
        <span className="bg-gray-700 text-gray-300 text-[7px] px-1 rounded">BT</span>
        <span className={`text-[7px] font-bold px-1 rounded ${backtesting.strength === 'STRONG' ? 'bg-green-800 text-green-200' : backtesting.strength === 'NEUTRAL' ? 'bg-yellow-800 text-yellow-200' : 'bg-red-900 text-red-300'}`}>{backtesting.strength}</span>
        <span className="text-[7px] text-gray-600 ml-1">#{statistics.totalPlays}</span>
      </div>
      <button onClick={resetGame} className="text-[7px] text-gray-700 hover:text-red-400 px-1">↺</button>
    </div>
  );
}
