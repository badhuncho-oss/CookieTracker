export default function Header() {
  return (
    <header className="flex items-center justify-between mb-1 border-b border-gray-700 pb-1">
      <div className="flex items-center">
        <svg className="w-4 h-4 mr-1 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 4a2 2 0 00-2-2H9a2 2 0 00-2 2v18l5-3 5 3V4z" />
        </svg>
        <h1 className="font-bold text-base text-yellow-500">IAMLUCKYINBACCARAT777</h1>
      </div>
      <div className="text-xs text-gray-400">
        v3.1
      </div>
    </header>
  );
}
