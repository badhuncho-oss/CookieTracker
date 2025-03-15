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
    <div className="mb-1 bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-2 py-1 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center">
          <h3 className="font-bold text-sm">Card Input</h3>
          <span className="ml-2 text-yellow-500 text-xs">{cardValues && `(${cardValues.length}) ${cardValues}`}</span>
        </div>
        <div className="flex space-x-2 text-xs">
          <div>
            <span className="text-gray-400">Cards:</span>{" "}
            <span className="text-yellow-500 font-bold">{cardCount}</span>
          </div>
          <div>
            <span className="text-gray-400">Play:</span>{" "}
            <span className="text-yellow-500 font-bold">{playNumber}</span>
          </div>
        </div>
      </div>
    
      <div className="p-1">
        <div className="flex items-center gap-1">
          <div className="flex flex-1">
            <input 
              type="text" 
              id="playing-cards" 
              value={cardValues}
              onChange={handleInputChange}
              maxLength={12}
              className="flex-1 bg-gray-800 text-white px-2 py-1 text-sm border border-gray-600 focus:border-yellow-500 focus:outline-none rounded-l"
              placeholder="Cards (A=1, 10/J/Q/K=0)"
            />
            <button 
              onClick={handleClear}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-r"
            >
              ×
            </button>
          </div>
          
          <button
            className="px-2 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded text-xs whitespace-nowrap"
            onClick={() => {
              if (cardValues.length > 0) {
                setCurrentCards(cardValues);
              }
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
