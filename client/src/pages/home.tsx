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
      <div className="max-w-4xl mx-auto p-2">
        <Header />
        <AppTitle 
          onHelpClick={() => setShowHelpGuide(true)} 
          onBettingSystemClick={() => setShowBettingSystem(true)}
        />
        
        {/* Two column layout for smaller screen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left column */}
          <div>
            <BettingRecommendation />
            <CardInput />
            <OutcomeButtons />
          </div>
          
          {/* Right column */}
          <div>
            <GameStatistics />
            <ResultsLog />
          </div>
        </div>
        
        <Footer />
      </div>
      
      {/* Help Modal */}
      {showHelpGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-4 rounded-lg max-w-md max-h-[90vh] overflow-y-auto w-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold">NeuralBaccarat AI Help</h3>
              <button className="text-gray-400 hover:text-white" onClick={() => setShowHelpGuide(false)}>
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-bold mb-1 text-sm">Getting Started</h4>
                <p className="text-xs text-gray-300">
                  NeuralBaccarat AI uses advanced neural network algorithms to predict baccarat outcomes 
                  based on card patterns and historical data.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold mb-1 text-sm">How to Use</h4>
                <ol className="text-xs text-gray-300 list-decimal pl-4 space-y-0.5">
                  <li>Set the card count (default is 416 for 8 decks)</li>
                  <li>Input card values as they appear in the game</li>
                  <li>Follow the bet recommendations</li>
                  <li>Record the outcome (Player, Banker, Tie)</li>
                  <li>Use the Betting System to track profits and adjust strategies</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-bold mb-1 text-sm">Road Maps</h4>
                <p className="text-xs text-gray-300">
                  Click on the different tabs in the Game Road Map section to view various baccarat pattern visualizations:
                </p>
                <ul className="text-xs text-gray-300 list-disc pl-4 space-y-0.5">
                  <li>Results - Simple history of outcomes</li>
                  <li>Big Road - Traditional baccarat pattern display</li>
                  <li>Big Eye Road - Derived pattern for prediction</li>
                  <li>Small Road - Advanced pattern visualization</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-1 text-sm">AI Modes</h4>
                <p className="text-xs text-gray-300">
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
