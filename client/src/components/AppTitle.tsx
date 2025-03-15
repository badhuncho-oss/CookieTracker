interface AppTitleProps {
  onHelpClick: () => void;
}

export default function AppTitle({ onHelpClick }: AppTitleProps) {
  return (
    <div className="bg-black p-3 mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <svg className="w-12 h-12 mr-3 text-red-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4v7h-.25C2.8 11 2 11.8 2 12.75c0 .7.42 1.3 1 1.58V21h3v-6.67c.58-.28 1-.88 1-1.58C7 11.8 6.2 11 5.25 11H5V4zm15 0v7h.25c.97 0 1.75.78 1.75 1.75 0 .7-.42 1.3-1 1.58V21h-3v-6.67c-.58-.28-1-.88-1-1.58 0-.97.78-1.75 1.75-1.75H19V4z" />
          <path d="M14 8h-4v3h4zm0 5h-4v3h4zM9.5 8h-2v9h2zm7 0h-2v9h2z" />
        </svg>
        <h2 className="font-montserrat font-bold text-2xl">NeuralBaccarat AI v1.5</h2>
      </div>
      <button 
        className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-sm"
        onClick={onHelpClick}
      >
        Help
      </button>
    </div>
  );
}
