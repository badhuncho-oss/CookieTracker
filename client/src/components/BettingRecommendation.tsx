import { useBaccaratContext } from "@/context/BaccaratContext";

export default function BettingRecommendation() {
  const { recommendation, secondaryRecommendation, winStreak, lossStreak, aiMode } = useBaccaratContext();
  
  const getTextColor = (type: string) => {
    if (type === 'banker') return 'text-red-600';
    if (type === 'player') return 'text-blue-600';
    if (type === 'tie') return 'text-green-600';
    return '';
  };
  
  const getBgColor = (type: string) => {
    if (type === 'banker') return 'bg-red-600';
    if (type === 'player') return 'bg-blue-600';
    if (type === 'tie') return 'bg-green-600';
    return 'bg-gray-600';
  };
  
  const getAiLabel = () => {
    return aiMode === 'advanced' ? 'Neural AI' : 'Standard AI';
  };
  
  // Calculate win percentage
  const getWinPercentage = () => {
    const totalPredictions = winStreak + lossStreak;
    if (totalPredictions === 0) return 0;
    return Math.round((winStreak / totalPredictions) * 100);
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold">Bet on:</h3>
        <div className="flex items-center">
          <span className="text-xs text-gray-400 mr-2">{getAiLabel()}</span>
          <span className={`text-xs px-2 py-1 rounded ${winStreak > 0 ? 'bg-green-700' : lossStreak > 0 ? 'bg-red-700' : 'bg-gray-700'}`}>
            {winStreak > 0 ? `${winStreak}W` : lossStreak > 0 ? `${lossStreak}L` : '0'}
          </span>
        </div>
      </div>
      
      {/* Primary recommendation */}
      <div className="mb-6">
        <div className="h-16 flex items-center justify-center text-3xl font-bold mb-2">
          <span className={getTextColor(recommendation.type)}>
            {recommendation.text}
          </span>
        </div>
        
        <div className="bg-gray-800 h-3 w-full mb-1 rounded-full overflow-hidden">
          <div 
            className={`${getBgColor(recommendation.type)} h-full rounded-full`}
            style={{ width: `${recommendation.confidence}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-400">
          <span>Confidence</span>
          <span>{recommendation.confidence}%</span>
        </div>
      </div>
      
      {/* Secondary recommendation (if available) */}
      {secondaryRecommendation && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Secondary Bet:</span>
            <span className={`text-sm font-bold ${getTextColor(secondaryRecommendation.type)}`}>
              {secondaryRecommendation.text}
            </span>
          </div>
          
          <div className="bg-gray-800 h-2 w-full rounded-full overflow-hidden">
            <div 
              className={`${getBgColor(secondaryRecommendation.type)} h-full rounded-full`}
              style={{ width: `${secondaryRecommendation.confidence}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Win/Loss Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-800 p-2 rounded">
          <div className="text-sm text-gray-300">Win Rate</div>
          <div className="text-lg font-bold">{getWinPercentage()}%</div>
        </div>
        <div className="bg-gray-800 p-2 rounded">
          <div className="text-sm text-gray-300">Wins</div>
          <div className="text-lg font-bold text-green-500">{winStreak}</div>
        </div>
        <div className="bg-gray-800 p-2 rounded">
          <div className="text-sm text-gray-300">Losses</div>
          <div className="text-lg font-bold text-red-500">{lossStreak}</div>
        </div>
      </div>
    </div>
  );
}
