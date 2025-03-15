import { useBaccaratContext } from "@/context/BaccaratContext";
import { useState } from "react";

export default function GameStatistics() {
  const { 
    cardCount, 
    playNumber, 
    incrementCardCount, 
    decrementCardCount, 
    resetGame,
    statistics,
    gameResults,
    aiMode,
    setAiMode
  } = useBaccaratContext();
  
  const [showStatsDetails, setShowStatsDetails] = useState(false);
  
  // Calculate percentages for statistics
  const getPercentage = (count: number) => {
    return statistics.totalPlays > 0 
      ? Math.round((count / statistics.totalPlays) * 100) 
      : 0;
  };
  
  // Calculate streak information
  const getStreaks = () => {
    if (gameResults.length === 0) return { current: { type: '', count: 0 }, longest: { type: '', count: 0 } };
    
    let currentType = gameResults[gameResults.length - 1];
    let currentCount = 1;
    let longestType = currentType;
    let longestCount = 1;
    
    // Go through results backwards to find current streak
    for (let i = gameResults.length - 2; i >= 0; i--) {
      if (gameResults[i] === currentType) {
        currentCount++;
      } else {
        break;
      }
    }
    
    // Find longest streak
    let tempType = gameResults[0];
    let tempCount = 1;
    
    for (let i = 1; i < gameResults.length; i++) {
      if (gameResults[i] === tempType) {
        tempCount++;
        if (tempCount > longestCount) {
          longestCount = tempCount;
          longestType = tempType;
        }
      } else {
        tempType = gameResults[i];
        tempCount = 1;
      }
    }
    
    return {
      current: { type: currentType, count: currentCount },
      longest: { type: longestType, count: longestCount }
    };
  };
  
  const streaks = getStreaks();
  
  // Get streak color
  const getStreakColor = (type: string) => {
    if (type === 'banker') return 'text-red-500';
    if (type === 'player') return 'text-blue-500';
    if (type === 'tie') return 'text-green-500';
    return '';
  };
  
  // Get streak label
  const getStreakLabel = (type: string) => {
    if (type === 'banker') return 'B';
    if (type === 'player') return 'P';
    if (type === 'tie') return 'T';
    return '';
  };
  
  return (
    <div className="mb-1 bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-2 py-1 flex justify-between items-center border-b border-gray-700">
        <h3 className="font-bold text-sm">Stats</h3>
        <div className="flex items-center space-x-1">
          <button 
            className="text-[9px] px-1.5 py-0.5 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={() => setAiMode(aiMode === 'standard' ? 'advanced' : 'standard')}
          >
            {aiMode === 'standard' ? 'Neural' : 'Std'}
          </button>
          <button 
            className="text-[9px] px-1.5 py-0.5 bg-yellow-800 hover:bg-yellow-700 rounded"
            onClick={resetGame}
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="p-1">
        {/* Card counter */}
        <div className="flex justify-between items-center mb-1 gap-1">
          <div className="flex-1 bg-gray-800 p-1 rounded-md border border-gray-700 flex items-center justify-between">
            <span className="text-[9px] text-gray-400">Cards:</span>
            <div className="flex">
              <button 
                className="bg-gray-700 px-1 text-[10px] hover:bg-gray-600 rounded-l"
                onClick={decrementCardCount}
              >
                -
              </button>
              <span className="bg-gray-600 text-white px-1 text-[10px] font-medium flex items-center">{cardCount}</span>
              <button 
                className="bg-gray-700 px-1 text-[10px] hover:bg-gray-600 rounded-r"
                onClick={incrementCardCount}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex-1 bg-gray-800 p-1 rounded-md border border-gray-700 flex items-center justify-between">
            <span className="text-[9px] text-gray-400">Play:</span>
            <span className="font-medium text-[10px]">{playNumber}</span>
          </div>
        </div>
        
        {/* Win statistics boxes - more square-shaped */}
        <div className="grid grid-cols-3 gap-1 mb-1">
          <div className="aspect-square bg-blue-900 bg-opacity-30 border border-blue-900 p-0.5 rounded text-center flex flex-col justify-center">
            <div className="text-[9px] text-blue-400 font-medium">P</div>
            <div className="text-sm font-bold">{statistics.playerWins}</div>
            <div className="text-[8px] text-gray-400">{getPercentage(statistics.playerWins)}%</div>
          </div>
          <div className="aspect-square bg-green-900 bg-opacity-30 border border-green-900 p-0.5 rounded text-center flex flex-col justify-center">
            <div className="text-[9px] text-green-400 font-medium">T</div>
            <div className="text-sm font-bold">{statistics.tieWins}</div>
            <div className="text-[8px] text-gray-400">{getPercentage(statistics.tieWins)}%</div>
          </div>
          <div className="aspect-square bg-red-900 bg-opacity-30 border border-red-900 p-0.5 rounded text-center flex flex-col justify-center">
            <div className="text-[9px] text-red-400 font-medium">B</div>
            <div className="text-sm font-bold">{statistics.bankerWins}</div>
            <div className="text-[8px] text-gray-400">{getPercentage(statistics.bankerWins)}%</div>
          </div>
        </div>
        
        {/* Streak boxes */}
        <div className="grid grid-cols-2 gap-1 text-[9px]">
          <div className="bg-gray-800 p-0.5 rounded border border-gray-700 flex justify-between">
            <span className="text-gray-400">Streak:</span>
            {streaks.current.type ? (
              <span>
                <span className={`font-bold ${getStreakColor(streaks.current.type)}`}>
                  {getStreakLabel(streaks.current.type)}
                </span>
                <span>×{streaks.current.count}</span>
              </span>
            ) : (
              <span>-</span>
            )}
          </div>
          <div className="bg-gray-800 p-0.5 rounded border border-gray-700 flex justify-between">
            <span className="text-gray-400">Longest:</span>
            {streaks.longest.type ? (
              <span>
                <span className={`font-bold ${getStreakColor(streaks.longest.type)}`}>
                  {getStreakLabel(streaks.longest.type)}
                </span>
                <span>×{streaks.longest.count}</span>
              </span>
            ) : (
              <span>-</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
