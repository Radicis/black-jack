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
  const [playerIsWinner, setPlayerIsIsWinner] = useState<boolean>(false);
  const [bet, setBet] = useState<number>(10);

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

  /**
   * Initializes the game round.
   * Deals one card to the player and 2 to the dealer, one face up and one down
   */
  const startNewRound = () => {
    setPlayerIsIsWinner(false);
    console.debug("Starting new round.. ");
    setShowDealerHand(false);
    // get the next 4 cards
    const [p1, p2, d1, d2] = getNextCards(4);
    setGameInitialised(true);
    initialisePlayerHand(p1, p2);
    initialiseDealerHand(d1, d2);
  };

  /**
   * Dealer does dealer things, draws up to (or over) 17
   * Then scores are calculated and shown
   */
  const endRound = () => {
    console.debug("Ending round..");
    // Figure out the target the dealer needs
    const { hand, status } = player;
    const { hand: dealerHand } = dealer;
    // If the player is bust, dealer wins anyway
    if (status !== PlayerStatus.BUST) {
      // If the player has a "Five Card Charlie" then they win
      if (hand.cards.length >= 5) {
        setPlayerIsIsWinner(true);
        setPlayerScore(player.score + bet);
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
      // If the dealer is bust then the player wins, if not, dealer wins
      if (isBust) {
        setPlayerIsIsWinner(true);
        setPlayerScore(player.score + bet);
      } else {
        setPlayerIsIsWinner(false);
        setPlayerScore(player.score - bet);
      }
    } else {
      setPlayerIsIsWinner(false);
      setPlayerScore(player.score - bet);
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
    bet,
    setBet,
    player,
    dealer,
    startNewRound,
    setPlayerSticks: () => setPlayerStatus(PlayerStatus.STICK),
    givePlayerACard: () => givePlayerACard(getNextCard()),
    numCardsLeft,
    playerIsWinner,
  };
};

export default useBlackJack;
