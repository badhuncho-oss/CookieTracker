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
    let currentStreak = { type: currentType, count: 1 };
    
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
    <div className="mb-6">
      {/* Game controls */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <div className="flex justify-between mb-2">
            <label className="text-gray-300">Number of Cards:</label>
            <div className="flex">
              <button 
                className="bg-gray-700 px-2 hover:bg-gray-600"
                onClick={decrementCardCount}
              >
                ↓
              </button>
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
        <div className="flex flex-col gap-2">
          <button 
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 uppercase font-medium tracking-wide border border-gray-700 text-sm"
            onClick={resetGame}
          >
            Reset Game
          </button>
          <button 
            className="bg-gray-800 hover:bg-gray-700 px-4 py-1.5 font-medium border border-gray-700 text-sm"
            onClick={() => setAiMode(aiMode === 'standard' ? 'advanced' : 'standard')}
          >
            Switch to {aiMode === 'standard' ? 'Neural AI' : 'Standard AI'}
          </button>
        </div>
      </div>
      
      {/* Current statistics */}
      <div className="border-t border-gray-700 pt-4 mb-2">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Statistics</h3>
          <button 
            className="text-sm text-gray-400 hover:text-white"
            onClick={() => setShowStatsDetails(!showStatsDetails)}
          >
            {showStatsDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        {/* Basic stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-800 p-2 rounded text-center">
            <div className="text-sm text-blue-400">Player</div>
            <div className="text-lg font-bold">{statistics.playerWins}</div>
            <div className="text-xs text-gray-400">{getPercentage(statistics.playerWins)}%</div>
          </div>
          <div className="bg-gray-800 p-2 rounded text-center">
            <div className="text-sm text-green-400">Tie</div>
            <div className="text-lg font-bold">{statistics.tieWins}</div>
            <div className="text-xs text-gray-400">{getPercentage(statistics.tieWins)}%</div>
          </div>
          <div className="bg-gray-800 p-2 rounded text-center">
            <div className="text-sm text-red-400">Banker</div>
            <div className="text-lg font-bold">{statistics.bankerWins}</div>
            <div className="text-xs text-gray-400">{getPercentage(statistics.bankerWins)}%</div>
          </div>
        </div>
        
        {/* Detailed stats */}
        {showStatsDetails && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-800 p-3 rounded">
              <h4 className="text-gray-300 mb-1">Current Streak</h4>
              {streaks.current.type ? (
                <div className="flex items-center">
                  <span className={`font-bold text-lg ${getStreakColor(streaks.current.type)}`}>
                    {getStreakLabel(streaks.current.type)}
                  </span>
                  <span className="ml-2">× {streaks.current.count}</span>
                </div>
              ) : (
                <span>No streak</span>
              )}
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <h4 className="text-gray-300 mb-1">Longest Streak</h4>
              {streaks.longest.type ? (
                <div className="flex items-center">
                  <span className={`font-bold text-lg ${getStreakColor(streaks.longest.type)}`}>
                    {getStreakLabel(streaks.longest.type)}
                  </span>
                  <span className="ml-2">× {streaks.longest.count}</span>
                </div>
              ) : (
                <span>No streak</span>
              )}
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <h4 className="text-gray-300 mb-1">Player/Banker Ratio</h4>
              <div>
                {statistics.playerWins} : {statistics.bankerWins}
                {statistics.playerWins > 0 && statistics.bankerWins > 0 && (
                  <span className="text-xs text-gray-400 ml-2">
                    ({(statistics.playerWins / statistics.bankerWins).toFixed(2)})
                  </span>
                )}
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <h4 className="text-gray-300 mb-1">Total Hands</h4>
              <div className="font-medium">{statistics.totalPlays}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
