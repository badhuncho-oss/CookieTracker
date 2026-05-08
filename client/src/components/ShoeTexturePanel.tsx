import { useBaccaratContext } from "@/context/BaccaratContext";
export default function ShoeTexturePanel() {
  const { shoeTexture: st } = useBaccaratContext();
  const tc = st.type === 'DRAGON' ? 'text-purple-300 bg-purple-900' : st.type === 'CHOPPY' ? 'text-cyan-300 bg-cyan-900' : st.type === 'STREAKY' ? 'text-red-300 bg-red-900' : 'text-green-300 bg-green-900';
  return (
    <div className="flex items-center gap-2 px-1.5 py-0.5">
      <span className="text-[7px] text-gray-500 font-bold">TEXTURE</span>
      <span className={`text-[7px] font-bold px-1 rounded uppercase ${tc}`}>{st.type}</span>
      <span className="text-[7px] text-gray-600">{st.textureConfidence}%</span>
      <span className="text-gray-700">|</span>
      <span className="text-[7px] text-gray-500">B×<span className="text-red-400 font-bold">{st.bStreak}</span></span>
      <span className="text-[7px] text-gray-500">P×<span className="text-cyan-400 font-bold">{st.pStreak}</span></span>
      <span className={`text-[7px] font-bold ${st.chop ? 'text-yellow-400' : 'text-gray-700'}`}>CHOP{st.chop ? '✓' : '✗'}</span>
      <span className={`text-[7px] font-bold ${st.dblChop ? 'text-yellow-400' : 'text-gray-700'}`}>2CH{st.dblChop ? '✓' : '✗'}</span>
      {st.dragonStreak && <span className="text-[7px] text-purple-400 font-bold">🐉DRAG</span>}
    </div>
  );
}
