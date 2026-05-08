import { useBaccaratContext } from "@/context/BaccaratContext";
const cfg: Record<string, { bg: string; border: string; text: string; label: string }> = {
  banker: { bg: 'bg-red-950', border: 'border-red-700', text: 'text-red-400', label: 'B' },
  player: { bg: 'bg-cyan-950', border: 'border-cyan-700', text: 'text-cyan-400', label: 'P' },
  tie:    { bg: 'bg-yellow-950', border: 'border-yellow-600', text: 'text-yellow-400', label: 'T' },
};
export default function ShoeHistoryPanel() {
  const { gameResults } = useBaccaratContext();
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-1.5 py-0.5 border-b border-gray-800">
        <span className="text-[7px] text-gray-500 font-bold uppercase">Shoe History</span>
        <span className="text-[7px] text-gray-700">{gameResults.length} plays</span>
      </div>
      <div className="p-1 flex-1 overflow-auto">
        {gameResults.length === 0
          ? <div className="text-[7px] text-gray-700 text-center pt-2">—</div>
          : <div className="flex flex-wrap gap-0.5">
              {gameResults.map((r, i) => {
                const c = cfg[r] || { bg: 'bg-gray-900', border: 'border-gray-700', text: 'text-gray-500', label: '?' };
                return (
                  <div key={i} className={`w-5 h-5 flex items-center justify-center rounded border text-[7px] font-black flex-shrink-0 ${c.bg} ${c.border} ${c.text}`}>
                    {c.label}
                  </div>
                );
              })}
            </div>
        }
      </div>
    </div>
  );
}
