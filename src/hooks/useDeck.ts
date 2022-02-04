import { useEffect, useState } from "react";
import { Card, Suit } from "../types/types";

const suits = Object.keys(Suit);
const values = Array.from({ length: 13 }, (v, index) => index + 1);

const DECK_COUNT = 6; // use 6 decks

/**
 * This hook wraps functionality relating to management of a deck of cards to be used in a game
 */
const useDeck = () => {
  const [originalCards, setOriginalCards] = useState<Card[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentDrawIndex, setCurrentDrawIndex] = useState<number>(0);

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
    return deck.slice(0, deck.length - DECK_COUNT * 10);
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
                value,
                faceUp: false,
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
  const getNextCard = (index: number, faceUp = true): Card => {
    // TODO: this is a hack to allow multiple requests to getNextCard in the same render of the parent component by incremental index
    setCurrentDrawIndex((prevState) => prevState + 1);
    return { ...cards[index], faceUp }; // set the faceUp value accordingly,
  };

  const initDeck = () => {
    setCurrentDrawIndex(0);
    const newCards = cutDeck(shuffleDeck(generateDeck(DECK_COUNT)));
    setCards(newCards);
    // We store the original cards so we can reshuffle
    setOriginalCards(newCards);
  };

  const reShuffleDeck = () => {
    setCurrentDrawIndex(0);
    setCards(cutDeck(shuffleDeck(originalCards)));
  };

  useEffect(() => {
    // on load, generate the deck(s) shuffle and cut them
    initDeck();
  }, []);

  return {
    currentDrawIndex,
    initDeck,
    reShuffleDeck,
    numCardsLeft: cards.length,
    getNextCard,
  };
};

export default useDeck;
