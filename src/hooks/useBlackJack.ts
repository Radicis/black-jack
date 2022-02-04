import { useEffect, useState } from "react";
import { Card, PlayerStatus } from "../types/types";
import useDeck from "./useDeck";
import usePlayer from "./usePlayer";

/**
 * This hook wraps functionality relating to management of a game of black jack
 * It leverages the useDeck hook to abstract deck manipulation
 */
const useBlackJack = () => {
  const { getNextCard, numCardsLeft, getNextCards, drawUntil } = useDeck();

  const {
    player,
    resetHand: resetPlayerHand,
    setScore: setPlayerScore,
    giveACard: givePlayerACard,
    setStatus: setPlayerStatus,
  } = usePlayer();

  const {
    player: dealer,
    resetHand: resetDealerHand,
    giveACard: giveDealerACard,
    setShowHand: setShowDealerHand,
    setPlayer: setDealerData,
  } = usePlayer();

  const [gameInitialised, setGameInitialised] = useState<boolean>(false);
  const [roundActive, setRoundActive] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState<boolean>(false);

  /**
   * Resets their round score and status and deals them a card face up
   */
  const initialisePlayerHand = (card1: Card, card2: Card) => {
    console.debug("Init player hand");
    // Reset the players hand and status if they have one
    resetPlayerHand();
    // Get the next 2 cards for the player
    givePlayerACard(card1);
    givePlayerACard(card2);
  };

  const initialiseDealerHand = (card1: Card, card2: Card) => {
    console.debug("Init dealer hand");
    setShowDealerHand(false);
    resetDealerHand();
    // Get the dealers first face up card
    giveDealerACard(card1);
    // Get the dealers next card
    giveDealerACard(card2);
  };

  const initGame = async () => {
    // get the next 4 cards
    const [p1, p2, d1, d2] = getNextCards(4);
    await initialisePlayerHand(p1, p2);
    await initialiseDealerHand(d1, d2);
    setGameInitialised(true);
    // Start the round
    setRoundActive(true);
  };

  /**
   * Deals one card to the player and 2 to the dealer, one face up and one down
   */
  const newRound = () => {
    setShowDealerHand(false);
    // get the next 4 cards
    const [p1, p2, d1, d2] = getNextCards(4);
    initialisePlayerHand(p1, p2);
    initialiseDealerHand(d1, d2);
  };

  /**
   * Dealer does dealer things, draws up to (or over) 17
   * Then scores are calculated and shown
   */
  const endRound = () => {
    setIsWinner(false);
    console.debug("Ending round..");
    setRoundActive(false);
    // Figure out the target the dealer needs
    const { hand, status } = player;
    const { hand: dealerHand } = dealer;
    // If the player is bust, dealer wins anyway
    if (status !== PlayerStatus.BUST) {
      // If the player has a "Five Card Charlie" then they win
      if (hand.cards.length >= 5) {
        setIsWinner(true);
      }
      const target = hand.totalValue + 1;
      // Give the dealer a card until he busts or sticks
      const { isBust, handValue, drawnCards } = drawUntil(
        dealerHand.totalValue,
        target
      );
      // Update the dealers data
      setDealerData({
        ...dealer,
        status: isBust ? PlayerStatus.BUST : PlayerStatus.STICK,
        showHand: true,
        hand: {
          ...dealerHand,
          cards: [...dealerHand.cards, ...drawnCards],
          totalValue: handValue,
        },
      });
    } else {
      setIsWinner(false);
    }
  };

  useEffect(() => {
    if (
      player.status === PlayerStatus.STICK ||
      player.status === PlayerStatus.BUST
    ) {
      endRound();
    }
  }, [player.status]);

  return {
    gameInitialised,
    initGame,
    player,
    dealer,
    roundActive,
    setPlayerSticks: () => setPlayerStatus(PlayerStatus.STICK),
    givePlayerACard: () => givePlayerACard(getNextCard()),
    numCardsLeft,
  };
};

export default useBlackJack;
