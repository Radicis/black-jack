import { useEffect, useState } from "react";
import { Card, suits as availableSuits } from "../types/types";

const suits = Object.keys(availableSuits);
// Create an array of numbers from 0 to 13
const values = Array.from({ length: 13 }, (v, index) => index + 1);

const DEFAULT_DECK_COUNT = 6; // use 6 decks

/**
 * This hook wraps functionality relating to management of a deck of cards to be used in a game
 * You can pass it deckCount to set how many decks ot be shuffled together
 */
export default function useDeck(deckCount: number = DEFAULT_DECK_COUNT) {
  const [originalCards, setOriginalCards] = useState<Card[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  // Shameless Fisher-Yates algorithm -> https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  const shuffleDeck = (deck: Card[]) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
    return deck;
  };

  const initDeck = () => {
    const newCards = shuffleDeck(generateDeck(deckCount));
    setCards(cutDeck(newCards));
    // We store the original, uncut cards too so we can reshuffle
    setOriginalCards(newCards);
  };

  /**
   * This is to allow the consuming component to reshuffle, not the internal functions
   * as the internal functions generally don't want to set the state
   */
  const reShuffleDeck = () => {
    setCards(cutDeck(shuffleDeck(originalCards)));
  };

  /**
   * Commonly, the dealer will not use the bottom X cards of the shuffled deck(s)
   * This is to make it harder to count cards. Here we cut off 10 per deck
   */
  const cutDeck = (deck: Card[]) => {
    return deck.slice(0, deck.length - deckCount * 10);
  };

  /**
   * Generates a flattened array of 52 * deckCount Card objects and shuffles them.
   */
  const generateDeck = (deckCount: number): Card[] => {
    const valueMap = ["J", "Q", "K"];
    // Reduce suits, then the numbers and merge them into one flat array, then shuffle
    const createDeck = () => {
      return suits.reduce((acc: Card[], suit: string) => {
        return [
          ...acc,
          ...values.reduce((valAcc: Card[], value: number) => {
            return [
              ...valAcc,
              {
                suit,
                value: value < 11 ? value : 10, // Face cards are 10
                label: value < 11 ? value.toString() : valueMap[value - 11], // converts 11-13 to j/q/k
              } as Card,
            ];
          }, []),
        ];
      }, []);
    };

    return Array.from({ length: deckCount }).map(createDeck).flat();
  };

  /**
   * Returns the next card to the component implementing this hook
   * it can be face up or down, defaults to true
   */
  const getNextCard = (): Card => {
    let updatedCards = [...cards];
    // If we have run out of cards then reshuffle the deck(s)
    if (updatedCards.length === 0) {
      console.debug("Reshuffling..");
      updatedCards = cutDeck(shuffleDeck(originalCards));
    }
    const nextCard = updatedCards.shift();
    setCards(updatedCards);
    return nextCard as Card;
  };

  /**
   * Returns the next card to the component implementing this hook
   * it can be face up or down, defaults to true
   *
   * GOTCHA: This is a bit of a gotcha here. We can't just call getNExtCard
   * Repeatedly in one parent function for example, to get 2 cards for the dealer you may expect
   *
   * getDealer {
   *     card1 = getNextCard()
   *     card2 = getNextCard()
   * }
   *
   * However, this will return the same card since the setCards setter is async and will not
   * have caused the component to render yet. This could have been "cheated" by getting a random
   * card from the deck and hoping for no collisions but it isn't how a shuffled deck is dealt
   *
   */
  const getNextCards = (numberToGet: number): Card[] => {
    const updatedCards = [...cards];
    let nextCards: Card[] = [];
    // If we have run out of cards then take the remaining and reshuffle the deck(s)
    if (cards.length < numberToGet) {
      // Grab the last cards remaining in the current deck
      console.debug("Reshuffling..");
      const reShuffledDeck = cutDeck(shuffleDeck(originalCards));
      const cardsFromReshuffledDeck = reShuffledDeck.slice(
        0,
        updatedCards.length
      );
      nextCards = [...updatedCards, ...cardsFromReshuffledDeck];
      setCards(reShuffledDeck.slice(cardsFromReshuffledDeck.length));
    } else {
      nextCards = updatedCards.slice(0, numberToGet);
      setCards(updatedCards.slice(numberToGet));
    }

    return nextCards;
  };

  /**
   * Draws cards (usually for the dealer) until the specified target or bust and returns
   * the new cards + total hand value and bust flag to the caller
   */
  const drawUntil = (
    currentHandValue: number,
    target: number
  ): { drawnCards: Card[]; handValue: number; isBust: boolean } => {
    console.debug("Drawing until: ", target);
    const drawnCards = [];
    let handValue = currentHandValue;
    let isBust = false;
    let atTarget = false;
    // Get all  the remaining cards in the deck
    let remainingCards = [...cards];

    let idx = 0;

    while (!(isBust || atTarget)) {
      drawnCards.push(remainingCards[idx]);
      console.debug(`Dealer draws: ${JSON.stringify(remainingCards[idx])}`);
      // and the value of the drawn card and check
      handValue = remainingCards[idx].value + handValue;
      if (handValue > 21) {
        console.debug("Dealer Bust on: ", handValue);
        isBust = true;
      } else if (handValue >= target) {
        console.debug("Dealer At target: ", handValue);
        atTarget = true;
      }
      idx = idx + 1;
      // if we run out of cards, reshuffle
      if (idx === remainingCards.length) {
        remainingCards = [...cutDeck(shuffleDeck(originalCards))];
        setCards(remainingCards);
        idx = 0;
      }
    }

    // "Draw" the cards that we "used" and update the deck in state
    setCards(remainingCards.slice(idx));

    // If we are still not bust or 21, reshuffle and continue
    return { drawnCards, handValue, isBust };
  };

  /** On initial load, generate the deck(s) shuffle and cut them */
  useEffect(() => {
    initDeck();
  }, []);

  return {
    cards,
    initDeck,
    shuffleDeck: reShuffleDeck,
    numCardsLeft: cards.length,
    getNextCard,
    getNextCards,
    drawUntil,
  };
}
