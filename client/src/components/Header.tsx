import { useBaccaratContext } from "@/context/BaccaratContext";

export default function Header() {
  const { backtesting, resetGame } = useBaccaratContext();
  return (
    <div className="flex items-center justify-between px-2 py-1 border-b border-gray-800 bg-black">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">AI Analysis</span>
        <span className="bg-pink-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">AI</span>
        <span className="bg-gray-700 text-gray-300 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">Backtesting</span>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${backtesting.strength === 'STRONG' ? 'bg-green-700 text-green-200' : backtesting.strength === 'MODERATE' ? 'bg-yellow-700 text-yellow-200' : 'bg-red-900 text-red-300'}`}>
          {backtesting.strength}
        </span>
      </div>
      <button
        onClick={resetGame}
        className="text-[9px] text-gray-500 hover:text-red-400 px-1 py-0.5 transition-colors"
      >
        RESET
      </button>
    </div>
  );
}
