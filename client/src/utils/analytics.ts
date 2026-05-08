export interface NStrategyEntry {
  level: string;
  pattern: string;
  recommendation: 'PLAYER' | 'BANKER' | 'TIE' | '';
  confidence: number;
  trend: string;
  category: 'REV' | 'TIE' | 'STK' | '';
  lowSamples?: number;
}

export interface MarkovData {
  currentPattern: string;
  bankerPct: number;
  playerPct: number;
  tiePct: number;
  signalLabel: string;
  signalLevel: string;
}

export interface ShoeVarianceData {
  bankerCount: number;
  bankerPct: number;
  playerCount: number;
  playerPct: number;
  tieCount: number;
  tiePct: number;
  variance: number;
  zScore: number;
  volatility: 'LOW' | 'MEDIUM' | 'HIGH';
  trend: 'NEUTRAL' | 'BANKER' | 'PLAYER' | 'TIE';
}

export interface ShoeTextureData {
  type: 'MIXED' | 'STREAKY' | 'CHOPPY';
  bStreak: number;
  pStreak: number;
  chop: boolean;
  dblChop: boolean;
}

export interface BacktestingData {
  evaluated: number;
  bets: number;
  wins: number;
  losses: number;
  pushes: number;
  skipped: number;
  accuracy: number;
  roi: number;
  maxDD: number;
  flatBet: number;
  flatBetPL: number;
  longestWin: number;
  longestLoss: number;
  avgWinConf: number;
  avgLossConf: number;
  now: string;
  strength: 'WEAK' | 'MODERATE' | 'STRONG';
  betBreakdown: string;
}

export interface TieAnalysisData {
  disturbance: number;
  clusters: number;
  behavior: 'NORMAL' | 'ABNORMAL';
  confImpact: number;
}

export interface SignalData {
  level: string;
  patternLabel: string;
  confidence: number;
  patternSequence: string;
  recommendation: string;
  samples: number;
  hasExtremeTieRatio: boolean;
  btAccuracy: number;
  btUnits: number;
}

function labelOf(r: string) {
  if (r === 'player') return 'P';
  if (r === 'banker') return 'B';
  if (r === 'tie') return 'T';
  return '?';
}

export function computeNStrategies(results: string[]): NStrategyEntry[] {
  const entries: NStrategyEntry[] = [];
  for (let n = 1; n <= 4; n++) {
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

export function computeMarkov(results: string[]): MarkovData {
  if (results.length < 2) {
    return { currentPattern: '-', bankerPct: 45, playerPct: 45, tiePct: 10, signalLabel: '-', signalLevel: 'N1' };
  }
  const last = results[results.length - 1];
  const pattern = labelOf(last);
  const outcomes = { player: 0, banker: 0, tie: 0 };
  for (let i = 0; i < results.length - 1; i++) {
    if (results[i] === last) {
      const next = results[i + 1];
      if (next === 'player') outcomes.player++;
      else if (next === 'banker') outcomes.banker++;
      else if (next === 'tie') outcomes.tie++;
    }
  }
  const total = outcomes.player + outcomes.banker + outcomes.tie;
  const bPct = total > 0 ? Math.round((outcomes.banker / total) * 100) : 45;
  const pPct = total > 0 ? Math.round((outcomes.player / total) * 100) : 45;
  const tPct = total > 0 ? Math.round((outcomes.tie / total) * 100) : 10;
  let signalLabel = '↑-B';
  let best = bPct;
  if (pPct > best) { signalLabel = '↑-P'; best = pPct; }
  if (tPct > best) { signalLabel = '↑-T'; }
  return { currentPattern: pattern, bankerPct: bPct, playerPct: pPct, tiePct: tPct, signalLabel, signalLevel: 'N1' };
}

export function computeShoeVariance(results: string[]): ShoeVarianceData {
  const total = results.length;
  if (total === 0) {
    return { bankerCount: 0, bankerPct: 0, playerCount: 0, playerPct: 0, tieCount: 0, tiePct: 0, variance: 0, zScore: 0, volatility: 'LOW', trend: 'NEUTRAL' };
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
  const zScore = total > 0 ? Math.round(((bCount - expectedB) / Math.sqrt(expectedB)) * 100) / 100 : 0;
  let volatility: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (variance > 100) volatility = 'HIGH';
  else if (variance > 40) volatility = 'MEDIUM';
  const recent = results.slice(-10);
  const recentB = recent.filter(r => r === 'banker').length;
  const recentP = recent.filter(r => r === 'player').length;
  let trend: 'NEUTRAL' | 'BANKER' | 'PLAYER' | 'TIE' = 'NEUTRAL';
  if (recent.length >= 5) {
    if (recentB > recent.length * 0.55) trend = 'BANKER';
    else if (recentP > recent.length * 0.55) trend = 'PLAYER';
    else if (recent.filter(r => r === 'tie').length > recent.length * 0.2) trend = 'TIE';
  }
  return { bankerCount: bCount, bankerPct: bPct, playerCount: pCount, playerPct: pPct, tieCount: tCount, tiePct: tPct, variance, zScore, volatility, trend };
}

export function computeShoeTexture(results: string[]): ShoeTextureData {
  if (results.length < 4) {
    return { type: 'MIXED', bStreak: 0, pStreak: 0, chop: false, dblChop: false };
  }
  let bStreak = 0, pStreak = 0;
  let cur = results[results.length - 1], count = 1;
  for (let i = results.length - 2; i >= 0; i--) {
    if (results[i] === cur && cur !== 'tie') count++;
    else break;
  }
  if (cur === 'banker') bStreak = count;
  else if (cur === 'player') pStreak = count;
  let maxB = 0, maxP = 0, tempType = results[0], tempCount = 1;
  for (let i = 1; i < results.length; i++) {
    if (results[i] === tempType) { tempCount++; }
    else {
      if (tempType === 'banker' && tempCount > maxB) maxB = tempCount;
      if (tempType === 'player' && tempCount > maxP) maxP = tempCount;
      tempType = results[i]; tempCount = 1;
    }
  }
  if (tempType === 'banker' && tempCount > maxB) maxB = tempCount;
  if (tempType === 'player' && tempCount > maxP) maxP = tempCount;
  if (bStreak === 0) bStreak = maxB;
  if (pStreak === 0) pStreak = maxP;
  const nonTie = results.filter(r => r !== 'tie');
  let alternating = 0;
  for (let i = 1; i < nonTie.length; i++) {
    if (nonTie[i] !== nonTie[i - 1]) alternating++;
  }
  const chopRatio = nonTie.length > 1 ? alternating / (nonTie.length - 1) : 0;
  const chop = chopRatio > 0.65;
  let dblChop = false;
  if (nonTie.length >= 6) {
    let dblAlt = 0;
    for (let i = 2; i < nonTie.length; i++) {
      if (nonTie[i] !== nonTie[i - 2]) dblAlt++;
    }
    dblChop = dblAlt / (nonTie.length - 2) > 0.65;
  }
  let type: 'MIXED' | 'STREAKY' | 'CHOPPY' = 'MIXED';
  if (chop) type = 'CHOPPY';
  else if (Math.max(maxB, maxP) >= 4) type = 'STREAKY';
  return { type, bStreak, pStreak, chop, dblChop };
}

export function computeTieAnalysis(results: string[]): TieAnalysisData {
  const total = results.length;
  if (total === 0) return { disturbance: 0, clusters: 0, behavior: 'NORMAL', confImpact: 0 };
  const ties = results.filter(r => r === 'tie').length;
  const disturbance = Math.round((ties / total) * 100);
  let clusters = 0;
  let inTie = false;
  for (const r of results) {
    if (r === 'tie' && !inTie) { clusters++; inTie = true; }
    else if (r !== 'tie') inTie = false;
  }
  const behavior: 'NORMAL' | 'ABNORMAL' = disturbance > 15 ? 'ABNORMAL' : 'NORMAL';
  const confImpact = -(Math.round(disturbance * 0.5));
  return { disturbance, clusters, behavior, confImpact };
}

export function computeSignal(results: string[], nStrategies: NStrategyEntry[]): SignalData {
  const best = [...nStrategies].filter(n => n.recommendation && !n.lowSamples).sort((a, b) => b.confidence - a.confidence)[0];
  if (!best || results.length < 3) {
    return { level: 'N0', patternLabel: '-', confidence: 0, patternSequence: '-', recommendation: 'NO BET', samples: 0, hasExtremeTieRatio: false, btAccuracy: 0, btUnits: 0 };
  }
  const tieData = computeTieAnalysis(results);
  const seq = results.slice(-9).map(labelOf).join('-');
  return {
    level: best.level,
    patternLabel: best.pattern,
    confidence: best.confidence,
    patternSequence: seq,
    recommendation: best.recommendation,
    samples: results.length,
    hasExtremeTieRatio: tieData.behavior === 'ABNORMAL',
    btAccuracy: Math.round(best.confidence * 0.85),
    btUnits: best.confidence >= 75 ? 3 : best.confidence >= 65 ? 2 : 1,
  };
}

export function computeBacktesting(results: string[], flatBetUnit: number = 600): BacktestingData {
  if (results.length < 5) {
    return { evaluated: results.length, bets: 0, wins: 0, losses: 0, pushes: 0, skipped: results.length, accuracy: 0, roi: 0, maxDD: 0, flatBet: flatBetUnit, flatBetPL: 0, longestWin: 0, longestLoss: 0, avgWinConf: 0, avgLossConf: 0, now: '-', strength: 'WEAK', betBreakdown: '0B 0P 0T' };
  }
  let bets = 0, wins = 0, losses = 0, pushes = 0, skipped = 0;
  let flatBetPL = 0, maxDD = 0, currentDD = 0;
  let longestWin = 0, longestLoss = 0, curWin = 0, curLoss = 0;
  const winConfs: number[] = [], lossConfs: number[] = [];
  let betB = 0, betP = 0, betT = 0;
  const simResults: string[] = [];
  for (let i = 3; i < results.length; i++) {
    simResults.push(results[i]);
    const history = results.slice(0, i);
    const strategies = computeNStrategies(history);
    const best = strategies.filter(s => s.recommendation && !s.lowSamples && s.confidence >= 60).sort((a, b) => b.confidence - a.confidence)[0];
    const actual = results[i];
    if (!best) { skipped++; continue; }
    bets++;
    const conf = best.confidence;
    const pred = best.recommendation.toLowerCase();
    if (pred === 'banker') betB++;
    else if (pred === 'player') betP++;
    else betT++;
    const won = pred === actual;
    const isPush = actual === 'tie' && pred !== 'tie';
    if (won) {
      wins++;
      curWin++; curLoss = 0;
      if (curWin > longestWin) longestWin = curWin;
      flatBetPL += pred === 'banker' ? Math.round(flatBetUnit * 0.95) : flatBetUnit;
      currentDD = 0;
      winConfs.push(conf);
    } else if (isPush) {
      pushes++;
      curWin = 0; curLoss = 0;
    } else {
      losses++;
      curLoss++; curWin = 0;
      if (curLoss > longestLoss) longestLoss = curLoss;
      flatBetPL -= flatBetUnit;
      currentDD += flatBetUnit;
      if (currentDD > maxDD) maxDD = currentDD;
      lossConfs.push(conf);
    }
  }
  evaluated: results.length - 3;
  const evaluated = results.length - 3;
  const accuracy = bets > 0 ? Math.round((wins / bets) * 100) : 0;
  const roi = bets > 0 ? Math.round((flatBetPL / (bets * flatBetUnit)) * 100) : 0;
  const maxDDUnits = flatBetUnit > 0 ? Math.round(maxDD / flatBetUnit) : 0;
  const avgWinConf = winConfs.length > 0 ? Math.round(winConfs.reduce((a, b) => a + b, 0) / winConfs.length) : 0;
  const avgLossConf = lossConfs.length > 0 ? Math.round(lossConfs.reduce((a, b) => a + b, 0) / lossConfs.length) : 0;
  let strength: 'WEAK' | 'MODERATE' | 'STRONG' = 'WEAK';
  if (accuracy >= 60) strength = 'STRONG';
  else if (accuracy >= 50) strength = 'MODERATE';
  const lastOutcomes = simResults.slice(-5);
  let nowStr = '-';
  if (lastOutcomes.length > 0) {
    const last = lastOutcomes[lastOutcomes.length - 1];
    let cnt = 1;
    for (let i = lastOutcomes.length - 2; i >= 0; i--) {
      if (lastOutcomes[i] === last) cnt++;
      else break;
    }
    nowStr = `${cnt}${labelOf(last)}`;
  }
  return {
    evaluated,
    bets,
    wins,
    losses,
    pushes,
    skipped,
    accuracy,
    roi,
    maxDD: maxDDUnits,
    flatBet: flatBetUnit,
    flatBetPL,
    longestWin,
    longestLoss,
    avgWinConf,
    avgLossConf,
    now: nowStr,
    strength,
    betBreakdown: `${betB}B ${betP}P ${betT}T`
  };
}
