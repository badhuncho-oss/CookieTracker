import { useBaccaratContext } from "@/context/BaccaratContext";

export default function ShoeTexturePanel() {
  const { shoeTexture } = useBaccaratContext();

  const typeColor =
    shoeTexture.type === 'DRAGON' ? 'bg-purple-900 text-purple-200 border-purple-600' :
    shoeTexture.type === 'CHOPPY' ? 'bg-cyan-900 text-cyan-200 border-cyan-700' :
    shoeTexture.type === 'STREAKY' ? 'bg-red-900 text-red-200 border-red-700' :
    'bg-green-900 text-green-200 border-green-700';

  return (
    <div className="bg-black border border-gray-800">
      <div className="flex items-center px-2 py-1 border-b border-gray-800 gap-1">
        <span className="text-[8px] text-green-500">◆</span>
        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Shoe Texture</span>
      </div>
      <div className="flex items-center gap-4 px-3 py-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase border ${typeColor}`}>
            {shoeTexture.type}
          </span>
          <span className="text-[8px] text-gray-600">{shoeTexture.textureConfidence}% conf</span>
        </div>
        <div className="flex items-center gap-5 text-center">
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
            <div className={`text-sm font-black ${shoeTexture.chop ? 'text-yellow-400' : 'text-gray-700'}`}>
              {shoeTexture.chop ? 'YES' : 'NO'}
            </div>
          </div>
          <div>
            <div className="text-[8px] text-gray-500 uppercase">Dbl Chop</div>
            <div className={`text-sm font-black ${shoeTexture.dblChop ? 'text-yellow-400' : 'text-gray-700'}`}>
              {shoeTexture.dblChop ? 'YES' : 'NO'}
            </div>
          </div>
          <div>
            <div className="text-[8px] text-gray-500 uppercase">Dragon</div>
            <div className={`text-sm font-black ${shoeTexture.dragonStreak ? 'text-purple-400' : 'text-gray-700'}`}>
              {shoeTexture.dragonStreak ? 'YES' : 'NO'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
