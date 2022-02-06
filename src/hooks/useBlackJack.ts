import { useEffect, useState } from "react";
import { Card } from "../types/types";
import useDeck from "./useDeck";
import usePlayer from "./usePlayer";

/**
 * This hook wraps functionality relating to management of a game of black jack
 * It leverages the useDeck hook to abstract deck manipulation and usePlayer to abstract players
 */
export default function useBlackJack() {
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

  const [gameIsInitialised, setGameIsInitialised] = useState<boolean>(false);
  const [playerIsWinner, setPlayerIsIsWinner] = useState<boolean>(false);
  const [roundActive, setRoundActive] = useState<boolean>(false);
  const [currentBet, setCurrentBet] = useState<number>(10);

  /**
   * Resets their round score and status and deals them a card face up
   */
  const initialisePlayerHand = (card1: Card, card2: Card) => {
    // Reset the players hand and status if they have one
    resetPlayerHand();
    // Get the next 2 cards for the player
    givePlayerACard(card1);
    givePlayerACard(card2);
  };

  /**
   * Initialise the dealers hand by setting show to false and dealing them 2 cards
   */
  const initialiseDealerHand = (card1: Card, card2: Card) => {
    setShowDealerHand(false);
    resetDealerHand();
    giveDealerACard(card1);
    giveDealerACard(card2);
  };

  /**
   * Initializes the game round.
   * Deals one card to the player and 2 to the dealer, one face up and one down
   */
  const startNewRound = () => {
    setPlayerIsIsWinner(false);
    setShowDealerHand(false);
    // get the next 4 cards
    const [p1, p2, d1, d2] = getNextCards(4);
    setGameIsInitialised(true);
    initialisePlayerHand(p1, p2);
    initialiseDealerHand(d1, d2);
    setRoundActive(true);
  };

  /**
   * Dealer does dealer things, draws up to (or over) 17
   * Then scores are calculated and shown
   */
  const endRound = () => {
    setRoundActive(false);
    // Figure out the target the dealer needs
    const { hand, status } = player;
    const { hand: dealerHand } = dealer;
    // If the player is bust, dealer wins anyway
    if (status !== "bust") {
      // If the player has a "Five Card Charlie" then they win
      if (hand.cards.length >= 5) {
        setPlayerIsIsWinner(true);
        setPlayerScore(player.score + currentBet);
      } else {
        const target = hand.totalValue + 1;
        // Give the dealer a card until he busts or sticks
        const { isBust, handValue, drawnCards } = drawUntil(
          dealerHand.totalValue,
          target
        );
        // Update the dealers data
        setDealerData({
          ...dealer,
          status: isBust ? "bust" : "stick",
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
          setPlayerScore(player.score + currentBet);
        } else {
          setPlayerIsIsWinner(false);
          setPlayerScore(player.score - currentBet);
        }
      }
    } else {
      setPlayerIsIsWinner(false);
      setPlayerScore(player.score - currentBet);
    }
  };

  /**
   * When the player.status updates, we want to check if they are "done" with their turn and trigger endRound
   * This could be expanded for multiple players
   */
  useEffect(() => {
    if (player.status === "stick" || player.status === "bust") {
      endRound();
    }
  }, [player.status]);

  return {
    gameIsInitialised,
    currentBet,
    setCurrentBet,
    endRound,
    roundActive,
    player,
    dealer,
    startNewRound,
    setPlayerSticks: () => setPlayerStatus("stick"),
    givePlayerACard: () => givePlayerACard(getNextCard()),
    numCardsLeft,
    playerIsWinner,
  };
}
