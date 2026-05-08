import { useBaccaratContext } from "@/context/BaccaratContext";
export default function EnterPlaysPanel() {
  const { recordOutcome, undoLastOutcome, gameResults } = useBaccaratContext();
  return (
    <div className="flex flex-col h-full">
      <div className="px-1.5 py-0.5 border-b border-gray-800">
        <span className="text-[7px] text-gray-500 font-bold uppercase">Enter Plays</span>
      </div>
      <div className="flex flex-col gap-1 p-1.5 flex-1">
        <button onClick={() => recordOutcome('banker')} className="w-full py-2 bg-red-800 hover:bg-red-700 active:bg-red-900 text-white font-black text-[9px] uppercase tracking-widest rounded border border-red-700 transition-colors">BANKER</button>
        <button onClick={() => recordOutcome('player')} className="w-full py-2 bg-cyan-800 hover:bg-cyan-700 active:bg-cyan-900 text-white font-black text-[9px] uppercase tracking-widest rounded border border-cyan-700 transition-colors">PLAYER</button>
        <button onClick={() => recordOutcome('tie')} className="w-full py-2 bg-yellow-700 hover:bg-yellow-600 active:bg-yellow-800 text-white font-black text-[9px] uppercase tracking-widest rounded border border-yellow-600 transition-colors">TIE</button>
        <button onClick={() => undoLastOutcome()}
          disabled={gameResults.length === 0}
          className="w-full py-1 bg-gray-900 hover:bg-gray-800 disabled:opacity-20 text-gray-500 text-[7px] uppercase rounded border border-gray-800 transition-colors">↩ UNDO</button>
      </div>
    </div>
  );
}
