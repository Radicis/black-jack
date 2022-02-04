import { useEffect, useState } from "react";
import { Card, Suit } from "../types/types";

const suits = Object.keys(Suit);
// Create an array of numbers from 0 to 13
const values = Array.from({ length: 13 }, (v, index) => index + 1);

const DEFAULT_DECK_COUNT = 6; // use 6 decks

/**
 * This hook wraps functionality relating to management of a deck of cards to be used in a game
 * You can pass it deckCount to set how many decks ot be shuffled together
 */
const useDeck = (deckCount: number = DEFAULT_DECK_COUNT) => {
  const [originalCards, setOriginalCards] = useState<Card[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  // Fisher-Yates algorithm -> https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  const shuffleDeck = (deck: Card[]) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
    return deck;
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
  const generateDeck = (deckCount: number) => {
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
                faceUp: true,
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
  const getNextCard = (faceUp = true): Card => {
    const updatedCards = [...cards];
    const nextCard = updatedCards.pop();
    setCards(updatedCards);
    return { ...nextCard, faceUp } as Card;
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
    const nextCards = updatedCards.slice(0, numberToGet);
    setCards(updatedCards.slice(numberToGet, updatedCards.length - 1));
    return nextCards;
  };

  const initDeck = () => {
    const newCards = cutDeck(shuffleDeck(generateDeck(deckCount)));
    setCards(newCards);
    // We store the original cards so we can reshuffle
    setOriginalCards(newCards);
  };

  const reShuffleDeck = () => {
    setCards(cutDeck(shuffleDeck(originalCards)));
  };

  useEffect(() => {
    // On initial load, generate the deck(s) shuffle and cut them
    initDeck();
  }, []);

  return {
    initDeck,
    reShuffleDeck,
    numCardsLeft: cards.length,
    getNextCard,
    getNextCards,
  };
};

export default useDeck;
