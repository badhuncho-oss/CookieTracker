import { useBaccaratContext } from "@/context/BaccaratContext";
import { useState } from "react";
import { validateCardInput } from "@/utils/validators";

export default function CardInput() {
  const { setCurrentCards } = useBaccaratContext();
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
  
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <label htmlFor="playing-cards" className="text-xl font-medium mr-4">Playing Cards</label>
        <div className="flex-1">
          <input 
            type="text" 
            id="playing-cards" 
            value={cardValues}
            onChange={handleInputChange}
            maxLength={12}
            className="w-full bg-white text-black px-3 py-2 border-2 border-gray-700 focus:border-yellow-500 focus:outline-none"
            placeholder="Enter card values (e.g. 370127)"
          />
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        <i className="fas fa-info-circle mr-1"></i> A=1, 2-9=face value, 10/J/Q/K=0. Enter without spaces.
      </p>
    </div>
  );
}
