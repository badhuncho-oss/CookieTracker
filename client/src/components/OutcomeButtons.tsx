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
    <div className="mb-8 bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex justify-between items-center border-b border-gray-700">
        <h3 className="font-bold text-lg">Record Outcome</h3>
        <div className="text-sm text-gray-400">
          Select the winning hand
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button 
            className={`bg-[#1a5d8f] hover:bg-opacity-90 py-6 text-white font-bold text-xl uppercase rounded-md relative transition-all ${getBorderStyle('player')}`}
            onClick={() => handleOutcomeClick('player')}
          >
            Player
            <div className="text-xs font-normal mt-1 opacity-75">左</div>
            {getMatchIndicator('player')}
          </button>
          <button 
            className={`bg-[#2a7d2a] hover:bg-opacity-90 py-6 text-white font-bold text-xl uppercase rounded-md relative transition-all ${getBorderStyle('tie')}`}
            onClick={() => handleOutcomeClick('tie')}
          >
            Tie
            <div className="text-xs font-normal mt-1 opacity-75">和</div>
            {getMatchIndicator('tie')}
          </button>
          <button 
            className={`bg-[#a02c2c] hover:bg-opacity-90 py-6 text-white font-bold text-xl uppercase rounded-md relative transition-all ${getBorderStyle('banker')}`}
            onClick={() => handleOutcomeClick('banker')}
          >
            Banker
            <div className="text-xs font-normal mt-1 opacity-75">庄</div>
            {getMatchIndicator('banker')}
          </button>
        </div>
        
        {selectedOutcome && (
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">Selected outcome:</span>
              <span className={`font-bold ${
                selectedOutcome === 'player' ? 'text-blue-400' : 
                selectedOutcome === 'banker' ? 'text-red-400' : 'text-green-400'
              }`}>
                {selectedOutcome.toUpperCase()}
              </span>
            </div>
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
                onClick={() => setSelectedOutcome(null)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-1.5 bg-green-800 hover:bg-green-700 text-white rounded text-sm font-medium"
                onClick={confirmOutcome}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-blue-900/20 mt-4 p-3 rounded-md border border-blue-900/40 text-sm text-blue-300">
          <p>Select the winning outcome to record it and update predictions and statistics. 
          The green indicator shows which selection matches the primary recommendation.</p>
        </div>
      </div>
    </div>
  );
}
