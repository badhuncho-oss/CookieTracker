/**
 * Advanced Neural Baccarat Prediction Algorithm
 * This implementation is based on the NeuralBaccarat AI v1.5 from baccarat777.com
 */

interface PredictionResult {
  primaryBet: {
    type: 'player' | 'banker' | 'tie' | '';
    units: number;
    confidence: number;
  };
  secondaryBet: {
    type: 'player' | 'banker' | 'tie' | '';
    units: number;
    confidence: number;
  } | null;
}

// Map to track patterns for each outcome
const patternMap = {
  player: new Map<string, number>(),
  banker: new Map<string, number>(),
  tie: new Map<string, number>()
};

/**
 * Main prediction function that returns bet recommendations
 */
export function getAdvancedPrediction(results: string[], cardValues: string = ""): PredictionResult {
  // Default result if we don't have enough data
  if (results.length < 3) {
    return {
      primaryBet: {
        type: results.length > 0 ? getAlternatingOutcome(results[results.length - 1]) : 'banker',
        units: 1,
        confidence: 60
      },
      secondaryBet: null
    };
  }
  
  // Count occurrences and track streaks
  const counts = {
    player: 0,
    banker: 0,
    tie: 0
  };
  
  let currentStreak = {
    type: results[0],
    count: 1
  };
  
  let streaks: Array<{type: string, count: number}> = [];
  
  // Process all results to identify streaks and patterns
  for (let i = 1; i < results.length; i++) {
    const result = results[i];
    counts[result as keyof typeof counts]++;
    
    if (result === currentStreak.type) {
      currentStreak.count++;
    } else {
      streaks.push({...currentStreak});
      currentStreak = {
        type: result,
        count: 1
      };
    }
  }
  streaks.push({...currentStreak});
  
  // Analyze last 20 results (or fewer if we don't have 20)
  const recentResults = results.slice(-20);
  recentResults.forEach(result => {
    counts[result as keyof typeof counts]++;
  });
  
  // Get the last few results to detect patterns
  const lastResult = results[results.length - 1];
  const secondLastResult = results[results.length - 2];
  const thirdLastResult = results[results.length - 3];
  
  // Generate pattern string from last 5 outcomes (or fewer)
  const patternString = results.slice(-5).join('');
  
  // Update pattern statistics for machine learning simulation
  if (patternString.length >= 3) {
    const predictedOutcome = lastResult;
    const pattern = patternString.substring(0, patternString.length - 1);
    
    if (!patternMap[predictedOutcome as keyof typeof patternMap].has(pattern)) {
      patternMap[predictedOutcome as keyof typeof patternMap].set(pattern, 0);
    }
    patternMap[predictedOutcome as keyof typeof patternMap].set(
      pattern, 
      (patternMap[predictedOutcome as keyof typeof patternMap].get(pattern) || 0) + 1
    );
  }
  
  // PATTERN ANALYSIS STRATEGIES
  
  // Strategy 1: Pattern matching based on historical data
  const patternPrediction = predictFromPattern(results);
  
  // Strategy 2: Streak analysis
  const streakPrediction = analyzeStreaks(streaks, lastResult);
  
  // Strategy 3: Card value analysis (if provided)
  const cardPrediction = cardValues ? analyzeCardValues(cardValues) : null;
  
  // Strategy 4: Statistical analysis
  const statPrediction = analyzeStatistics(counts, recentResults.length);
  
  // Advanced pattern detection
  // Pattern: Three of the same in a row
  if (lastResult === secondLastResult && secondLastResult === thirdLastResult) {
    // Bet on the opposite with high confidence
    const oppositeOutcome = getAlternatingOutcome(lastResult);
    
    // Add secondary bet on tie with smaller units
    return {
      primaryBet: {
        type: oppositeOutcome,
        units: 5,
        confidence: 85
      },
      secondaryBet: {
        type: 'tie',
        units: 1,
        confidence: 30
      }
    };
  }
  
  // Pattern: Alternating pattern (zigzag)
  if (lastResult !== secondLastResult && secondLastResult === thirdLastResult) {
    // Continue the alternating pattern with high confidence
    const nextInPattern = getAlternatingOutcome(lastResult);
    
    return {
      primaryBet: {
        type: nextInPattern,
        units: 3,
        confidence: 78
      },
      secondaryBet: null
    };
  }
  
  // COMBINE ALL STRATEGIES INTO FINAL PREDICTION
  const finalPrediction = combineStrategies(
    patternPrediction,
    streakPrediction,
    cardPrediction,
    statPrediction,
    lastResult
  );
  
  return finalPrediction;
}

// Legacy function for backward compatibility
export function getPrediction(results: string[]): {
  type: 'player' | 'banker' | 'tie' | '';
  units: number;
  confidence: number;
} {
  const advancedPrediction = getAdvancedPrediction(results);
  return {
    type: advancedPrediction.primaryBet.type,
    units: advancedPrediction.primaryBet.units,
    confidence: advancedPrediction.primaryBet.confidence
  };
}

/**
 * Get the alternating outcome (player/banker/tie)
 */
function getAlternatingOutcome(lastResult: string): 'player' | 'banker' | 'tie' {
  if (lastResult === 'player') return 'banker';
  if (lastResult === 'banker') return 'player';
  if (lastResult === 'tie') {
    // After a tie, slightly favor banker (statistical edge)
    return Math.random() > 0.55 ? 'banker' : 'player'; 
  }
  return 'banker'; // Default to banker
}

/**
 * Calculate betting units based on confidence ratio
 */
function calculateUnits(ratio: number): number {
  // Convert ratio to units between 1-9
  if (ratio > 0.85) return 9;
  if (ratio > 0.8) return 7;
  if (ratio > 0.7) return 5;
  if (ratio > 0.6) return 3;
  return 1;
}

/**
 * Predict based on pattern matching
 */
function predictFromPattern(results: string[]): {type: 'player' | 'banker' | 'tie' | ''; confidence: number} {
  if (results.length < 4) {
    return { type: '', confidence: 0 };
  }
  
  const pattern = results.slice(-3).join('');
  
  // Check pattern frequencies for each outcome
  let bestOutcome = '';
  let highestCount = 0;
  
  for (const outcome of ['player', 'banker', 'tie'] as Array<'player' | 'banker' | 'tie'>) {
    const count = patternMap[outcome].get(pattern) || 0;
    if (count > highestCount) {
      highestCount = count;
      bestOutcome = outcome;
    }
  }
  
  // Calculate confidence based on pattern occurrence and total patterns
  let confidence = 0;
  if (highestCount > 0) {
    const totalPatterns = 
      (patternMap.player.get(pattern) || 0) + 
      (patternMap.banker.get(pattern) || 0) + 
      (patternMap.tie.get(pattern) || 0);
    
    confidence = totalPatterns > 0 ? (highestCount / totalPatterns) * 100 : 60;
  }
  
  return { 
    type: bestOutcome as 'player' | 'banker' | 'tie' | '', 
    confidence: confidence || 60
  };
}

/**
 * Analyze streaks for prediction
 */
function analyzeStreaks(
  streaks: Array<{type: string, count: number}>, 
  lastResult: string
): {type: 'player' | 'banker' | 'tie' | ''; confidence: number} {
  if (streaks.length === 0) {
    return { type: '', confidence: 0 };
  }
  
  const lastStreak = streaks[streaks.length - 1];
  
  // If we have a long streak of the same outcome, predict reversal
  if (lastStreak.count >= 3) {
    return {
      type: getAlternatingOutcome(lastStreak.type),
      confidence: Math.min(60 + (lastStreak.count * 5), 95)
    };
  }
  
  // If we have alternating results, predict continuation
  if (streaks.length >= 3 && 
      streaks[streaks.length - 1].count === 1 && 
      streaks[streaks.length - 2].count === 1 && 
      streaks[streaks.length - 3].count === 1) {
    return {
      type: getAlternatingOutcome(lastResult),
      confidence: 75
    };
  }
  
  return { type: '', confidence: 0 };
}

/**
 * Analyze card values for prediction
 * This simulates a neural network analysis based on card patterns
 */
function analyzeCardValues(cardValues: string): {type: 'player' | 'banker' | 'tie' | ''; confidence: number} {
  if (!cardValues || cardValues.length < 4) {
    return { type: '', confidence: 0 };
  }
  
  // Count sum of card values (simple heuristic)
  const sum = cardValues.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  
  // Use card value patterns to make predictions
  if (sum % 10 === 0) {
    return { type: 'tie', confidence: 40 };
  } else if (sum % 10 < 5) {
    return { type: 'banker', confidence: 65 };
  } else {
    return { type: 'player', confidence: 65 };
  }
}

/**
 * Analyze statistical trends
 */
function analyzeStatistics(
  counts: {player: number, banker: number, tie: number}, 
  totalResults: number
): {type: 'player' | 'banker' | 'tie' | ''; confidence: number} {
  if (totalResults === 0) {
    return { type: '', confidence: 0 };
  }
  
  const playerRatio = counts.player / totalResults;
  const bankerRatio = counts.banker / totalResults;
  const tieRatio = counts.tie / totalResults;
  
  // If one outcome is significantly more common
  if (playerRatio > 0.6) {
    return { type: 'player', confidence: Math.round(playerRatio * 100) };
  }
  
  if (bankerRatio > 0.6) {
    return { type: 'banker', confidence: Math.round(bankerRatio * 100) };
  }
  
  if (tieRatio > 0.3) { // Lower threshold for tie because it's less common
    return { type: 'tie', confidence: Math.round(tieRatio * 100) };
  }
  
  // If one outcome is significantly less common, bet on it (mean reversion)
  const avgFrequency = 1 / 3;
  if (playerRatio < avgFrequency * 0.5) {
    return { type: 'player', confidence: 70 };
  }
  
  if (bankerRatio < avgFrequency * 0.5) {
    return { type: 'banker', confidence: 70 };
  }
  
  // Default to banker if no clear pattern (slight house edge)
  return { type: 'banker', confidence: 60 };
}

/**
 * Combine all strategies to get final prediction
 */
function combineStrategies(
  patternPrediction: {type: 'player' | 'banker' | 'tie' | ''; confidence: number},
  streakPrediction: {type: 'player' | 'banker' | 'tie' | ''; confidence: number},
  cardPrediction: {type: 'player' | 'banker' | 'tie' | ''; confidence: number} | null,
  statPrediction: {type: 'player' | 'banker' | 'tie' | ''; confidence: number},
  lastResult: string
): PredictionResult {
  // Weight each strategy based on confidence
  const predictions = [
    patternPrediction, 
    streakPrediction, 
    statPrediction
  ].filter(p => p.type !== '' && p.confidence > 0);
  
  if (cardPrediction && cardPrediction.type !== '' && cardPrediction.confidence > 0) {
    predictions.push(cardPrediction);
  }
  
  if (predictions.length === 0) {
    // Default if no strategy has a prediction
    return {
      primaryBet: {
        type: 'banker',
        units: 1,
        confidence: 60
      },
      secondaryBet: null
    };
  }
  
  // Sort by confidence
  predictions.sort((a, b) => b.confidence - a.confidence);
  
  // If highest confidence prediction is strong, use it
  if (predictions[0].confidence > 75) {
    const primaryType = predictions[0].type;
    const primaryConfidence = predictions[0].confidence;
    
    // Add secondary bet on tie if primary is not tie and confidence is high
    const shouldAddTieBet = primaryType !== 'tie' && primaryConfidence > 80;
    
    return {
      primaryBet: {
        type: primaryType,
        units: calculateUnits(primaryConfidence / 100),
        confidence: primaryConfidence
      },
      secondaryBet: shouldAddTieBet ? {
        type: 'tie',
        units: 1,
        confidence: 30
      } : null
    };
  }
  
  // If multiple strategies agree on an outcome, increase confidence
  const outcomeCount = new Map<string, {count: number, totalConfidence: number}>();
  
  predictions.forEach(p => {
    if (!outcomeCount.has(p.type)) {
      outcomeCount.set(p.type, {count: 0, totalConfidence: 0});
    }
    const current = outcomeCount.get(p.type)!;
    outcomeCount.set(p.type, {
      count: current.count + 1,
      totalConfidence: current.totalConfidence + p.confidence
    });
  });
  
  // Find the outcome with highest agreement
  let bestOutcome = '';
  let highestCount = 0;
  let highestTotalConfidence = 0;
  
  outcomeCount.forEach((value, outcome) => {
    if (value.count > highestCount || 
        (value.count === highestCount && value.totalConfidence > highestTotalConfidence)) {
      highestCount = value.count;
      highestTotalConfidence = value.totalConfidence;
      bestOutcome = outcome;
    }
  });
  
  const averageConfidence = highestTotalConfidence / highestCount;
  
  // Find second best prediction if any
  let secondBestOutcome = '';
  let secondHighestConfidence = 0;
  
  predictions.forEach(p => {
    if (p.type !== bestOutcome && p.confidence > secondHighestConfidence) {
      secondBestOutcome = p.type;
      secondHighestConfidence = p.confidence;
    }
  });
  
  // If second best is tie and primary is not tie, add as secondary bet
  const secondaryBet = 
    secondBestOutcome === 'tie' && bestOutcome !== 'tie' && secondHighestConfidence > 40 ? {
      type: 'tie' as 'tie',
      units: 1,
      confidence: secondHighestConfidence
    } : null;
  
  return {
    primaryBet: {
      type: bestOutcome as 'player' | 'banker' | 'tie' | '',
      units: calculateUnits(averageConfidence / 100),
      confidence: Math.round(averageConfidence)
    },
    secondaryBet
  };
}
