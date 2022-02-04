import { useState } from "react";
import { Card, Player, PlayerStatus } from "../types/types";

const DEFAULT_PLAYER = {
  status: PlayerStatus.READY,
  score: 0,
  hand: {
    cards: [],
    totalValue: 0,
  },
  showHand: false,
};

/**
 * This hook wraps functionality relating to a player or dealer
 */
const usePlayer = () => {
  const [player, setPlayer] = useState<Player>(DEFAULT_PLAYER);

  /**
   * Gives the player a card and checks if they are bust, sets their new score and status.
   */
  const giveACard = (card: Card) => {
    setPlayer((prevState) => {
      const { hand, status } = prevState;
      const { totalValue, cards } = hand;
      const { value } = card;
      const newTotalValue = totalValue + value;
      return {
        ...prevState,
        status: newTotalValue > 21 ? PlayerStatus.BUST : status, // if they go over 21 then they are bust
        hand: {
          ...hand,
          cards: [...cards, card],
          totalValue: newTotalValue,
        },
      };
    });
  };

  const resetHand = () => {
    setPlayer({
      ...player,
      hand: {
        totalValue: 0,
        cards: [],
      },
      showHand: false,
      status: PlayerStatus.READY,
    });
  };

  const setScore = (score: number) => {
    setPlayer({
      ...player,
      score,
    });
  };

  const setStatus = (status: PlayerStatus) => {
    setPlayer({
      ...player,
      status,
    });
  };

  const setShowHand = (showHand: boolean) => {
    setPlayer({
      ...player,
      showHand,
    });
  };

  return {
    resetHand,
    player,
    setScore,
    setStatus,
    giveACard,
    setShowHand,
  };
};

export default usePlayer;
