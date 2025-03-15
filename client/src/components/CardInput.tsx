import { useBaccaratContext } from "@/context/BaccaratContext";
import { useState } from "react";
import { validateCardInput } from "@/utils/validators";

export default function CardInput() {
  const { setCurrentCards, cardCount, playNumber } = useBaccaratContext();
  const [cardValues, setCardValues] = useState("");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Filter non-digit characters
    const filteredValue = e.target.value.replace(/[^0-9]/g, '');
    setCardValues(filteredValue);
    
    // Update context if input is valid
    if (validateCardInput(filteredValue)) {
      setCurrentCards(filteredValue);
    }
  };
  
  const handleClear = () => {
    setCardValues("");
    setCurrentCards("");
  };
  
  return (
    <div className="mb-3 bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex justify-between items-center border-b border-gray-700">
        <h3 className="font-bold text-lg">Card Input</h3>
        <div className="flex space-x-3 text-sm">
          <div>
            <span className="text-gray-400">Remaining in shoe:</span>{" "}
            <span className="text-yellow-500 font-bold">{cardCount}</span>
          </div>
          <div>
            <span className="text-gray-400">Play #:</span>{" "}
            <span className="text-yellow-500 font-bold">{playNumber}</span>
          </div>
        </div>
      </div>
    
      <div className="p-3">
        <div className="flex items-center">
          <div className="flex flex-1">
            <input 
              type="text" 
              id="playing-cards" 
              value={cardValues}
              onChange={handleInputChange}
              maxLength={12}
              className="flex-1 bg-gray-800 text-white px-3 py-2 border border-gray-600 focus:border-yellow-500 focus:outline-none rounded-l-md"
              placeholder="A=1, 2-9=face value, 10/J/Q/K=0"
            />
            <button 
              onClick={handleClear}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-r-md"
            >
              Clear
            </button>
          </div>
          
          {cardValues.length > 0 && (
            <div className="flex items-center ml-3">
              <span className="text-xl font-mono bg-gray-800 px-3 py-1 rounded font-bold text-yellow-400 mr-2">{cardValues}</span>
              <button
                className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded text-sm whitespace-nowrap"
                onClick={() => {
                  if (cardValues.length > 0) {
                    setCurrentCards(cardValues);
                  }
                }}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
