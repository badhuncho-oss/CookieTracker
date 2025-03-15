import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getPrediction } from "@/utils/prediction";
import { apiRequest } from "@/lib/queryClient";

interface BaccaratContextType {
  cardCount: number;
  playNumber: number;
  currentCards: string;
  gameResults: string[];
  recommendation: {
    type: 'player' | 'banker' | 'tie' | '';
    text: string;
    confidence: number;
  };
  setCurrentCards: (cards: string) => void;
  incrementCardCount: () => void;
  decrementCardCount: () => void;
  recordOutcome: (outcome: 'player' | 'banker' | 'tie') => void;
  resetGame: () => void;
}

const BaccaratContext = createContext<BaccaratContextType | undefined>(undefined);

export function BaccaratProvider({ children }: { children: ReactNode }) {
  // Game state
  const [cardCount, setCardCount] = useState<number>(416);
  const [playNumber, setPlayNumber] = useState<number>(0);
  const [currentCards, setCurrentCards] = useState<string>("");
  const [gameResults, setGameResults] = useState<string[]>([]);
  
  // Recommendation state
  const [recommendation, setRecommendation] = useState<BaccaratContextType['recommendation']>({
    type: '',
    text: '',
    confidence: 70,
  });
  
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
            updateRecommendation(data.gameResults || []);
          }
        }
      } catch (error) {
        console.error("Failed to load game state:", error);
      }
    };
    
    loadGameState();
  }, []);
  
  const updateRecommendation = (results: string[]) => {
    const { type, units, confidence } = getPrediction(results);
    
    let text = '';
    if (type) {
      const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
      text = units > 0 ? `${typeCapitalized} x${units}` : typeCapitalized;
    }
    
    setRecommendation({
      type,
      text,
      confidence,
    });
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
    // Record the outcome
    const newResults = [...gameResults, outcome];
    setGameResults(newResults);
    
    // Update play number
    setPlayNumber(prev => prev + 1);
    
    // Update card count (decrease by number of cards used)
    const cardsUsed = currentCards.length;
    setCardCount(prev => Math.max(0, prev - cardsUsed));
    
    // Clear current cards
    setCurrentCards("");
    
    // Update recommendation
    updateRecommendation(newResults);
  };
  
  const resetGame = () => {
    setCardCount(416);
    setPlayNumber(0);
    setCurrentCards("");
    setGameResults([]);
    setRecommendation({
      type: '',
      text: '',
      confidence: 70,
    });
    
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
      setCurrentCards,
      incrementCardCount,
      decrementCardCount,
      recordOutcome,
      resetGame,
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
