import { useBaccaratContext } from "@/context/BaccaratContext";

export default function ShoeHistoryPanel() {
  const { gameResults } = useBaccaratContext();

  const getColor = (r: string) => {
    if (r === 'banker') return { bg: 'bg-red-950', border: 'border-red-600', text: 'text-red-400' };
    if (r === 'player') return { bg: 'bg-cyan-950', border: 'border-cyan-600', text: 'text-cyan-400' };
    if (r === 'tie') return { bg: 'bg-yellow-950', border: 'border-yellow-500', text: 'text-yellow-400' };
    return { bg: 'bg-gray-900', border: 'border-gray-700', text: 'text-gray-500' };
  };

  const getLabel = (r: string) => {
    if (r === 'banker') return 'B';
    if (r === 'player') return 'P';
    if (r === 'tie') return 'T';
    return '?';
  };

  return (
    <div className="bg-black border border-gray-800 h-full flex flex-col">
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-800">
        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Shoe History</span>
        <span className="text-[8px] text-gray-600">{gameResults.length} PLAYS</span>
      </div>
      <div className="p-1.5 flex-1 overflow-auto">
        {gameResults.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[9px] text-gray-700">
            No plays recorded yet
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {gameResults.map((r, i) => {
              const c = getColor(r);
              return (
                <div
                  key={i}
                  className={`w-7 h-7 aspect-square flex items-center justify-center rounded border ${c.bg} ${c.border} ${c.text} text-[10px] font-black flex-shrink-0`}
                  title={`${i + 1}: ${r}`}
                >
                  {getLabel(r)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
