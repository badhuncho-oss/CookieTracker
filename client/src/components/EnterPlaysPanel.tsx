import { useBaccaratContext } from "@/context/BaccaratContext";
import { useToast } from "@/hooks/use-toast";

export default function EnterPlaysPanel() {
  const { recordOutcome, undoLastOutcome, recommendation, gameResults } = useBaccaratContext();
  const { toast } = useToast();

  const handleOutcome = (outcome: 'player' | 'banker' | 'tie') => {
    recordOutcome(outcome);
    toast({
      title: `${outcome.charAt(0).toUpperCase() + outcome.slice(1)} recorded`,
      description: recommendation.type === outcome ? '✓ Matched prediction' : '✗ Did not match prediction',
      variant: recommendation.type === outcome ? 'default' : 'destructive',
    });
  };

  return (
    <div className="bg-black border border-gray-800 h-full flex flex-col">
      <div className="px-2 py-1 border-b border-gray-800">
        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Enter Plays</span>
      </div>
      <div className="flex flex-col gap-1.5 p-2 flex-1">
        <button
          onClick={() => handleOutcome('banker')}
          className="w-full py-3 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-black text-sm uppercase tracking-widest rounded transition-colors border border-red-600"
        >
          BANKER
        </button>
        <button
          onClick={() => handleOutcome('player')}
          className="w-full py-3 bg-cyan-700 hover:bg-cyan-600 active:bg-cyan-800 text-white font-black text-sm uppercase tracking-widest rounded transition-colors border border-cyan-600"
        >
          PLAYER
        </button>
        <button
          onClick={() => handleOutcome('tie')}
          className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700 text-white font-black text-sm uppercase tracking-widest rounded transition-colors border border-yellow-500"
        >
          TIE
        </button>
        <button
          onClick={() => {
            if (gameResults.length > 0) {
              undoLastOutcome();
              toast({ title: 'Undo', description: 'Last play removed' });
            }
          }}
          disabled={gameResults.length === 0}
          className="w-full py-1.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 text-[9px] uppercase tracking-widest rounded transition-colors border border-gray-700 flex items-center justify-center gap-1"
        >
          <span>↩</span> UNDO
        </button>
      </div>
    </div>
  );
}
