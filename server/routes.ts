import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export interface GameState {
  cardCount: number;
  playNumber: number;
  gameResults: string[];
}

// In-memory game state storage
let currentGameState: GameState = {
  cardCount: 416,
  playNumber: 0,
  gameResults: []
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to get game state
  app.get('/api/game-state', (req, res) => {
    res.json(currentGameState);
  });
  
  // API endpoint to save game state
  app.post('/api/game-state', (req, res) => {
    const { cardCount, playNumber, gameResults } = req.body;
    
    // Validate data
    if (typeof cardCount !== 'number' || typeof playNumber !== 'number' || !Array.isArray(gameResults)) {
      return res.status(400).json({ message: 'Invalid game state data' });
    }
    
    // Update game state
    currentGameState = {
      cardCount,
      playNumber,
      gameResults,
    };
    
    res.json({ success: true });
  });
  
  // API endpoint to reset game
  app.post('/api/reset-game', (req, res) => {
    currentGameState = {
      cardCount: 416,
      playNumber: 0,
      gameResults: []
    };
    
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
