import { useBaccaratContext } from "@/context/BaccaratContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function OutcomeButtons() {
  const { currentCards, recordOutcome, recommendation, secondaryRecommendation } = useBaccaratContext();
  const { toast } = useToast();
  const [selectedOutcome, setSelectedOutcome] = useState<'player' | 'banker' | 'tie' | null>(null);
  
  const handleOutcomeClick = (outcome: 'player' | 'banker' | 'tie') => {
    setSelectedOutcome(outcome);
  };
  
  const confirmOutcome = () => {
    if (!selectedOutcome) return;
    
    if (!currentCards) {
      toast({
        title: "Missing Card Values",
        description: "Please enter the card values before recording an outcome.",
        variant: "destructive",
      });
      return;
    }
    
    recordOutcome(selectedOutcome);
    toast({
      title: "Outcome Recorded",
      description: `${selectedOutcome.charAt(0).toUpperCase() + selectedOutcome.slice(1)} outcome has been recorded.`,
      variant: "default",
    });
    setSelectedOutcome(null);
  };
  
  // Check if the outcome matches our recommendation
  const getMatchIndicator = (outcome: 'player' | 'banker' | 'tie') => {
    if (recommendation.type === outcome) {
      return <span className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full"></span>;
    } else if (secondaryRecommendation?.type === outcome) {
      return <span className="absolute -top-1 -right-1 bg-yellow-500 w-3 h-3 rounded-full"></span>;
    }
    return null;
  };
  
  const getBorderStyle = (outcome: 'player' | 'banker' | 'tie') => {
    if (selectedOutcome === outcome) {
      return "border-yellow-400 border-4";
    }
    return "border-transparent border-4";
  };
  
  return (
    <div className="mb-1 bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-2 py-1 flex justify-between items-center border-b border-gray-700">
        <h3 className="font-bold text-sm">Record Outcome</h3>
        {selectedOutcome && (
          <span className={`text-xs font-bold ${
            selectedOutcome === 'player' ? 'text-blue-400' : 
            selectedOutcome === 'banker' ? 'text-red-400' : 'text-green-400'
          }`}>
            Selected: {selectedOutcome.toUpperCase()}
          </span>
        )}
      </div>
      
      <div className="p-1">
        <div className="grid grid-cols-3 gap-1 mb-1">
          <button 
            className={`aspect-square bg-[#1a5d8f] hover:bg-opacity-90 flex flex-col items-center justify-center text-white font-bold text-xs uppercase rounded relative transition-all ${getBorderStyle('player')}`}
            onClick={() => handleOutcomeClick('player')}
          >
            <span>P</span>
            <div className="text-[9px] font-normal opacity-75">左</div>
            {getMatchIndicator('player')}
          </button>
          <button 
            className={`aspect-square bg-[#2a7d2a] hover:bg-opacity-90 flex flex-col items-center justify-center text-white font-bold text-xs uppercase rounded relative transition-all ${getBorderStyle('tie')}`}
            onClick={() => handleOutcomeClick('tie')}
          >
            <span>T</span>
            <div className="text-[9px] font-normal opacity-75">和</div>
            {getMatchIndicator('tie')}
          </button>
          <button 
            className={`aspect-square bg-[#a02c2c] hover:bg-opacity-90 flex flex-col items-center justify-center text-white font-bold text-xs uppercase rounded relative transition-all ${getBorderStyle('banker')}`}
            onClick={() => handleOutcomeClick('banker')}
          >
            <span>B</span>
            <div className="text-[9px] font-normal opacity-75">庄</div>
            {getMatchIndicator('banker')}
          </button>
        </div>
        
        {selectedOutcome && (
          <div className="flex justify-end items-center gap-1 mt-1">
            <button 
              className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs"
              onClick={() => setSelectedOutcome(null)}
            >
              ✕
            </button>
            <button 
              className="px-2 py-0.5 bg-green-800 hover:bg-green-700 text-white rounded text-xs font-medium"
              onClick={confirmOutcome}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
