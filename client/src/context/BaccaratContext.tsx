import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { getAdvancedPrediction } from "@/utils/prediction";
import { apiRequest } from "@/lib/queryClient";
import {
  computeNStrategies, computeMarkov, computeShoeVariance,
  computeShoeTexture, computeTieAnalysis, computeSignal, computeBacktesting,
  NStrategyEntry, MarkovData, ShoeVarianceData, ShoeTextureData,
  TieAnalysisData, SignalData, BacktestingData
} from "@/utils/analytics";

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
  totalCorrect: number;
  totalWrong: number;
  statistics: { playerWins: number; bankerWins: number; tieWins: number; totalPlays: number; };
  nStrategies: NStrategyEntry[];
  markov: MarkovData;
  shoeVariance: ShoeVarianceData;
  shoeTexture: ShoeTextureData;
  tieAnalysis: TieAnalysisData;
  signalData: SignalData;
  backtesting: BacktestingData;
  aiMode: 'standard' | 'advanced';
  setAiMode: (mode: 'standard' | 'advanced') => void;
  setCurrentCards: (cards: string) => void;
  incrementCardCount: () => void;
  decrementCardCount: () => void;
  recordOutcome: (outcome: 'player' | 'banker' | 'tie') => void;
  undoLastOutcome: () => void;
  resetGame: () => void;
}

const BaccaratContext = createContext<BaccaratContextType | undefined>(undefined);

export function BaccaratProvider({ children }: { children: ReactNode }) {
  const [cardCount, setCardCount] = useState<number>(416);
  const [playNumber, setPlayNumber] = useState<number>(0);
  const [currentCards, setCurrentCards] = useState<string>("");
  const [gameResults, setGameResults] = useState<string[]>([]);
  const [winStreak, setWinStreak] = useState<number>(0);
  const [lossStreak, setLossStreak] = useState<number>(0);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);
  const [totalWrong, setTotalWrong] = useState<number>(0);
  const [aiMode, setAiMode] = useState<'standard' | 'advanced'>('advanced');
  const [statistics, setStatistics] = useState({ playerWins: 0, bankerWins: 0, tieWins: 0, totalPlays: 0 });
  const [recommendation, setRecommendation] = useState<BetRecommendation>({ type: '', text: 'NO BET', units: 0, confidence: 50 });
  const [secondaryRecommendation, setSecondaryRecommendation] = useState<BetRecommendation | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/game-state');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setCardCount(data.cardCount || 416);
            setPlayNumber(data.playNumber || 0);
            const results = data.gameResults || [];
            setGameResults(results);
            updateStatistics(results);
            updateRecommendations(results, "");
          }
        }
      } catch (e) { console.error("Failed to load game state:", e); }
    };
    load();
  }, []);

  const updateStatistics = (results: string[]) => {
    setStatistics({
      playerWins: results.filter(r => r === 'player').length,
      bankerWins: results.filter(r => r === 'banker').length,
      tieWins: results.filter(r => r === 'tie').length,
      totalPlays: results.length
    });
  };

  const updateRecommendations = (results: string[], cards: string) => {
    if (results.length < 1) {
      setRecommendation({ type: 'banker', text: 'BANKER', units: 1, confidence: 57 });
      setSecondaryRecommendation(null);
      return;
    }
    const prediction = getAdvancedPrediction(results, cards);
    const pt = prediction.primaryBet.type;
    setRecommendation({
      type: pt,
      text: pt ? pt.toUpperCase() : 'NO BET',
      units: prediction.primaryBet.units,
      confidence: prediction.primaryBet.confidence
    });
    if (prediction.secondaryBet && prediction.secondaryBet.type) {
      const st = prediction.secondaryBet.type;
      setSecondaryRecommendation({
        type: st,
        text: st.toUpperCase(),
        units: prediction.secondaryBet.units,
        confidence: prediction.secondaryBet.confidence
      });
    } else {
      setSecondaryRecommendation(null);
    }
  };

  useEffect(() => {
    if (gameResults.length > 0) updateRecommendations(gameResults, currentCards);
  }, [currentCards, aiMode]);

  useEffect(() => {
    if (playNumber > 0) {
      apiRequest('POST', '/api/game-state', { cardCount, playNumber, gameResults }).catch(() => {});
    }
  }, [cardCount, playNumber, gameResults]);

  const nStrategies = useMemo(() => computeNStrategies(gameResults), [gameResults]);
  const markov = useMemo(() => computeMarkov(gameResults), [gameResults]);
  const shoeVariance = useMemo(() => computeShoeVariance(gameResults), [gameResults]);
  const shoeTexture = useMemo(() => computeShoeTexture(gameResults), [gameResults]);
  const tieAnalysis = useMemo(() => computeTieAnalysis(gameResults), [gameResults]);
  const signalData = useMemo(() => computeSignal(gameResults, nStrategies), [gameResults, nStrategies]);
  const backtesting = useMemo(() => computeBacktesting(gameResults, 600), [gameResults]);

  const recordOutcome = (outcome: 'player' | 'banker' | 'tie') => {
    const predicted = recommendation.type;
    const won = predicted !== '' && predicted === outcome;
    const isPush = outcome === 'tie' && predicted !== 'tie';
    if (predicted !== '') {
      if (won) {
        setTotalCorrect(p => p + 1);
        setWinStreak(p => p + 1);
        setLossStreak(0);
      } else if (!isPush) {
        setTotalWrong(p => p + 1);
        setLossStreak(p => p + 1);
        setWinStreak(0);
      }
    }
    const newResults = [...gameResults, outcome];
    setGameResults(newResults);
    updateStatistics(newResults);
    setPlayNumber(p => p + 1);
    const cardsUsed = currentCards.length;
    setCardCount(p => Math.max(0, p - cardsUsed));
    updateRecommendations(newResults, "");
    setCurrentCards("");
  };

  const undoLastOutcome = () => {
    if (gameResults.length === 0) return;
    const newResults = gameResults.slice(0, -1);
    setGameResults(newResults);
    updateStatistics(newResults);
    setPlayNumber(p => Math.max(0, p - 1));
    updateRecommendations(newResults, "");
  };

  const resetGame = () => {
    setCardCount(416); setPlayNumber(0); setCurrentCards("");
    setGameResults([]); setWinStreak(0); setLossStreak(0);
    setTotalCorrect(0); setTotalWrong(0);
    setStatistics({ playerWins: 0, bankerWins: 0, tieWins: 0, totalPlays: 0 });
    setRecommendation({ type: '', text: 'NO BET', units: 0, confidence: 50 });
    setSecondaryRecommendation(null);
    apiRequest('POST', '/api/reset-game', {}).catch(() => {});
  };

  return (
    <BaccaratContext.Provider value={{
      cardCount, playNumber, currentCards, gameResults, recommendation, secondaryRecommendation,
      winStreak, lossStreak, totalCorrect, totalWrong, statistics,
      nStrategies, markov, shoeVariance, shoeTexture, tieAnalysis, signalData, backtesting,
      aiMode, setAiMode, setCurrentCards,
      incrementCardCount: () => setCardCount(p => p + 1),
      decrementCardCount: () => setCardCount(p => Math.max(0, p - 1)),
      recordOutcome, undoLastOutcome, resetGame
    }}>
      {children}
    </BaccaratContext.Provider>
  );
}

export function useBaccaratContext() {
  const ctx = useContext(BaccaratContext);
  if (!ctx) throw new Error("useBaccaratContext must be used within a BaccaratProvider");
  return ctx;
}
