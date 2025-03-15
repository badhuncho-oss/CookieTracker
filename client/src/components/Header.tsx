export default function Header() {
  return (
    <header className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
      <div className="flex items-center">
        <svg className="w-8 h-8 mr-2 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 4a2 2 0 00-2-2H9a2 2 0 00-2 2v18l5-3 5 3V4z" />
        </svg>
        <h1 className="font-montserrat font-bold text-xl">Baccarat777</h1>
      </div>
      <div className="flex space-x-2">
        <button className="text-sm bg-gray-800 hover:bg-gray-700 py-1 px-2 rounded" aria-label="Minimize">
          <i className="fas fa-minus"></i>
        </button>
        <button className="text-sm bg-gray-800 hover:bg-gray-700 py-1 px-2 rounded" aria-label="Maximize">
          <i className="fas fa-square"></i>
        </button>
        <button className="text-sm bg-red-800 hover:bg-red-700 py-1 px-2 rounded" aria-label="Close">
          <i className="fas fa-times"></i>
        </button>
      </div>
    </header>
  );
}
