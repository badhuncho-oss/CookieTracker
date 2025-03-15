interface UnitBettingModalProps {
  onClose: () => void;
}

export default function UnitBettingModal({ onClose }: UnitBettingModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Betting Guide</h3>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="mb-4">
          <h4 className="font-bold mb-2">Unit Betting System:</h4>
          <ul className="space-y-2">
            <li><span className="text-yellow-500 font-medium">x1:</span> Minimum bet (base unit)</li>
            <li><span className="text-yellow-500 font-medium">x3:</span> 3x your base unit</li>
            <li><span className="text-yellow-500 font-medium">x5:</span> 5x your base unit</li>
            <li><span className="text-yellow-500 font-medium">x7:</span> 7x your base unit</li>
            <li><span className="text-yellow-500 font-medium">x9:</span> 9x your base unit</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Example:</h4>
          <p>If your base unit is $25 and the recommendation is "Banker x3", bet $75 on Banker.</p>
        </div>
      </div>
    </div>
  );
}
