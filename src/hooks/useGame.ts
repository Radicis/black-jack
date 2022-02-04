import { useState } from "react";
import { Card, PlayerStatus } from "../types/types";
import useDeck from "./useDeck";
import usePlayer from "./usePlayer";

/**
 * This hook wraps functionality relating to management of a game of black jack
 * It leverages the useDeck hook to abstract deck manipulation
 */
const useGame = () => {
  const {
    getNextCard,
    numCardsLeft,
    reShuffleDeck,
    initDeck,
    currentDrawIndex,
  } = useDeck();
  const {
    player,
    setPlayerStatus,
    setPlayerScore,
    resetPlayerRoundData,
    givePlayerACard,
    reset: resetPlayer,
  } = usePlayer();
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [dealerCount, setDealerCount] = useState<number>(0);
  const [showDealerCount, setShowDealerCount] = useState<boolean>(false);
  const [gameOn, setGameOn] = useState<boolean>(false);

  const initGame = () => {
    setShowDealerCount(false);
    // Get the dealers first face up card
    const nextCard = getNextCard(currentDrawIndex);
    // Get the dealers next face down card
    const nextDownCard = getNextCard(currentDrawIndex + 1, false);

    // We ste the count here but we don't show it
    setDealerCount(nextCard.value + nextDownCard.value);
    setDealerCards([nextCard, nextDownCard]);

    givePlayerACard(getNextCard(currentDrawIndex + 2));
    // Start the game
    setGameOn(true);
  };

  const newRound = () => {
    resetPlayerRoundData();
    setDealerCount(0);
    setDealerCards([]);
    givePlayerACard(getNextCard(currentDrawIndex));
  };

  const handleGivePlayerACard = () => {
    givePlayerACard(getNextCard(currentDrawIndex));
  };

  const resetGame = () => {
    resetPlayer();
    initDeck(); // create a new deck
    setDealerCount(0);
    setDealerCards([]);
    setGameOn(false);
  };

  const calculateScores = () => {
    if (dealerCount > 21) {
      alert("Dealer bust");
      // everyone NOT bust, gets money
      const { status, score } = player;
      if (status !== PlayerStatus.BUST) {
        setPlayerScore(score + 1);
      }
    } else {
      // everyone higher than dealer get money
      const { status, currentHandValue, score } = player;
      if (status !== PlayerStatus.BUST && currentHandValue > dealerCount) {
        setPlayerScore(score + 1);
      }
    }
  };

  const reShuffle = () => {
    reShuffleDeck(); // create a new deck
    setDealerCount(0);
    setDealerCards([]);
    setGameOn(true);
  };

  const nextRound = () => {
    resetPlayerRoundData();
    initGame();
  };

  /**
   * Set the player status and trigger the dealers action
   * @param status
   */
  const handleSetPlayerStatus = (status: PlayerStatus) => {
    setPlayerStatus(status);
    doTheDealerThings();
  };

  /**
   * Dealer does dealer things, draws up to (or over) 17
   * Then scores are calculated and shown
   */
  const doTheDealerThings = () => {
    let newDealerCount = dealerCount;
    // Show us what he's got by turing all cards face up and showing his count
    setDealerCards([...dealerCards.map((card) => ({ ...card, faceUp: true }))]);
    setShowDealerCount(true);
    while (newDealerCount < 17) {
      console.log(dealerCount);
      // Get the dealers first face up card
      const nextCard = getNextCard(currentDrawIndex);
      const { value } = nextCard;
      newDealerCount = newDealerCount + value;
      setDealerCards([
        ...dealerCards.map((card) => ({ ...card, faceUp: true })),
        nextCard,
      ]);
    }
    setDealerCount(newDealerCount);
    calculateScores();
    newRound();
  };

  return {
    player,
    gameOn,
    initGame,
    resetGame,
    nextRound,
    dealerCards,
    setDealerCards,
    dealerCount,
    setPlayerStatus: handleSetPlayerStatus,
    setPlayerScore,
    showDealerCount,
    setDealerCount,
    givePlayerACard: handleGivePlayerACard,
    numCardsLeft,
    reShuffle,
    initDeck,
  };
};

export default useGame;
