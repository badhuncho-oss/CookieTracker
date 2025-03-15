import { useBaccaratContext } from "@/context/BaccaratContext";

export default function ResultsLog() {
  const { gameResults } = useBaccaratContext();
  
  const getBackgroundColor = (result: string) => {
    if (result === 'player') return 'bg-[#1a5d8f]';
    if (result === 'banker') return 'bg-[#a02c2c]';
    if (result === 'tie') return 'bg-[#2a7d2a]';
    return 'bg-gray-500';
  };
  
  const getLabel = (result: string) => {
    if (result === 'player') return 'P';
    if (result === 'banker') return 'B';
    if (result === 'tie') return 'T';
    return '';
  };
  
  return (
    <div className="border-t border-gray-700 pt-4">
      <h3 className="text-lg font-medium mb-2">Recent Results</h3>
      <div className="bg-gray-900 p-3 rounded">
        <div className="flex flex-wrap gap-2">
          {gameResults.map((result, index) => (
            <span 
              key={index}
              className={`inline-block py-1 px-2 rounded-sm text-sm ${getBackgroundColor(result)}`}
            >
              {getLabel(result)}
            </span>
          ))}
          
          {gameResults.length === 0 && (
            <span className="text-gray-500">No results yet</span>
          )}
        </div>
      </div>
    </div>
  );
}
