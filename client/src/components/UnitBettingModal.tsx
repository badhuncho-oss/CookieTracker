import { useState } from "react";
import { useBaccaratContext } from "@/context/BaccaratContext";

interface UnitBettingModalProps {
  onClose: () => void;
}

export default function UnitBettingModal({ onClose }: UnitBettingModalProps) {
  const { 
    bettingMode, 
    setBettingMode, 
    isHighBetsMode, 
    setHighBetsMode,
    bettingHistory,
    winStreak,
    lossStreak
  } = useBaccaratContext();
  
  const [activeTab, setActiveTab] = useState<'units' | 'methods' | 'history'>('units');
  const [baseUnit, setBaseUnit] = useState<number>(1);
  
  // Handle betting mode change
  const handleBettingModeChange = (mode: 'standard' | 'method345' | 'method321') => {
    setBettingMode(mode);
  };
  
  // Handle high bets mode toggle
  const handleHighBetsModeToggle = () => {
    setHighBetsMode(!isHighBetsMode);
  };
  
  // Calculate betting statistics
  const calculateStatistics = () => {
    if (bettingHistory.length === 0) {
      return { totalNet: 0, winRate: 0 };
    }
    
    let totalNet = 0;
    let wins = 0;
    
    bettingHistory.forEach(item => {
      if (item.result === 'win') {
        wins++;
        totalNet += parseInt(item.chipChange.replace('+', ''));
      } else {
        totalNet -= parseInt(item.chipChange.replace('-', ''));
      }
    });
    
    const winRate = Math.round((wins / bettingHistory.length) * 100);
    
    return { totalNet, winRate };
  };
  
  const { totalNet, winRate } = calculateStatistics();
  
  // Generate betting system explanation based on mode
  const getBettingModeExplanation = () => {
    switch(bettingMode) {
      case 'method345':
        return (
          <div className="mb-4 text-sm">
            <p className="mb-2">With Method 3-4-5:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>Start with 3 units</li>
              <li>After each win, increase by 1 unit (up to max 5)</li>
              <li>After each loss, decrease by 1 unit (down to min 1)</li>
              <li>Current recommended units: <span className="font-bold text-yellow-400">
                {winStreak > 0 
                  ? Math.min(5, winStreak + 2) 
                  : lossStreak > 0 
                    ? Math.max(1, 3 - lossStreak) 
                    : 3}
              </span></li>
            </ul>
          </div>
        );
      
      case 'method321':
        return (
          <div className="mb-4 text-sm">
            <p className="mb-2">With Method 3-2-1:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>Start with 3 units</li>
              <li>After each win, decrease by 1 unit (down to min 1)</li>
              <li>After each loss, increase by 1 unit (up to max 5)</li>
              <li>Current recommended units: <span className="font-bold text-yellow-400">
                {winStreak > 0 
                  ? Math.max(1, 3 - winStreak) 
                  : lossStreak > 0 
                    ? Math.min(5, lossStreak + 2) 
                    : 3}
              </span></li>
            </ul>
          </div>
        );
      
      default:
        return (
          <div className="mb-4 text-sm">
            <p className="mb-2">With Standard Method:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>Units are based on prediction confidence</li>
              <li>Higher confidence = higher unit recommendation</li>
              <li>Balanced approach for consistent results</li>
              <li>Current streak: <span className="font-bold">
                {winStreak > 0 
                  ? <span className="text-green-500">{winStreak}W</span> 
                  : lossStreak > 0 
                    ? <span className="text-red-500">{lossStreak}L</span> 
                    : 'None'}
              </span></li>
            </ul>
          </div>
        );
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Predictor777 Betting System</h3>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>
            ✕
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-4">
          <button 
            className={`px-4 py-2 ${activeTab === 'units' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('units')}
          >
            Unit Betting
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'methods' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('methods')}
          >
            Betting Methods
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'history' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
        
        {/* Unit Betting Tab */}
        {activeTab === 'units' && (
          <div>
            <div className="bg-gray-800 p-3 rounded-md mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold">High Bets Mode:</h4>
                <div 
                  className={`w-12 h-6 flex items-center rounded-full px-1 cursor-pointer ${isHighBetsMode ? 'bg-green-500 justify-end' : 'bg-gray-600 justify-start'}`}
                  onClick={handleHighBetsModeToggle}
                >
                  <div className="bg-white w-4 h-4 rounded-full"></div>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Enables more aggressive betting strategies with up to 9 units per bet
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Your Base Unit Value:</label>
              <div className="flex items-center">
                <span className="bg-gray-800 px-3 py-2 rounded-l-md text-gray-400">$</span>
                <input 
                  type="number" 
                  className="bg-gray-800 px-3 py-2 rounded-r-md w-full"
                  min="1" 
                  value={baseUnit}
                  onChange={(e) => setBaseUnit(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Set your base betting unit (e.g., $1, $5, $25)</p>
            </div>
          
            <h4 className="font-bold mb-2">Unit Betting System:</h4>
            <ul className="space-y-2 mb-4">
              <li className="flex justify-between">
                <span><span className="text-yellow-500 font-medium">x1:</span> Minimum bet</span>
                <span className="font-bold">${baseUnit * 1}</span>
              </li>
              <li className="flex justify-between">
                <span><span className="text-yellow-500 font-medium">x3:</span> Standard bet</span>
                <span className="font-bold">${baseUnit * 3}</span>
              </li>
              <li className="flex justify-between">
                <span><span className="text-yellow-500 font-medium">x5:</span> Higher confidence</span>
                <span className="font-bold">${baseUnit * 5}</span>
              </li>
              {isHighBetsMode && (
                <>
                  <li className="flex justify-between">
                    <span><span className="text-yellow-500 font-medium">x7:</span> High confidence</span>
                    <span className="font-bold">${baseUnit * 7}</span>
                  </li>
                  <li className="flex justify-between">
                    <span><span className="text-yellow-500 font-medium">x9:</span> Maximum bet</span>
                    <span className="font-bold">${baseUnit * 9}</span>
                  </li>
                </>
              )}
            </ul>
            
            <div className="bg-gray-800 p-3 rounded-md mt-4">
              <h4 className="font-bold mb-1">Current Settings:</h4>
              <p className="text-sm">
                <span className="text-gray-400">Method: </span>
                <span className="font-medium">
                  {bettingMode === 'standard' ? 'Standard' : 
                   bettingMode === 'method345' ? 'Method 3-4-5' : 'Method 3-2-1'}
                </span>
              </p>
              <p className="text-sm">
                <span className="text-gray-400">Base Unit: </span>
                <span className="font-medium">${baseUnit}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-400">High Bets Mode: </span>
                <span className={`font-medium ${isHighBetsMode ? 'text-green-500' : 'text-red-500'}`}>
                  {isHighBetsMode ? 'Enabled' : 'Disabled'}
                </span>
              </p>
            </div>
          </div>
        )}
        
        {/* Betting Methods Tab */}
        {activeTab === 'methods' && (
          <div>
            <div className="space-y-4">
              <div 
                className={`p-3 rounded-md border-2 cursor-pointer ${bettingMode === 'standard' ? 'border-blue-500 bg-gray-800' : 'border-gray-700 bg-gray-900'}`}
                onClick={() => handleBettingModeChange('standard')}
              >
                <h4 className="font-bold mb-1">Standard Method</h4>
                <p className="text-sm text-gray-400">
                  Balanced approach with standard unit recommendations based on pattern analysis.
                </p>
              </div>
              
              <div 
                className={`p-3 rounded-md border-2 cursor-pointer ${bettingMode === 'method345' ? 'border-blue-500 bg-gray-800' : 'border-gray-700 bg-gray-900'}`}
                onClick={() => handleBettingModeChange('method345')}
              >
                <h4 className="font-bold mb-1">Method 3-4-5</h4>
                <p className="text-sm text-gray-400">
                  Increases one unit for each victory and subtracts one unit for each loss. More aggressive approach.
                </p>
              </div>
              
              <div 
                className={`p-3 rounded-md border-2 cursor-pointer ${bettingMode === 'method321' ? 'border-blue-500 bg-gray-800' : 'border-gray-700 bg-gray-900'}`}
                onClick={() => handleBettingModeChange('method321')}
              >
                <h4 className="font-bold mb-1">Method 3-2-1</h4>
                <p className="text-sm text-gray-400">
                  Subtracts one unit for each victory and increases one unit for each loss. More conservative approach.
                </p>
              </div>
            </div>
            
            <div className="mt-4 bg-gray-800 p-3 rounded-md">
              {getBettingModeExplanation()}
            </div>
            
            <div className="mt-4 p-3 bg-gray-700 rounded-md">
              <p className="text-sm text-yellow-400 font-bold">Important Note:</p>
              <p className="text-xs text-gray-300">
                For optimal results, we strongly recommend reading the user manual in detail and following the recommendations
                and indications that we provide.
              </p>
            </div>
          </div>
        )}
        
        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="mb-3">
              <h4 className="font-bold mb-1">Recent Betting History</h4>
              <p className="text-xs text-gray-400">Last 15 bets are displayed</p>
            </div>
            
            <div className="overflow-hidden rounded-md border border-gray-700 mb-4">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300">Play #</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300">Bet</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300">Result</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300">Chips</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {bettingHistory.length > 0 ? (
                    bettingHistory.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">{item.play}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">{item.bet}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          <span className={item.result === 'win' ? 'text-green-500' : 'text-red-500'}>
                            {item.result.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          <span className={item.chipChange.includes('+') ? 'text-green-500' : 'text-red-500'}>
                            {item.chipChange}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                        No betting history yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-3 rounded-md">
                <h5 className="text-sm text-gray-400 mb-1">Total Net</h5>
                <div className={`text-xl font-bold ${totalNet >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalNet >= 0 ? '+' : ''}{totalNet} units
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {totalNet >= 0 ? 'Profit' : 'Loss'} of ${Math.abs(totalNet * baseUnit)}
                </p>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-md">
                <h5 className="text-sm text-gray-400 mb-1">Win Rate</h5>
                <div className="text-xl font-bold">
                  {winRate}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Based on {bettingHistory.length} total bets
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
