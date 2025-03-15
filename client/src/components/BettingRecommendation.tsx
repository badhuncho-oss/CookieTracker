import { useBaccaratContext } from "@/context/BaccaratContext";

export default function BettingRecommendation() {
  const { recommendation } = useBaccaratContext();
  
  const getTextColor = () => {
    if (recommendation.type === 'banker') return 'text-red-600';
    if (recommendation.type === 'player') return 'text-blue-600';
    if (recommendation.type === 'tie') return 'text-green-600';
    return '';
  };
  
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-2">Bet on:</h3>
      <div className="h-16 flex items-center justify-center text-3xl font-bold mb-2">
        <span className={getTextColor()}>
          {recommendation.text}
        </span>
      </div>
      
      <div className="bg-gray-800 h-2 w-full mb-4 rounded-full overflow-hidden">
        <div 
          className="bg-yellow-500 h-full rounded-full" 
          style={{ width: `${recommendation.confidence}%` }}
        ></div>
      </div>
    </div>
  );
}
