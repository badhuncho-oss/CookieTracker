interface AppTitleProps {
  onHelpClick: () => void;
  onBettingSystemClick: () => void;
}

export default function AppTitle({ onHelpClick, onBettingSystemClick }: AppTitleProps) {
  return (
    <div className="bg-gray-900 rounded-md border border-gray-800 p-2 mb-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <button 
            className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-0.5 rounded"
            onClick={onHelpClick}
          >
            ?
          </button>
          <button 
            className="text-xs bg-blue-800 hover:bg-blue-700 text-white px-2 py-0.5 rounded"
            onClick={onBettingSystemClick}
          >
            Settings
          </button>
        </div>
        <div className="text-[10px] text-gray-400">
          Predictor777 Neural System
        </div>
      </div>
    </div>
  );
}
