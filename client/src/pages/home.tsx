import Header from "@/components/Header";
import AppTitle from "@/components/AppTitle";
import GameStatistics from "@/components/GameStatistics";
import BettingRecommendation from "@/components/BettingRecommendation";
import CardInput from "@/components/CardInput";
import OutcomeButtons from "@/components/OutcomeButtons";
import ResultsLog from "@/components/ResultsLog";
import Footer from "@/components/Footer";
import UnitBettingModal from "@/components/UnitBettingModal";
import { useState } from "react";

export default function Home() {
  const [showBettingGuide, setShowBettingGuide] = useState(false);

  return (
    <div className="bg-black text-white font-roboto min-h-screen">
      <div className="max-w-xl mx-auto p-4">
        <Header />
        <AppTitle onHelpClick={() => setShowBettingGuide(true)} />
        <GameStatistics />
        <BettingRecommendation />
        <CardInput />
        <OutcomeButtons />
        <ResultsLog />
        <Footer />
      </div>
      
      {showBettingGuide && (
        <UnitBettingModal onClose={() => setShowBettingGuide(false)} />
      )}
    </div>
  );
}
