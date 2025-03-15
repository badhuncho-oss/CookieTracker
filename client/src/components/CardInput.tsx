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
    <div className="mb-6 bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
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
    
      <div className="p-4">
        <div className="flex flex-col mb-4">
          <label htmlFor="playing-cards" className="text-sm text-gray-300 mb-1">
            Input playing cards:
          </label>
          <div className="flex">
            <input 
              type="text" 
              id="playing-cards" 
              value={cardValues}
              onChange={handleInputChange}
              maxLength={12}
              className="flex-1 bg-gray-800 text-white px-3 py-2 border border-gray-600 focus:border-yellow-500 focus:outline-none rounded-l-md"
              placeholder="Enter card values (e.g. 06913)"
            />
            <button 
              onClick={handleClear}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-r-md"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 p-3 rounded-md text-sm">
          <h4 className="font-bold text-yellow-500 mb-2">Card Input Guide:</h4>
          <ul className="space-y-1 text-gray-300">
            <li><span className="text-yellow-400 font-medium">ACE:</span> Input as 1</li>
            <li><span className="text-yellow-400 font-medium">2-9:</span> Input as face value</li>
            <li><span className="text-yellow-400 font-medium">10/J/Q/K:</span> Input as 0</li>
            <li className="pt-1 text-xs text-gray-400">Enter without spaces. For example, a hand with a Jack, 7, 3 would be entered as "073".</li>
          </ul>
        </div>
        
        {cardValues.length > 0 && (
          <div className="mt-4 border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current input:</span>
              <span className="text-xl font-mono bg-gray-800 px-3 py-1 rounded font-bold text-yellow-400">{cardValues}</span>
            </div>
            <div className="flex justify-end mt-2">
              <button
                className="px-4 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded text-sm"
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
        )}
      </div>
    </div>
  );
}
