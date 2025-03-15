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
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showBettingSystem, setShowBettingSystem] = useState(false);

  return (
    <div className="bg-black text-white font-roboto min-h-screen">
      <div className="max-w-xl mx-auto p-4">
        <Header />
        <AppTitle 
          onHelpClick={() => setShowHelpGuide(true)} 
          onBettingSystemClick={() => setShowBettingSystem(true)}
        />
        <GameStatistics />
        <BettingRecommendation />
        <CardInput />
        <OutcomeButtons />
        <ResultsLog />
        <Footer />
      </div>
      
      {/* Help Modal */}
      {showHelpGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">NeuralBaccarat AI Help</h3>
              <button className="text-gray-400 hover:text-white" onClick={() => setShowHelpGuide(false)}>
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-1">Getting Started</h4>
                <p className="text-sm text-gray-300">
                  NeuralBaccarat AI uses advanced neural network algorithms to predict baccarat outcomes 
                  based on card patterns and historical data.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold mb-1">How to Use</h4>
                <ol className="text-sm text-gray-300 list-decimal pl-5 space-y-1">
                  <li>Set the card count (default is 416 for 8 decks)</li>
                  <li>Input card values as they appear in the game</li>
                  <li>Follow the bet recommendations</li>
                  <li>Record the outcome (Player, Banker, Tie)</li>
                  <li>Use the Betting System to track profits and adjust strategies</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-bold mb-1">Road Maps</h4>
                <p className="text-sm text-gray-300">
                  Click on the different tabs in the Game Road Map section to view various baccarat pattern visualizations:
                </p>
                <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                  <li>Results - Simple history of outcomes</li>
                  <li>Big Road - Traditional baccarat pattern display</li>
                  <li>Big Eye Road - Derived pattern for prediction</li>
                  <li>Small Road - Advanced pattern visualization</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-1">AI Modes</h4>
                <p className="text-sm text-gray-300">
                  Switch between Standard AI and Neural AI using the button in the Statistics section. 
                  Neural AI offers more advanced predictions with secondary bet recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Betting System Modal */}
      {showBettingSystem && (
        <UnitBettingModal onClose={() => setShowBettingSystem(false)} />
      )}
    </div>
  );
}
