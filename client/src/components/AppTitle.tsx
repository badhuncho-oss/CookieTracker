interface AppTitleProps {
  onHelpClick: () => void;
  onBettingSystemClick: () => void;
}

export default function AppTitle({ onHelpClick, onBettingSystemClick }: AppTitleProps) {
  return (
    <div className="bg-black p-3 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <svg className="w-12 h-12 mr-3 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4v7h-.25C2.8 11 2 11.8 2 12.75c0 .7.42 1.3 1 1.58V21h3v-6.67c.58-.28 1-.88 1-1.58C7 11.8 6.2 11 5.25 11H5V4zm15 0v7h.25c.97 0 1.75.78 1.75 1.75 0 .7-.42 1.3-1 1.58V21h-3v-6.67c-.58-.28-1-.88-1-1.58 0-.97.78-1.75 1.75-1.75H19V4z" />
            <path d="M14 8h-4v3h4zm0 5h-4v3h4zM9.5 8h-2v9h2zm7 0h-2v9h2z" />
          </svg>
          <div>
            <h2 className="font-montserrat font-bold text-2xl">NeuralBaccarat AI v1.5</h2>
            <p className="text-xs text-gray-400">Advanced baccarat prediction system</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-sm"
            onClick={onHelpClick}
          >
            Help
          </button>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-gray-700 rounded-md p-3 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-blue-300">Predictor777 Betting System</h3>
          <p className="text-xs text-gray-400">Configure betting units, methods, and track results</p>
        </div>
        <button 
          className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium flex items-center"
          onClick={onBettingSystemClick}
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Open System
        </button>
      </div>
    </div>
  );
}
