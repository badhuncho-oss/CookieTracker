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
    <div className="mb-3 bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex justify-between items-center border-b border-gray-700">
        <h3 className="font-bold text-lg">Game Control & Stats</h3>
        <div className="flex items-center space-x-2">
          <button 
            className="text-xs px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={() => setShowStatsDetails(!showStatsDetails)}
          >
            {showStatsDetails ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>
      
      <div className="p-3">
        {/* Game controls - Compact grid layout */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-800 p-2 rounded-md border border-gray-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Cards in Shoe:</span>
              <div className="flex">
                <button 
                  className="bg-gray-700 px-1.5 text-xs hover:bg-gray-600 rounded-l"
                  onClick={decrementCardCount}
                >
                  -
                </button>
                <span className="bg-gray-600 text-white px-2 text-xs font-medium flex items-center">{cardCount}</span>
                <button 
                  className="bg-gray-700 px-1.5 text-xs hover:bg-gray-600 rounded-r"
                  onClick={incrementCardCount}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Play Number:</span>
              <span className="font-medium text-xs">{playNumber}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-1">
            <button 
              className="bg-yellow-900 hover:bg-yellow-800 px-1 py-1 uppercase text-yellow-100 font-medium tracking-wide text-xs rounded"
              onClick={resetGame}
            >
              Reset Game
            </button>
            <button 
              className="bg-blue-900 hover:bg-blue-800 px-1 py-1 text-blue-100 font-medium text-xs rounded"
              onClick={() => setAiMode(aiMode === 'standard' ? 'advanced' : 'standard')}
            >
              {aiMode === 'standard' ? 'Enable Neural AI' : 'Standard AI Mode'}
            </button>
          </div>
        </div>
        
        {/* Basic statistics - Compact with icons */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="bg-blue-900 bg-opacity-30 border border-blue-900 p-1.5 rounded text-center">
            <div className="text-xs text-blue-400 font-medium">Player</div>
            <div className="text-base font-bold">{statistics.playerWins}</div>
            <div className="text-xs text-gray-400">{getPercentage(statistics.playerWins)}%</div>
          </div>
          <div className="bg-green-900 bg-opacity-30 border border-green-900 p-1.5 rounded text-center">
            <div className="text-xs text-green-400 font-medium">Tie</div>
            <div className="text-base font-bold">{statistics.tieWins}</div>
            <div className="text-xs text-gray-400">{getPercentage(statistics.tieWins)}%</div>
          </div>
          <div className="bg-red-900 bg-opacity-30 border border-red-900 p-1.5 rounded text-center">
            <div className="text-xs text-red-400 font-medium">Banker</div>
            <div className="text-base font-bold">{statistics.bankerWins}</div>
            <div className="text-xs text-gray-400">{getPercentage(statistics.bankerWins)}%</div>
          </div>
        </div>
        
        {/* Streak information - Always show compactly */}
        <div className="flex space-x-2 text-xs">
          <div className="flex-1 bg-gray-800 px-2 py-1 rounded border border-gray-700">
            <span className="text-gray-400">Current:</span>
            {streaks.current.type ? (
              <span className="ml-1">
                <span className={`font-bold ${getStreakColor(streaks.current.type)}`}>
                  {getStreakLabel(streaks.current.type)}
                </span>
                <span className="ml-1">× {streaks.current.count}</span>
              </span>
            ) : (
              <span className="ml-1">None</span>
            )}
          </div>
          <div className="flex-1 bg-gray-800 px-2 py-1 rounded border border-gray-700">
            <span className="text-gray-400">Longest:</span>
            {streaks.longest.type ? (
              <span className="ml-1">
                <span className={`font-bold ${getStreakColor(streaks.longest.type)}`}>
                  {getStreakLabel(streaks.longest.type)}
                </span>
                <span className="ml-1">× {streaks.longest.count}</span>
              </span>
            ) : (
              <span className="ml-1">None</span>
            )}
          </div>
        </div>
        
        {/* Detailed stats */}
        {showStatsDetails && (
          <div className="grid grid-cols-2 gap-2 text-xs mt-2 pt-2 border-t border-gray-700">
            <div className="bg-gray-800 p-2 rounded">
              <h4 className="text-gray-400">P/B Ratio</h4>
              <div className="font-medium">
                {statistics.playerWins} : {statistics.bankerWins}
                {statistics.playerWins > 0 && statistics.bankerWins > 0 && (
                  <span className="text-gray-400 ml-1">
                    ({(statistics.playerWins / statistics.bankerWins).toFixed(2)})
                  </span>
                )}
              </div>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <h4 className="text-gray-400">Total Hands</h4>
              <div className="font-medium">{statistics.totalPlays}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
