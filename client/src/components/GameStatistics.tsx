import { useBaccaratContext } from "@/context/BaccaratContext";

export default function GameStatistics() {
  const { cardCount, playNumber, incrementCardCount, decrementCardCount, resetGame } = useBaccaratContext();
  
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="flex flex-col">
        <div className="flex justify-between mb-2">
          <label className="text-gray-300">Number of Cards:</label>
          <div className="flex">
            <span className="bg-white text-black px-3 py-1 font-medium">{cardCount}</span>
            <button 
              className="bg-gray-700 px-2 hover:bg-gray-600"
              onClick={incrementCardCount}
            >
              ↑
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <label className="text-gray-300">Play Number:</label>
          <span className="font-medium">{playNumber}</span>
        </div>
      </div>
      <div className="flex justify-end items-start">
        <button 
          className="bg-gray-800 hover:bg-gray-700 px-6 py-2 uppercase font-medium tracking-wide border border-gray-700"
          onClick={resetGame}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
