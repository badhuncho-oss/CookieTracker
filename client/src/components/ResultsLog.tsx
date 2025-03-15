import { useBaccaratContext } from "@/context/BaccaratContext";
import { useState } from "react";

// Define the types of bead plates/road maps in baccarat
const VIEW_TYPES = {
  RESULTS: 'results',
  BIG_ROAD: 'big-road',
  BIG_EYE_ROAD: 'big-eye-road',
  SMALL_ROAD: 'small-road'
};

export default function ResultsLog() {
  const { gameResults } = useBaccaratContext();
  const [viewType, setViewType] = useState(VIEW_TYPES.RESULTS);
  
  const getBackgroundColor = (result: string) => {
    if (result === 'player') return 'bg-blue-700';
    if (result === 'banker') return 'bg-red-700';
    if (result === 'tie') return 'bg-green-700';
    return 'bg-gray-500';
  };
  
  const getBorderColor = (result: string) => {
    if (result === 'player') return 'border-blue-700';
    if (result === 'banker') return 'border-red-700';
    if (result === 'tie') return 'border-green-700';
    return 'border-gray-500';
  };
  
  const getTextColor = (result: string) => {
    if (result === 'player') return 'text-blue-500';
    if (result === 'banker') return 'text-red-500';
    if (result === 'tie') return 'text-green-500';
    return 'text-gray-500';
  };
  
  const getLabel = (result: string) => {
    if (result === 'player') return 'P';
    if (result === 'banker') return 'B';
    if (result === 'tie') return 'T';
    return '';
  };
  
  // Generate Big Road display (main road map in baccarat)
  const renderBigRoad = () => {
    if (gameResults.length === 0) {
      return <div className="text-gray-500 p-4 text-center">No results yet</div>;
    }
    
    // Create a grid for the Big Road
    // This is a simplified version - actual baccarat big roads can be more complex
    const maxColumns = 12; // Maximum columns in our display
    const rows: Array<Array<{type: string, ties: number}>> = [];
    
    let currentColumn = 0;
    let currentRow = 0;
    let lastResult = '';
    
    // Process results to create the big road grid
    gameResults.forEach((result, index) => {
      if (result === 'tie') {
        // For ties, we mark them on the last non-tie result
        if (rows[currentRow] && rows[currentRow][currentColumn]) {
          rows[currentRow][currentColumn].ties++;
        }
        return;
      }
      
      if (result !== lastResult && lastResult !== '') {
        // Change of result, move to new column
        currentColumn++;
        
        // If we reach the max columns, move to a new row
        if (currentColumn >= maxColumns) {
          currentColumn = 0;
          currentRow++;
        }
      }
      
      // If this row doesn't exist yet, create it
      if (!rows[currentRow]) {
        rows[currentRow] = [];
      }
      
      // If there's an existing item in this position, move down
      if (result !== lastResult && rows[currentRow][currentColumn]) {
        currentRow++;
        if (!rows[currentRow]) {
          rows[currentRow] = [];
        }
      }
      
      // Add the result to the grid
      rows[currentRow][currentColumn] = { type: result, ties: 0 };
      lastResult = result;
    });
    
    // Render the big road grid
    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-12 gap-1 min-w-[480px]">
          {Array.from({ length: Math.min(8, Math.max(rows.length, 4)) }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="contents">
              {Array.from({ length: maxColumns }).map((_, colIndex) => {
                const cell = rows[rowIndex] && rows[rowIndex][colIndex];
                
                if (!cell) {
                  return (
                    <div 
                      key={`cell-${rowIndex}-${colIndex}`} 
                      className="aspect-square w-8 border border-gray-700 rounded-sm"
                    ></div>
                  );
                }
                
                return (
                  <div 
                    key={`cell-${rowIndex}-${colIndex}`} 
                    className={`aspect-square w-8 ${getBackgroundColor(cell.type)} flex items-center justify-center rounded-sm relative`}
                  >
                    {cell.ties > 0 && (
                      <span className="absolute top-0 right-0 text-[8px] font-bold bg-green-500 rounded-full w-3 h-3 flex items-center justify-center">
                        {cell.ties}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Generate the Big Eye Road (derived road used for pattern prediction)
  const renderBigEyeRoad = () => {
    if (gameResults.length < 3) {
      return <div className="text-gray-500 p-4 text-center">Need more results</div>;
    }
    
    // This is a simplified version of the Big Eye Road
    // In real baccarat, this is derived from the Big Road using specific rules
    const maxColumns = 12;
    const items: Array<{color: 'red' | 'blue'}> = [];
    
    // Generate a simplified derived road 
    // (actual baccarat roads use more complex pattern detection)
    for (let i = 2; i < gameResults.length; i++) {
      const pattern1 = gameResults[i] === gameResults[i-1];
      const pattern2 = gameResults[i-1] === gameResults[i-2];
      
      // Red/blue determination based on patterns
      if (pattern1 === pattern2) {
        items.push({ color: 'red' });
      } else {
        items.push({ color: 'blue' });
      }
      
      if (items.length >= maxColumns * 6) break;
    }
    
    // Display the derived road
    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-12 gap-1 min-w-[480px]">
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div key={`eye-row-${rowIndex}`} className="contents">
              {Array.from({ length: maxColumns }).map((_, colIndex) => {
                const index = rowIndex * maxColumns + colIndex;
                const cell = items[index];
                
                if (!cell) {
                  return (
                    <div 
                      key={`eye-cell-${rowIndex}-${colIndex}`} 
                      className="aspect-square w-6 border border-gray-700 rounded-sm"
                    ></div>
                  );
                }
                
                return (
                  <div 
                    key={`eye-cell-${rowIndex}-${colIndex}`} 
                    className={`aspect-square w-6 ${cell.color === 'red' ? 'bg-red-600' : 'bg-blue-600'} flex items-center justify-center rounded-sm`}
                  >
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Generate the Small Road (another derived road)
  const renderSmallRoad = () => {
    if (gameResults.length < 6) {
      return <div className="text-gray-500 p-4 text-center">Need more results</div>;
    }
    
    // This is a simplified version of the Small Road
    const maxColumns = 12;
    const items: Array<{color: 'red' | 'blue'}> = [];
    
    // Generate a simplified small road pattern
    for (let i = 5; i < gameResults.length; i++) {
      const isAlternating = gameResults[i] !== gameResults[i-2] && 
                             gameResults[i-3] !== gameResults[i-5];
      
      if (isAlternating) {
        items.push({ color: 'red' });
      } else {
        items.push({ color: 'blue' });
      }
      
      if (items.length >= maxColumns * 4) break;
    }
    
    // Display the small road
    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-12 gap-1 min-w-[480px]">
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <div key={`small-row-${rowIndex}`} className="contents">
              {Array.from({ length: maxColumns }).map((_, colIndex) => {
                const index = rowIndex * maxColumns + colIndex;
                const cell = items[index];
                
                if (!cell) {
                  return (
                    <div 
                      key={`small-cell-${rowIndex}-${colIndex}`} 
                      className="aspect-square w-5 border border-gray-700 rounded-sm"
                    ></div>
                  );
                }
                
                return (
                  <div 
                    key={`small-cell-${rowIndex}-${colIndex}`} 
                    className={`aspect-square w-5 ${cell.color === 'red' ? 'bg-red-600' : 'bg-blue-600'} flex items-center justify-center rounded-sm`}
                  >
                    <span className="w-1 h-1 rounded-full bg-white"></span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Simple sequential display of results
  const renderResults = () => {
    return (
      <div className="bg-gray-900 p-3 rounded">
        {gameResults.length === 0 ? (
          <span className="text-gray-500">No results yet</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {gameResults.map((result, index) => (
              <span 
                key={index}
                className={`inline-block py-1 px-2 rounded-sm text-sm ${getBackgroundColor(result)} font-bold`}
              >
                {getLabel(result)}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render the current selected view
  const renderSelectedView = () => {
    switch(viewType) {
      case VIEW_TYPES.BIG_ROAD:
        return renderBigRoad();
      case VIEW_TYPES.BIG_EYE_ROAD:
        return renderBigEyeRoad();
      case VIEW_TYPES.SMALL_ROAD:
        return renderSmallRoad();
      case VIEW_TYPES.RESULTS:
      default:
        return renderResults();
    }
  };
  
  // Tab button for view selection
  const TabButton = ({ type, label }: { type: string; label: string }) => (
    <button
      className={`px-2 py-1 text-xs font-medium ${viewType === type ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
      onClick={() => setViewType(type)}
    >
      {label}
    </button>
  );
  
  return (
    <div className="mb-3 bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex justify-between items-center border-b border-gray-700">
        <h3 className="font-bold text-lg">Game Road Map</h3>
      </div>
      
      <div className="p-2">
        <div className="flex space-x-1 justify-center mb-2 bg-gray-800 p-1 rounded-md">
          <TabButton type={VIEW_TYPES.RESULTS} label="Results" />
          <TabButton type={VIEW_TYPES.BIG_ROAD} label="Big Road" />
          <TabButton type={VIEW_TYPES.BIG_EYE_ROAD} label="Big Eye" />
          <TabButton type={VIEW_TYPES.SMALL_ROAD} label="Small" />
        </div>
        
        <div className="bg-gray-800 p-1 rounded-md min-h-[100px] overflow-auto max-h-[300px]">
          {renderSelectedView()}
        </div>
        
        <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[10px]">
          <div className={`border-t ${getBorderColor('player')} pt-0.5`}>
            <span className={`${getTextColor('player')} font-bold uppercase`}>P</span> 
            <span className="text-gray-400 ml-1">左</span>
          </div>
          <div className={`border-t ${getBorderColor('tie')} pt-0.5`}>
            <span className={`${getTextColor('tie')} font-bold uppercase`}>T</span>
            <span className="text-gray-400 ml-1">和</span>
          </div>
          <div className={`border-t ${getBorderColor('banker')} pt-0.5`}>
            <span className={`${getTextColor('banker')} font-bold uppercase`}>B</span>
            <span className="text-gray-400 ml-1">庄</span>
          </div>
        </div>
      </div>
    </div>
  );
}
