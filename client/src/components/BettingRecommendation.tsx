import { useBaccaratContext } from "@/context/BaccaratContext";

export default function BettingRecommendation() {
  const { recommendation, secondaryRecommendation, winStreak, lossStreak, aiMode } = useBaccaratContext();
  
  const getTextColor = (type: string) => {
    if (type === 'banker') return 'text-red-500';
    if (type === 'player') return 'text-blue-500';
    if (type === 'tie') return 'text-green-500';
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
    <div className="mb-3 bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex justify-between items-center border-b border-gray-700">
        <h3 className="font-bold text-lg">Betting Recommendation</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2 py-0.5 bg-gray-700 rounded">{getAiLabel()}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${winStreak > 0 ? 'bg-green-700' : lossStreak > 0 ? 'bg-red-700' : 'bg-gray-700'}`}>
            {winStreak > 0 ? `${winStreak}W` : lossStreak > 0 ? `${lossStreak}L` : '0'}
          </span>
        </div>
      </div>
      
      <div className="p-3">
        {/* Primary recommendation */}
        <div className="mb-3">
          <div className={`${getBgColor(recommendation.type)} bg-opacity-20 border ${recommendation.type === 'player' ? 'border-blue-800' : recommendation.type === 'banker' ? 'border-red-800' : 'border-green-800'} rounded-md p-3 flex items-center justify-between`}>
            <div>
              <div className="text-xs text-gray-400 mb-1">Main Bet ({recommendation.units} units)</div>
              <div className={`text-2xl font-bold ${getTextColor(recommendation.type)}`}>
                {recommendation.text}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">Confidence</div>
              <div className="text-xl font-bold">{recommendation.confidence}%</div>
            </div>
          </div>
          
          {/* Secondary recommendation (if available) */}
          {secondaryRecommendation && (
            <div className={`${getBgColor(secondaryRecommendation.type)} bg-opacity-10 border ${secondaryRecommendation.type === 'player' ? 'border-blue-800' : secondaryRecommendation.type === 'banker' ? 'border-red-800' : 'border-green-800'} border-opacity-50 rounded-md p-2 flex items-center justify-between mt-2`}>
              <div>
                <div className="text-xs text-gray-400">Secondary Bet ({secondaryRecommendation.units} units)</div>
                <div className={`text-lg font-medium ${getTextColor(secondaryRecommendation.type)}`}>
                  {secondaryRecommendation.text}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Confidence</div>
                <div className="text-base font-medium">{secondaryRecommendation.confidence}%</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Win/Loss Statistics - Compact Version */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-800 rounded p-1.5">
            <div className="text-xs text-gray-400">Win Rate</div>
            <div className="text-base font-bold">{getWinPercentage()}%</div>
          </div>
          <div className="bg-gray-800 rounded p-1.5">
            <div className="text-xs text-gray-400">Wins</div>
            <div className="text-base font-bold text-green-500">{winStreak}</div>
          </div>
          <div className="bg-gray-800 rounded p-1.5">
            <div className="text-xs text-gray-400">Losses</div>
            <div className="text-base font-bold text-red-500">{lossStreak}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
