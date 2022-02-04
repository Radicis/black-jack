import { useState } from "react";
import { Card, Player, PlayerStatus } from "../types/types";

const DEFAULT_PLAYER = {
  status: PlayerStatus.READY,
  score: 0,
  cards: [],
  currentHandValue: 0,
};

/**
 * This hook wraps functionality relating to a player
 */
const usePlayer = () => {
  const [player, setPlayer] = useState<Player>(DEFAULT_PLAYER);

  /**
   * Gives the player a card and checks if they are bust, sets their new score and status
   */
  const givePlayerACard = (card: Card) => {
    const { cards, currentHandValue, status } = player;
    const { value } = card;
    const newScore = currentHandValue + value;
    setPlayer({
      ...player,
      currentHandValue: newScore,
      status: newScore > 21 ? PlayerStatus.BUST : status, // if they go over 21 set the as bust
      cards: [...cards, card],
    });
  };

  const reset = () => {
    setPlayer(DEFAULT_PLAYER);
  };

  const resetPlayerRoundData = () => {
    setPlayer({
      ...player,
      currentHandValue: 0,
      status: PlayerStatus.READY,
      cards: [],
    });
  };

  const setPlayerScore = (score: number) => {
    setPlayer({
      ...player,
      score,
    });
  };

  const setPlayerStatus = (status: PlayerStatus) => {
    setPlayer({
      ...player,
      status,
    });
  };

  return {
    reset,
    resetPlayerRoundData,
    player,
    setPlayerScore,
    setPlayerStatus,
    givePlayerACard,
  };
};

export default usePlayer;
