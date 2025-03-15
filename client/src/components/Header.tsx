export default function Header() {
  return (
    <header className="flex items-center justify-between mb-1 border-b border-gray-700 pb-1">
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-1 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 4a2 2 0 00-2-2H9a2 2 0 00-2 2v18l5-3 5 3V4z" />
        </svg>
        <h1 className="font-bold text-base text-yellow-500">Baccarat777 AI</h1>
      </div>
      <div className="text-xs text-gray-400">
        Neural Predictor v3.1
      </div>
    </header>
  );
}
