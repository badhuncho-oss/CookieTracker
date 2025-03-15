/**
 * Simple prediction algorithm for Baccarat
 * This is a basic implementation that can be enhanced later
 */

interface PredictionResult {
  type: 'player' | 'banker' | 'tie' | '';
  units: number;
  confidence: number;
}

export function getPrediction(results: string[]): PredictionResult {
  // Default result if we don't have enough data
  if (results.length < 3) {
    return {
      type: results.length > 0 ? getAlternatingOutcome(results[results.length - 1]) : 'banker',
      units: 1,
      confidence: 60
    };
  }
  
  // Count occurrences
  const counts = {
    player: 0,
    banker: 0,
    tie: 0
  };
  
  // Analyze last 10 results (or fewer if we don't have 10)
  const recentResults = results.slice(-10);
  recentResults.forEach(result => {
    counts[result as keyof typeof counts]++;
  });
  
  // Detect patterns
  const lastResult = results[results.length - 1];
  const secondLastResult = results[results.length - 2];
  const thirdLastResult = results[results.length - 3];
  
  // Pattern: Three of the same in a row
  if (lastResult === secondLastResult && secondLastResult === thirdLastResult) {
    // Bet on the opposite
    const oppositeOutcome = getAlternatingOutcome(lastResult);
    return {
      type: oppositeOutcome,
      units: 5,
      confidence: 80
    };
  }
  
  // Pattern: Alternating pattern
  if (lastResult !== secondLastResult && secondLastResult === thirdLastResult) {
    // Continue the alternating pattern
    return {
      type: lastResult,
      units: 3,
      confidence: 75
    };
  }
  
  // Pattern: Predominant outcome in recent results
  const totalOutcomes = recentResults.length;
  const playerRatio = counts.player / totalOutcomes;
  const bankerRatio = counts.banker / totalOutcomes;
  const tieRatio = counts.tie / totalOutcomes;
  
  // If one outcome is significantly more common
  if (playerRatio > 0.6) {
    return {
      type: 'player',
      units: calculateUnits(playerRatio),
      confidence: Math.round(playerRatio * 100)
    };
  }
  
  if (bankerRatio > 0.6) {
    return {
      type: 'banker',
      units: calculateUnits(bankerRatio),
      confidence: Math.round(bankerRatio * 100)
    };
  }
  
  if (tieRatio > 0.3) { // Lower threshold for tie because it's less common
    return {
      type: 'tie',
      units: 1, // Always bet minimum on tie due to high payout
      confidence: Math.round(tieRatio * 100)
    };
  }
  
  // Default to the least common outcome if no clear pattern
  if (playerRatio < bankerRatio && playerRatio < tieRatio) {
    return {
      type: 'player',
      units: 1,
      confidence: 65
    };
  } else if (bankerRatio < playerRatio && bankerRatio < tieRatio) {
    return {
      type: 'banker',
      units: 1,
      confidence: 65
    };
  } else {
    // When all else fails, bet on banker (slight house edge advantage)
    return {
      type: 'banker',
      units: 1,
      confidence: 60
    };
  }
}

function getAlternatingOutcome(lastResult: string): 'player' | 'banker' | 'tie' {
  if (lastResult === 'player') return 'banker';
  if (lastResult === 'banker') return 'player';
  return Math.random() > 0.5 ? 'player' : 'banker'; // Random choice for tie
}

function calculateUnits(ratio: number): number {
  // Convert ratio to units between 1-9
  if (ratio > 0.85) return 9;
  if (ratio > 0.8) return 7;
  if (ratio > 0.7) return 5;
  if (ratio > 0.6) return 3;
  return 1;
}
