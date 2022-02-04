import React, { createContext, ReactNode } from "react";
import { Card, Player, PlayerStatus } from "../types/types";
import useGame from "../hooks/useGame";

type GameContextType = {
  player: Player;
  gameOn: boolean;
  showDealerCount: boolean;
  resetGame: () => void;
  initGame: () => void;
  reShuffle: () => void;
  nextRound: () => void;
  setPlayerScore: (score: number) => void;
  setPlayerStatus: (status: PlayerStatus) => void;
  dealerCards: Card[];
  dealerCount: number;
  givePlayerACard: () => void;
  numCardsLeft: number;
  setDealerCount: (count: number) => void;
};

const GameContext = createContext<GameContextType>({
  player: {
    cards: [],
    score: 0,
    currentHandValue: 0,
    status: PlayerStatus.READY,
  },
  gameOn: false,
  showDealerCount: false,
  resetGame: () => null,
  initGame: () => null,
  nextRound: () => null,
  reShuffle: () => null,
  setPlayerScore: () => null,
  setPlayerStatus: () => null,
  givePlayerACard: () => null,
  dealerCards: [],
  dealerCount: 0,
  numCardsLeft: 0,
  setDealerCount: () => null,
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const {
    player,
    gameOn,
    initGame,
    resetGame,
    nextRound,
    dealerCards,
    dealerCount,
    showDealerCount,
    setDealerCount,
    givePlayerACard,
    numCardsLeft,
    reShuffle,
    setPlayerStatus,
    setPlayerScore,
  } = useGame();

  return (
    <GameContext.Provider
      value={{
        player,
        gameOn,
        nextRound,
        initGame,
        resetGame,
        dealerCards,
        dealerCount,
        showDealerCount,
        setDealerCount,
        givePlayerACard,
        setPlayerStatus,
        setPlayerScore,
        numCardsLeft,
        reShuffle,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
