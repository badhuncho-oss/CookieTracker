// ─── Core History ───────────────────────────────────────────────────────────
export function getCoreHistory(results: string[]): string[] {
  return results.filter(r => r === 'banker' || r === 'player');
}

function labelOf(r: string) {
  if (r === 'player') return 'P';
  if (r === 'banker') return 'B';
  if (r === 'tie') return 'T';
  return '?';
}

// ─── N-Strategy Types ────────────────────────────────────────────────────────
export interface NStrategyEntry {
  level: string;
  pattern: string;
  recommendation: 'PLAYER' | 'BANKER' | 'TIE' | '';
  confidence: number;
  trend: string;
  category: 'REV' | 'TIE' | 'STK' | '';
  lowSamples?: number;
}

// Uses CORE history only (no Ties)
export function computeNStrategies(results: string[]): NStrategyEntry[] {
  const core = getCoreHistory(results);
  const entries: NStrategyEntry[] = [];
  for (let n = 1; n <= 4; n++) {
    if (core.length <= n) {
      entries.push({ level: `N${n}`, pattern: '-', recommendation: '', confidence: 0, trend: '', category: '', lowSamples: 0 });
      continue;
    }
    const currentPattern = core.slice(-n);
    const patternStr = currentPattern.map(labelOf).join('-');
    const outcomes = { player: 0, banker: 0 };
    let samples = 0;
    for (let i = 0; i <= core.length - n - 1; i++) {
      const matches = currentPattern.every((r, idx) => r === core[i + idx]);
      if (matches) {
        const next = core[i + n];
        if (next === 'player') outcomes.player++;
        else if (next === 'banker') outcomes.banker++;
        samples++;
      }
    }
    if (samples === 0) {
      entries.push({ level: `N${n}`, pattern: patternStr, recommendation: '', confidence: 0, trend: '', category: '', lowSamples: 0 });
      continue;
    }
    let bestOutcome: 'player' | 'banker' = outcomes.banker >= outcomes.player ? 'banker' : 'player';
    const bestCount = outcomes[bestOutcome];
    const confidence = Math.round((bestCount / samples) * 100);
    let trend = '↓↓';
    if (confidence >= 75) trend = '↑↑';
    else if (confidence >= 65) trend = '↑';
    else if (confidence >= 55) trend = '↓';
    const lastInPattern = currentPattern[currentPattern.length - 1];
    const category: 'REV' | 'STK' = bestOutcome === lastInPattern ? 'STK' : 'REV';
    entries.push({
      level: `N${n}`, pattern: patternStr,
      recommendation: bestOutcome === 'player' ? 'PLAYER' : 'BANKER',
      confidence, trend, category,
      lowSamples: samples < 5 ? samples : undefined
    });
  }
  return entries;
}

// N-Strategy Raw — includes Tie for raw disturbance signals
export function computeNStrategiesRaw(results: string[]): NStrategyEntry[] {
  const entries: NStrategyEntry[] = [];
  for (let n = 1; n <= 3; n++) {
    if (results.length <= n) {
      entries.push({ level: `N${n}`, pattern: '-', recommendation: '', confidence: 0, trend: '', category: '', lowSamples: 0 });
      continue;
    }
    const currentPattern = results.slice(-n);
    const patternStr = currentPattern.map(labelOf).join('-');
    const outcomes = { player: 0, banker: 0, tie: 0 };
    let samples = 0;
    for (let i = 0; i <= results.length - n - 1; i++) {
      const matches = currentPattern.every((r, idx) => r === results[i + idx]);
      if (matches) {
        const next = results[i + n];
        if (next === 'player') outcomes.player++;
        else if (next === 'banker') outcomes.banker++;
        else if (next === 'tie') outcomes.tie++;
        samples++;
      }
    }
    if (samples === 0) {
      entries.push({ level: `N${n}`, pattern: patternStr, recommendation: '', confidence: 0, trend: '', category: '', lowSamples: 0 });
      continue;
    }
    let bestOutcome: 'player' | 'banker' | 'tie' = 'banker';
    let bestCount = outcomes.banker;
    if (outcomes.player > bestCount) { bestOutcome = 'player'; bestCount = outcomes.player; }
    if (outcomes.tie > bestCount) { bestOutcome = 'tie'; bestCount = outcomes.tie; }
    const confidence = Math.round((bestCount / samples) * 100);
    let trend = '↓↓';
    if (confidence >= 75) trend = '↑↑';
    else if (confidence >= 65) trend = '↑';
    else if (confidence >= 55) trend = '↓';
    const lastInPattern = currentPattern[currentPattern.length - 1];
    let category: 'REV' | 'TIE' | 'STK' | '' = '';
    if (bestOutcome === 'tie') category = 'TIE';
    else if (bestOutcome === lastInPattern) category = 'STK';
    else category = 'REV';
    const rec = bestOutcome === 'player' ? 'PLAYER' : bestOutcome === 'banker' ? 'BANKER' : 'TIE';
    entries.push({ level: `N${n}`, pattern: patternStr, recommendation: rec, confidence, trend, category, lowSamples: samples < 5 ? samples : undefined });
  }
  return entries;
}

// ─── Dominant Pattern Regime ──────────────────────────────────────────────────
export type RegimeStatus = 'STABLE' | 'ANOMALY' | 'BROKEN' | 'TRANSITION WATCH' | 'PATTERN CONFIRMED' | 'LOW DATA';
export type PatternLevel = 'N1' | 'N2' | 'N3' | 'N4+' | 'UNKNOWN';

export interface DominantPatternData {
  initialPattern: PatternLevel;
  initialPatternRange: string;
  currentPattern: PatternLevel;
  candidatePattern: PatternLevel | '';
  breakHandNumber: number;
  breakType: string;
  validTransitionPath: string;
  confirmationCount: number;
  confirmationNeeded: number;
  last10CoreReads: PatternLevel[];
  regimeStatus: RegimeStatus;
  betPermission: 'BET ALLOWED' | 'NO BET: TRANSITION UNCONFIRMED' | 'NO BET: LOW DATA';
}

// Detect pattern period for a window of core (B/P) results
function detectPeriod(core: string[], windowStart: number, windowEnd: number): PatternLevel {
  const window = core.slice(windowStart, windowEnd);
  if (window.length < 4) return 'UNKNOWN';

  for (const period of [1, 2, 3, 4]) {
    const total = window.length - period;
    if (total < 2) continue;
    let matches = 0;
    for (let i = period; i < window.length; i++) {
      if (window[i] === window[i - period]) matches++;
    }
    const ratio = matches / total;
    if (ratio >= 0.72) {
      if (period === 1) return 'N1';
      if (period === 2) return 'N2';
      if (period === 3) return 'N3';
      return 'N4+';
    }
  }
  return 'N1'; // fallback
}

const VALID_TRANSITIONS: Record<PatternLevel, PatternLevel[]> = {
  'N1': ['N2'],
  'N2': ['N1'],
  'N3': ['N2'],
  'N4+': ['N3'],
  'UNKNOWN': [],
};

function isValidTransition(from: PatternLevel, to: PatternLevel): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function computeDominantPattern(results: string[]): DominantPatternData {
  const core = getCoreHistory(results);

  if (core.length < 4) {
    return {
      initialPattern: 'UNKNOWN', initialPatternRange: '-', currentPattern: 'UNKNOWN',
      candidatePattern: '', breakHandNumber: 0, breakType: '-', validTransitionPath: '-',
      confirmationCount: 0, confirmationNeeded: 2, last10CoreReads: [],
      regimeStatus: 'LOW DATA', betPermission: 'NO BET: LOW DATA'
    };
  }

  // Compute rolling pattern level for each window of 4
  const reads: PatternLevel[] = [];
  for (let i = 3; i < core.length; i++) {
    const start = Math.max(0, i - 7);
    reads.push(detectPeriod(core, start, i + 1));
  }

  // Initial pattern = mode of first segment (up to first clear break)
  const initialWindow = reads.slice(0, Math.min(8, reads.length));
  const initialPattern = modeOf(initialWindow) as PatternLevel;
  const initialPatternRange = `Hands 1–${Math.min(8, core.length)}`;

  // Find first break
  let breakHandNumber = 0;
  let breakType = '-';
  for (let i = 1; i < reads.length; i++) {
    if (reads[i] !== initialPattern) {
      breakHandNumber = i + 4;
      breakType = `${initialPattern}→${reads[i]}`;
      break;
    }
  }

  // Current regime from recent reads
  const recentReads = reads.slice(-10);
  const currentPattern = modeOf(recentReads.slice(-5)) as PatternLevel;
  const last10CoreReads = recentReads;

  // Candidate = most common pattern in last 5 reads if different from current
  const lastFive = reads.slice(-5);
  const candidate = modeOf(lastFive) as PatternLevel;
  const candidatePattern = candidate !== currentPattern && isValidTransition(currentPattern, candidate) ? candidate : '';

  // Count anomalies in last 5 reads
  const anomalyCount = lastFive.filter(r => r !== currentPattern).length;

  // Confirmation count = consecutive candidate appearances
  let confirmationCount = 0;
  for (let i = reads.length - 1; i >= 0 && reads[i] === candidate && candidate !== ''; i--) {
    confirmationCount++;
    if (confirmationCount >= 2) break;
  }

  // Determine regime
  let regimeStatus: RegimeStatus = 'STABLE';
  let betPermission: DominantPatternData['betPermission'] = 'BET ALLOWED';

  if (core.length < 10) {
    regimeStatus = 'LOW DATA';
    betPermission = 'NO BET: LOW DATA';
  } else if (candidatePattern && confirmationCount >= 2) {
    regimeStatus = 'PATTERN CONFIRMED';
    betPermission = 'BET ALLOWED';
  } else if (candidatePattern && anomalyCount >= 3) {
    regimeStatus = 'TRANSITION WATCH';
    betPermission = 'NO BET: TRANSITION UNCONFIRMED';
  } else if (anomalyCount >= 2) {
    regimeStatus = 'BROKEN';
    betPermission = 'NO BET: TRANSITION UNCONFIRMED';
  } else if (anomalyCount === 1) {
    regimeStatus = 'ANOMALY';
    betPermission = 'BET ALLOWED';
  }

  const validTransitionPath = candidatePattern
    ? (isValidTransition(currentPattern, candidatePattern) ? `${currentPattern} → ${candidatePattern}` : 'INVALID')
    : `${currentPattern} (stable)`;

  return {
    initialPattern,
    initialPatternRange,
    currentPattern,
    candidatePattern,
    breakHandNumber,
    breakType,
    validTransitionPath,
    confirmationCount,
    confirmationNeeded: 2,
    last10CoreReads,
    regimeStatus,
    betPermission
  };
}

function modeOf(arr: string[]): string {
  if (arr.length === 0) return 'UNKNOWN';
  const freq: Record<string, number> = {};
  let best = arr[0], bestCount = 0;
  for (const v of arr) {
    freq[v] = (freq[v] || 0) + 1;
    if (freq[v] > bestCount) { best = v; bestCount = freq[v]; }
  }
  return best;
}

// ─── Markov Chain (adaptive depth) ───────────────────────────────────────────
export interface MarkovData {
  currentPattern: string;
  bankerPct: number;
  playerPct: number;
  tiePct: number;
  signalLabel: string;
  signalLevel: string;
  sampleCount: number;
  activeDepth: number;
}

export function computeMarkov(results: string[]): MarkovData {
  const core = getCoreHistory(results);
  if (core.length < 2) {
    return { currentPattern: '-', bankerPct: 45, playerPct: 45, tiePct: 10, signalLabel: '-', signalLevel: 'N1', sampleCount: 0, activeDepth: 1 };
  }

  // Try adaptive depth N4→N3→N2→N1 using core
  for (const depth of [4, 3, 2, 1]) {
    if (core.length <= depth) continue;
    const currentPat = core.slice(-depth);
    const outcomes = { banker: 0, player: 0 };
    let samples = 0;
    for (let i = 0; i <= core.length - depth - 1; i++) {
      if (currentPat.every((r, idx) => r === core[i + idx])) {
        const next = core[i + depth];
        if (next === 'banker') outcomes.banker++;
        else if (next === 'player') outcomes.player++;
        samples++;
      }
    }
    if (samples >= 3) {
      const total = samples;
      const tieRatio = results.filter(r => r === 'tie').length / Math.max(results.length, 1);
      const tPct = Math.round(tieRatio * 100);
      const remain = 100 - tPct;
      const bPct = Math.round((outcomes.banker / total) * remain);
      const pPct = remain - bPct;
      let signalLabel = bPct >= pPct ? '↑-B' : '↑-P';
      return {
        currentPattern: currentPat.map(labelOf).join('-'),
        bankerPct: bPct, playerPct: pPct, tiePct: tPct,
        signalLabel, signalLevel: `N${depth}`, sampleCount: samples, activeDepth: depth
      };
    }
  }

  // Fallback: simple last result
  const last = core[core.length - 1];
  const tPct = Math.round((results.filter(r => r === 'tie').length / Math.max(results.length, 1)) * 100);
  return {
    currentPattern: labelOf(last),
    bankerPct: last === 'banker' ? 55 : 40, playerPct: last === 'player' ? 55 : 40, tiePct: tPct,
    signalLabel: last === 'banker' ? '↑-B' : '↑-P', signalLevel: 'N1', sampleCount: 1, activeDepth: 1
  };
}

// ─── Shoe Variance ────────────────────────────────────────────────────────────
export interface ShoeVarianceData {
  bankerCount: number; bankerPct: number;
  playerCount: number; playerPct: number;
  tieCount: number; tiePct: number;
  variance: number; zScore: number;
  volatility: 'LOW' | 'MEDIUM' | 'HIGH';
  trend: 'NEUTRAL' | 'BANKER' | 'PLAYER' | 'TIE';
  currentStreak: string;
}

export function computeShoeVariance(results: string[]): ShoeVarianceData {
  const total = results.length;
  if (total === 0) {
    return { bankerCount: 0, bankerPct: 0, playerCount: 0, playerPct: 0, tieCount: 0, tiePct: 0, variance: 0, zScore: 0, volatility: 'LOW', trend: 'NEUTRAL', currentStreak: '-' };
  }
  const bCount = results.filter(r => r === 'banker').length;
  const pCount = results.filter(r => r === 'player').length;
  const tCount = results.filter(r => r === 'tie').length;
  const bPct = Math.round((bCount / total) * 100);
  const pPct = Math.round((pCount / total) * 100);
  const tPct = Math.round((tCount / total) * 100);
  const expectedB = total * 0.4586;
  const expectedP = total * 0.4462;
  const expectedT = total * 0.0952;
  const variance = Math.round(Math.pow(bCount - expectedB, 2) + Math.pow(pCount - expectedP, 2) + Math.pow(tCount - expectedT, 2));
  const zScore = total > 0 ? Math.round(((bCount - expectedB) / Math.sqrt(Math.max(expectedB, 1))) * 100) / 100 : 0;
  let volatility: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (variance > 100) volatility = 'HIGH';
  else if (variance > 40) volatility = 'MEDIUM';
  const recent = results.slice(-10);
  let trend: 'NEUTRAL' | 'BANKER' | 'PLAYER' | 'TIE' = 'NEUTRAL';
  if (recent.length >= 5) {
    const rb = recent.filter(r => r === 'banker').length;
    const rp = recent.filter(r => r === 'player').length;
    if (rb > recent.length * 0.55) trend = 'BANKER';
    else if (rp > recent.length * 0.55) trend = 'PLAYER';
    else if (recent.filter(r => r === 'tie').length > recent.length * 0.2) trend = 'TIE';
  }
  // current streak
  let streakLabel = '-';
  if (results.length > 0) {
    const last = results[results.length - 1];
    let cnt = 1;
    for (let i = results.length - 2; i >= 0; i--) {
      if (results[i] === last) cnt++; else break;
    }
    streakLabel = `${labelOf(last)}×${cnt}`;
  }
  return { bankerCount: bCount, bankerPct: bPct, playerCount: pCount, playerPct: pPct, tieCount: tCount, tiePct: tPct, variance, zScore, volatility, trend, currentStreak: streakLabel };
}

// ─── Shoe Texture ─────────────────────────────────────────────────────────────
export interface ShoeTextureData {
  type: 'MIXED' | 'STREAKY' | 'CHOPPY' | 'DRAGON';
  bStreak: number; pStreak: number;
  chop: boolean; dblChop: boolean;
  dragonStreak: boolean;
  textureConfidence: number;
}

export function computeShoeTexture(results: string[]): ShoeTextureData {
  if (results.length < 4) {
    return { type: 'MIXED', bStreak: 0, pStreak: 0, chop: false, dblChop: false, dragonStreak: false, textureConfidence: 0 };
  }
  const core = getCoreHistory(results);
  let maxB = 0, maxP = 0, curType = core[0], curCount = 1;
  for (let i = 1; i < core.length; i++) {
    if (core[i] === curType) { curCount++; }
    else {
      if (curType === 'banker' && curCount > maxB) maxB = curCount;
      if (curType === 'player' && curCount > maxP) maxP = curCount;
      curType = core[i]; curCount = 1;
    }
  }
  if (curType === 'banker' && curCount > maxB) maxB = curCount;
  if (curType === 'player' && curCount > maxP) maxP = curCount;
  const nonTie = getCoreHistory(results);
  let altCount = 0;
  for (let i = 1; i < nonTie.length; i++) { if (nonTie[i] !== nonTie[i - 1]) altCount++; }
  const chopRatio = nonTie.length > 1 ? altCount / (nonTie.length - 1) : 0;
  const chop = chopRatio > 0.65;
  let dblAlt = 0;
  for (let i = 2; i < nonTie.length; i++) { if (nonTie[i] !== nonTie[i - 2]) dblAlt++; }
  const dblChop = nonTie.length > 2 && dblAlt / (nonTie.length - 2) > 0.65;
  const dragonStreak = Math.max(maxB, maxP) >= 6;
  let type: ShoeTextureData['type'] = 'MIXED';
  if (dragonStreak) type = 'DRAGON';
  else if (chop) type = 'CHOPPY';
  else if (Math.max(maxB, maxP) >= 4) type = 'STREAKY';
  const textureConfidence = Math.round(Math.max(chopRatio, 1 - chopRatio) * 100);
  return { type, bStreak: maxB, pStreak: maxP, chop, dblChop, dragonStreak, textureConfidence };
}

// ─── Tie Analysis ─────────────────────────────────────────────────────────────
export interface TieAnalysisData {
  disturbance: number; clusters: number;
  behavior: 'NORMAL' | 'ABNORMAL'; confImpact: number;
}

export function computeTieAnalysis(results: string[]): TieAnalysisData {
  const total = results.length;
  if (total === 0) return { disturbance: 0, clusters: 0, behavior: 'NORMAL', confImpact: 0 };
  const ties = results.filter(r => r === 'tie').length;
  const disturbance = Math.round((ties / total) * 100);
  let clusters = 0, inTie = false;
  for (const r of results) {
    if (r === 'tie' && !inTie) { clusters++; inTie = true; }
    else if (r !== 'tie') inTie = false;
  }
  const behavior: 'NORMAL' | 'ABNORMAL' = disturbance > 15 ? 'ABNORMAL' : 'NORMAL';
  return { disturbance, clusters, behavior, confImpact: -(Math.round(disturbance * 0.5)) };
}

// ─── Signal ───────────────────────────────────────────────────────────────────
export interface SignalData {
  level: string; patternLabel: string; confidence: number;
  patternSequence: string; recommendation: string; samples: number;
  hasExtremeTieRatio: boolean; btAccuracy: number; btUnits: number;
}

export function computeSignal(results: string[], nStrategies: NStrategyEntry[]): SignalData {
  const best = [...nStrategies]
    .filter(n => n.recommendation && n.lowSamples === undefined && n.confidence >= 55)
    .sort((a, b) => b.confidence - a.confidence)[0];
  if (!best || results.length < 3) {
    return { level: 'N0', patternLabel: '-', confidence: 0, patternSequence: '-', recommendation: 'NO BET', samples: 0, hasExtremeTieRatio: false, btAccuracy: 0, btUnits: 0 };
  }
  const tieData = computeTieAnalysis(results);
  const core = getCoreHistory(results);
  const seq = core.slice(-9).map(labelOf).join('-');
  return {
    level: best.level, patternLabel: best.pattern, confidence: best.confidence,
    patternSequence: seq, recommendation: best.recommendation, samples: core.length,
    hasExtremeTieRatio: tieData.behavior === 'ABNORMAL',
    btAccuracy: Math.round(best.confidence * 0.88),
    btUnits: best.confidence >= 75 ? 3 : best.confidence >= 65 ? 2 : 1,
  };
}

// ─── Advanced Backtesting ─────────────────────────────────────────────────────
export type BetResult = 'WIN' | 'LOSS' | 'PUSH' | 'SKIP';
export type BacktestStrength = 'STRONG' | 'NEUTRAL' | 'WEAK';

export interface BacktestingData {
  evaluated: number; bets: number;
  bankerBets: number; playerBets: number; tieBets: number;
  wins: number; losses: number; pushes: number; skipped: number;
  accuracy: number; roi: number; maxDD: number;
  flatBet: number; flatBetPL: number;
  longestWin: number; longestLoss: number;
  currentStreak: number; currentStreakType: 'W' | 'L' | '-';
  avgWinConf: number; avgLossConf: number;
  now: string; strength: BacktestStrength; betBreakdown: string;
}

function getAIPrediction(history: string[]): { decision: 'BET' | 'NO BET'; type: 'banker' | 'player' | 'tie' | ''; confidence: number } {
  const core = getCoreHistory(history);
  if (core.length < 10) return { decision: 'NO BET', type: '', confidence: 0 };

  // Compute dominant pattern for this history slice
  const dp = computeDominantPattern(history);
  if (dp.betPermission !== 'BET ALLOWED') return { decision: 'NO BET', type: '', confidence: 0 };

  // N-Strategy Core
  const strategies = computeNStrategies(history);
  const best = strategies
    .filter(s => s.recommendation && s.lowSamples === undefined && s.confidence >= 57)
    .sort((a, b) => b.confidence - a.confidence)[0];
  if (!best) return { decision: 'NO BET', type: '', confidence: 0 };

  // Markov check — must agree
  const markov = computeMarkov(history);
  const markovBest = markov.bankerPct >= markov.playerPct ? 'BANKER' : 'PLAYER';
  if (markovBest !== best.recommendation) return { decision: 'NO BET', type: '', confidence: 0 };

  // Consensus: need both to agree and confidence >= 57
  const type = best.recommendation.toLowerCase() as 'banker' | 'player';

  // Confidence penalty from anomaly
  let conf = best.confidence;
  if (dp.regimeStatus === 'ANOMALY') conf = Math.round(conf * 0.9);

  if (conf < 57) return { decision: 'NO BET', type: '', confidence: conf };
  return { decision: 'BET', type, confidence: conf };
}

export function computeBacktesting(results: string[], flatBet: number = 600): BacktestingData {
  if (results.length < 5) {
    return {
      evaluated: results.length, bets: 0, bankerBets: 0, playerBets: 0, tieBets: 0,
      wins: 0, losses: 0, pushes: 0, skipped: results.length,
      accuracy: 0, roi: 0, maxDD: 0, flatBet, flatBetPL: 0,
      longestWin: 0, longestLoss: 0, currentStreak: 0, currentStreakType: '-',
      avgWinConf: 0, avgLossConf: 0, now: '-', strength: 'WEAK', betBreakdown: '0B 0P 0T'
    };
  }

  let bets = 0, wins = 0, losses = 0, pushes = 0, skipped = 0;
  let bankerBets = 0, playerBets = 0, tieBets = 0;
  let flatBetPL = 0, maxDD = 0, currentDD = 0;
  let longestWin = 0, longestLoss = 0, curWin = 0, curLoss = 0;
  const winConfs: number[] = [], lossConfs: number[] = [];
  let currentStreak = 0;
  let currentStreakType: 'W' | 'L' | '-' = '-';

  for (let i = 10; i < results.length; i++) {
    const history = results.slice(0, i);
    const actual = results[i];
    const ai = getAIPrediction(history);

    if (ai.decision === 'NO BET' || ai.type === '') {
      skipped++;
      continue;
    }

    bets++;
    if (ai.type === 'banker') bankerBets++;
    else if (ai.type === 'player') playerBets++;
    else tieBets++;

    const isPush = actual === 'tie' && (ai.type === 'banker' || ai.type === 'player');
    const isWin = ai.type === actual;

    if (isPush) {
      pushes++;
      // Push does NOT break streaks
    } else if (isWin) {
      wins++;
      curWin++;
      curLoss = 0;
      if (curWin > longestWin) longestWin = curWin;
      currentStreak = curWin;
      currentStreakType = 'W';
      flatBetPL += ai.type === 'banker' ? Math.round(flatBet * 0.95) : flatBet;
      currentDD = 0;
      winConfs.push(ai.confidence);
    } else {
      losses++;
      curLoss++;
      curWin = 0;
      if (curLoss > longestLoss) longestLoss = curLoss;
      currentStreak = curLoss;
      currentStreakType = 'L';
      flatBetPL -= flatBet;
      currentDD += flatBet;
      if (currentDD > maxDD) maxDD = currentDD;
      lossConfs.push(ai.confidence);
    }
  }

  const resolved = wins + losses;
  const accuracy = resolved > 0 ? Math.round((wins / resolved) * 100) : 0;
  const roi = bets > 0 ? Math.round((flatBetPL / (bets * flatBet)) * 100) : 0;
  const maxDDUnits = flatBet > 0 ? Math.round(maxDD / flatBet) : 0;
  const avgWinConf = winConfs.length > 0 ? Math.round(winConfs.reduce((a, b) => a + b, 0) / winConfs.length) : 0;
  const avgLossConf = lossConfs.length > 0 ? Math.round(lossConfs.reduce((a, b) => a + b, 0) / lossConfs.length) : 0;

  let strength: BacktestStrength = 'WEAK';
  if (accuracy >= 55 && roi >= 0) strength = 'STRONG';
  else if (accuracy >= 48) strength = 'NEUTRAL';

  const nowStr = currentStreakType !== '-' ? `${currentStreak}${currentStreakType}` : '-';

  return {
    evaluated: results.length - 10, bets, bankerBets, playerBets, tieBets,
    wins, losses, pushes, skipped,
    accuracy, roi, maxDD: maxDDUnits, flatBet, flatBetPL,
    longestWin, longestLoss, currentStreak, currentStreakType,
    avgWinConf, avgLossConf, now: nowStr, strength,
    betBreakdown: `${bankerBets}B ${playerBets}P ${tieBets}T`
  };
}
