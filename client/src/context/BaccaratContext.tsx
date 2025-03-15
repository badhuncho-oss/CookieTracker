import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getPrediction, getAdvancedPrediction } from "@/utils/prediction";
import { apiRequest } from "@/lib/queryClient";

interface BetRecommendation {
  type: 'player' | 'banker' | 'tie' | '';
  text: string;
  units: number;
  confidence: number;
}

interface BaccaratContextType {
  cardCount: number;
  playNumber: number;
  currentCards: string;
  gameResults: string[];
  recommendation: BetRecommendation;
  secondaryRecommendation: BetRecommendation | null;
  winStreak: number;
  lossStreak: number;
  statistics: {
    playerWins: number;
    bankerWins: number;
    tieWins: number;
    totalPlays: number;
  };
  setCurrentCards: (cards: string) => void;
  incrementCardCount: () => void;
  decrementCardCount: () => void;
  recordOutcome: (outcome: 'player' | 'banker' | 'tie') => void;
  resetGame: () => void;
  aiMode: 'standard' | 'advanced';
  setAiMode: (mode: 'standard' | 'advanced') => void;
}

const BaccaratContext = createContext<BaccaratContextType | undefined>(undefined);

export function BaccaratProvider({ children }: { children: ReactNode }) {
  // Game state
  const [cardCount, setCardCount] = useState<number>(416);
  const [playNumber, setPlayNumber] = useState<number>(0);
  const [currentCards, setCurrentCards] = useState<string>("");
  const [gameResults, setGameResults] = useState<string[]>([]);
  const [winStreak, setWinStreak] = useState<number>(0);
  const [lossStreak, setLossStreak] = useState<number>(0);
  const [aiMode, setAiMode] = useState<'standard' | 'advanced'>('advanced');
  
  // Statistics
  const [statistics, setStatistics] = useState({
    playerWins: 0,
    bankerWins: 0,
    tieWins: 0,
    totalPlays: 0
  });
  
  // Recommendation state
  const [recommendation, setRecommendation] = useState<BetRecommendation>({
    type: '',
    text: '',
    units: 0,
    confidence: 70,
  });
  
  const [secondaryRecommendation, setSecondaryRecommendation] = useState<BetRecommendation | null>(null);
  
  // Save/Load state from backend
  useEffect(() => {
    const loadGameState = async () => {
      try {
        const response = await fetch('/api/game-state');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setCardCount(data.cardCount || 416);
            setPlayNumber(data.playNumber || 0);
            setGameResults(data.gameResults || []);
            updateRecommendations(data.gameResults || [], "");
            updateStatistics(data.gameResults || []);
          }
        }
      } catch (error) {
        console.error("Failed to load game state:", error);
      }
    };
    
    loadGameState();
  }, []);
  
  // Update statistics whenever game results change
  const updateStatistics = (results: string[]) => {
    const stats = {
      playerWins: 0,
      bankerWins: 0,
      tieWins: 0,
      totalPlays: results.length
    };
    
    results.forEach(result => {
      if (result === 'player') stats.playerWins++;
      else if (result === 'banker') stats.bankerWins++;
      else if (result === 'tie') stats.tieWins++;
    });
    
    setStatistics(stats);
  };
  
  // Update win/loss streak based on last recommendation and outcome
  const updateStreak = (outcome: string) => {
    if (recommendation.type === '') {
      // Reset streaks if there was no recommendation
      setWinStreak(0);
      setLossStreak(0);
      return;
    }
    
    const lastRecommendation = recommendation.type;
    if (outcome === lastRecommendation) {
      // Won
      setWinStreak(prev => prev + 1);
      setLossStreak(0);
    } else if (outcome === 'tie' && secondaryRecommendation?.type === 'tie') {
      // Won on secondary bet
      setWinStreak(prev => prev + 1);
      setLossStreak(0);
    } else {
      // Lost
      setLossStreak(prev => prev + 1);
      setWinStreak(0);
    }
  };
  
  const updateRecommendations = (results: string[], currentCardValues: string) => {
    if (aiMode === 'advanced') {
      // Use advanced prediction
      const prediction = getAdvancedPrediction(results, currentCardValues);
      
      // Primary recommendation
      const primaryType = prediction.primaryBet.type;
      const primaryUnits = prediction.primaryBet.units;
      const primaryConfidence = prediction.primaryBet.confidence;
      
      let primaryText = '';
      if (primaryType) {
        const typeCapitalized = primaryType.charAt(0).toUpperCase() + primaryType.slice(1);
        primaryText = primaryUnits > 0 ? `${typeCapitalized} x${primaryUnits}` : typeCapitalized;
      }
      
      setRecommendation({
        type: primaryType,
        text: primaryText,
        units: primaryUnits,
        confidence: primaryConfidence,
      });
      
      // Secondary recommendation (if any)
      if (prediction.secondaryBet) {
        const secondaryType = prediction.secondaryBet.type;
        const secondaryUnits = prediction.secondaryBet.units;
        const secondaryConfidence = prediction.secondaryBet.confidence;
        
        let secondaryText = '';
        if (secondaryType) {
          const typeCapitalized = secondaryType.charAt(0).toUpperCase() + secondaryType.slice(1);
          secondaryText = secondaryUnits > 0 ? `${typeCapitalized} x${secondaryUnits}` : typeCapitalized;
        }
        
        setSecondaryRecommendation({
          type: secondaryType,
          text: secondaryText,
          units: secondaryUnits,
          confidence: secondaryConfidence,
        });
      } else {
        setSecondaryRecommendation(null);
      }
    } else {
      // Use standard prediction (for backward compatibility)
      const { type, units, confidence } = getPrediction(results);
      
      let text = '';
      if (type) {
        const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
        text = units > 0 ? `${typeCapitalized} x${units}` : typeCapitalized;
      }
      
      setRecommendation({
        type,
        text,
        units,
        confidence,
      });
      
      setSecondaryRecommendation(null);
    }
  };
  
  const saveGameState = async () => {
    try {
      await apiRequest('POST', '/api/game-state', {
        cardCount,
        playNumber,
        gameResults,
      });
    } catch (error) {
      console.error("Failed to save game state:", error);
    }
  };
  
  // Effect to save state when it changes
  useEffect(() => {
    if (playNumber > 0) {
      saveGameState();
    }
  }, [cardCount, playNumber, gameResults]);
  
  const incrementCardCount = () => {
    setCardCount(prev => prev + 1);
  };
  
  const decrementCardCount = () => {
    if (cardCount > 0) {
      setCardCount(prev => prev - 1);
    }
  };
  
  const recordOutcome = (outcome: 'player' | 'banker' | 'tie') => {
    // Update streak
    updateStreak(outcome);
    
    // Record the outcome
    const newResults = [...gameResults, outcome];
    setGameResults(newResults);
    
    // Update statistics
    updateStatistics(newResults);
    
    // Update play number
    setPlayNumber(prev => prev + 1);
    
    // Update card count (decrease by number of cards used)
    const cardsUsed = currentCards.length;
    setCardCount(prev => Math.max(0, prev - cardsUsed));
    
    // Get the next prediction
    updateRecommendations(newResults, "");
    
    // Clear current cards
    setCurrentCards("");
  };
  
  // Update recommendations when card values change
  useEffect(() => {
    if (gameResults.length > 0) {
      updateRecommendations(gameResults, currentCards);
    }
  }, [currentCards, aiMode]);
  
  const resetGame = () => {
    setCardCount(416);
    setPlayNumber(0);
    setCurrentCards("");
    setGameResults([]);
    setWinStreak(0);
    setLossStreak(0);
    setStatistics({
      playerWins: 0,
      bankerWins: 0,
      tieWins: 0,
      totalPlays: 0
    });
    setRecommendation({
      type: '',
      text: '',
      units: 0,
      confidence: 70,
    });
    setSecondaryRecommendation(null);
    
    // Reset on backend
    apiRequest('POST', '/api/reset-game', {});
  };
  
  return (
    <BaccaratContext.Provider value={{
      cardCount,
      playNumber,
      currentCards,
      gameResults,
      recommendation,
      secondaryRecommendation,
      winStreak,
      lossStreak,
      statistics,
      setCurrentCards,
      incrementCardCount,
      decrementCardCount,
      recordOutcome,
      resetGame,
      aiMode,
      setAiMode,
    }}>
      {children}
    </BaccaratContext.Provider>
  );
}

export function useBaccaratContext() {
  const context = useContext(BaccaratContext);
  if (context === undefined) {
    throw new Error("useBaccaratContext must be used within a BaccaratProvider");
  }
  return context;
}
