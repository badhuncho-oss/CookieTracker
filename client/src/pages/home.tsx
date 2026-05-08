import Header from "@/components/Header";
import RecommendationPanel from "@/components/RecommendationPanel";
import ProbabilitiesPanel from "@/components/ProbabilitiesPanel";
import AIPerformancePanel from "@/components/AIPerformancePanel";
import SignalBar from "@/components/SignalBar";
import DominantPatternPanel from "@/components/DominantPatternPanel";
import SignalMatrixPanel from "@/components/SignalMatrixPanel";
import NStrategyCorePanel from "@/components/NStrategyCorePanel";
import NStrategyRawPanel from "@/components/NStrategyRawPanel";
import MarkovChainPanel from "@/components/MarkovChainPanel";
import ShoeVariancePanel from "@/components/ShoeVariancePanel";
import ShoeTexturePanel from "@/components/ShoeTexturePanel";
import BacktestingPanel from "@/components/BacktestingPanel";
import EnterPlaysPanel from "@/components/EnterPlaysPanel";
import ShoeHistoryPanel from "@/components/ShoeHistoryPanel";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen" style={{ fontSize: '10px', fontFamily: 'monospace' }}>
      <div className="max-w-full">
        <Header />
        {/* Row 1: Rec | Prob | AI Perf */}
        <div className="grid grid-cols-3 border-b border-gray-800">
          <div className="border-r border-gray-800"><RecommendationPanel /></div>
          <div className="border-r border-gray-800"><ProbabilitiesPanel /></div>
          <div><AIPerformancePanel /></div>
        </div>
        {/* Signal Bar */}
        <SignalBar />
        {/* Row 2: Dominant Pattern */}
        <DominantPatternPanel />
        {/* Row 3: Signal Matrix */}
        <SignalMatrixPanel />
        {/* Row 4: N-Core | N-Raw */}
        <div className="grid grid-cols-2 border-b border-gray-800">
          <div className="border-r border-gray-800"><NStrategyCorePanel /></div>
          <div><NStrategyRawPanel /></div>
        </div>
        {/* Row 5: Markov | Shoe Variance */}
        <div className="grid grid-cols-2 border-b border-gray-800">
          <div className="border-r border-gray-800"><MarkovChainPanel /></div>
          <div><ShoeVariancePanel /></div>
        </div>
        {/* Row 6: Shoe Texture */}
        <div className="border-b border-gray-800"><ShoeTexturePanel /></div>
        {/* Row 7: Backtesting */}
        <div className="border-b border-gray-800"><BacktestingPanel /></div>
        {/* Row 8: Enter Plays | Shoe History */}
        <div className="grid grid-cols-3">
          <div className="border-r border-gray-800"><EnterPlaysPanel /></div>
          <div className="col-span-2"><ShoeHistoryPanel /></div>
        </div>
      </div>
    </div>
  );
}
