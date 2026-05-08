import { useBaccaratContext } from "@/context/BaccaratContext";

export default function ShoeTexturePanel() {
  const { shoeTexture } = useBaccaratContext();

  const typeColor = shoeTexture.type === 'CHOPPY' ? 'bg-cyan-800 text-cyan-200' : shoeTexture.type === 'STREAKY' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200';

  return (
    <div className="bg-black border border-gray-800">
      <div className="flex items-center px-2 py-1 border-b border-gray-800 gap-1">
        <span className="text-[8px] text-green-500">◆</span>
        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Shoe Texture</span>
      </div>
      <div className="flex items-center gap-4 px-3 py-2">
        <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase ${typeColor}`}>
          {shoeTexture.type}
        </span>
        <div className="flex items-center gap-4 text-center">
          <div>
            <div className="text-[8px] text-gray-500 uppercase">B Streak</div>
            <div className="text-sm font-black text-red-400">{shoeTexture.bStreak}</div>
          </div>
          <div>
            <div className="text-[8px] text-gray-500 uppercase">P Streak</div>
            <div className="text-sm font-black text-cyan-400">{shoeTexture.pStreak}</div>
          </div>
          <div>
            <div className="text-[8px] text-gray-500 uppercase">Chop</div>
            <div className={`text-sm font-black ${shoeTexture.chop ? 'text-yellow-400' : 'text-gray-600'}`}>
              {shoeTexture.chop ? 'YES' : 'NO'}
            </div>
          </div>
          <div>
            <div className="text-[8px] text-gray-500 uppercase">Dbl Chop</div>
            <div className={`text-sm font-black ${shoeTexture.dblChop ? 'text-yellow-400' : 'text-gray-600'}`}>
              {shoeTexture.dblChop ? 'YES' : 'NO'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
