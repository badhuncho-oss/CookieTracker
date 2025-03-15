import { useBaccaratContext } from "@/context/BaccaratContext";
import { useToast } from "@/hooks/use-toast";

export default function OutcomeButtons() {
  const { currentCards, recordOutcome } = useBaccaratContext();
  const { toast } = useToast();
  
  const handleOutcomeClick = (outcome: 'player' | 'banker' | 'tie') => {
    if (!currentCards) {
      toast({
        title: "Error",
        description: "Please enter card values first",
        variant: "destructive",
      });
      return;
    }
    
    recordOutcome(outcome);
  };
  
  return (
    <div className="grid grid-cols-3 gap-2 mb-8">
      <button 
        className="bg-[#1a5d8f] hover:bg-opacity-90 py-6 text-white font-bold text-xl uppercase"
        onClick={() => handleOutcomeClick('player')}
      >
        Player
        <div className="text-xs font-normal mt-1 opacity-75">左</div>
      </button>
      <button 
        className="bg-[#2a7d2a] hover:bg-opacity-90 py-6 text-white font-bold text-xl uppercase"
        onClick={() => handleOutcomeClick('tie')}
      >
        Tie
        <div className="text-xs font-normal mt-1 opacity-75">和</div>
      </button>
      <button 
        className="bg-[#a02c2c] hover:bg-opacity-90 py-6 text-white font-bold text-xl uppercase"
        onClick={() => handleOutcomeClick('banker')}
      >
        Banker
        <div className="text-xs font-normal mt-1 opacity-75">庄</div>
      </button>
    </div>
  );
}
