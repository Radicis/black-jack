import { act, renderHook } from "@testing-library/react-hooks";
import useDeck from "./useDeck";
import { Card } from "../types/types";

const MOCK_CARD = {
  label: "Test",
  suit: "club",
  value: 10,
};

describe("useDeck Hook", () => {
  it("should expose the expected values", () => {
    const { result } = renderHook(() => useDeck());
    const keys = Object.keys(result.current);
    expect(keys).toEqual([
      "cards",
      "initDeck",
      "shuffleDeck",
      "numCardsLeft",
      "getNextCard",
      "getNextCards",
      "drawUntil",
    ]);
  });
  it("should init with an the expected number of cards in the deck for various deck counts and cut the bottom X", () => {
    const { result } = renderHook(() => useDeck(1));
    expect(result.current.numCardsLeft).toEqual(52 - 10);
    const { result: result2 } = renderHook(() => useDeck(2));
    expect(result2.current.numCardsLeft).toEqual(2 * 52 - 2 * 10);
    const { result: result3 } = renderHook(() => useDeck(10));
    expect(result3.current.numCardsLeft).toEqual(10 * 52 - 10 * 10);
  });
  it("should initDeck again when called", () => {
    const { result } = renderHook(() => useDeck(1));
    expect(result.current.numCardsLeft).toEqual(52 - 10);
    // Draw 10 cards
    act(() => {
      result.current.getNextCards(10);
    });
    expect(result.current.numCardsLeft).toEqual(52 - 20);
    act(() => {
      result.current.initDeck();
    });
    expect(result.current.numCardsLeft).toEqual(52 - 10);
  });
  it("should reShuffleDeck", () => {
    const { result } = renderHook(() => useDeck(100));

    const initialCards: Card[] = [...result.current.cards]; //shallow copy the cards

    act(() => {
      result.current.shuffleDeck();
    });

    const shuffledCards: Card[] = [...result.current.cards]; //shallow copy the cards

    expect(shuffledCards.length).toEqual(initialCards.length);
    expect(JSON.stringify(shuffledCards)).not.toEqual(
      JSON.stringify(initialCards)
    ); // with 100 decks this is statistically improbable
  });
  it("should getNextCard - return the next card and be a different card each time", () => {
    const { result } = renderHook(() => useDeck());

    const initialCards: Card[] = [...result.current.cards]; //shallow copy the cards

    let firstCard, nextCard;

    act(() => {
      firstCard = result.current.getNextCard();
    });

    expect(firstCard).toEqual(initialCards[0]);

    act(() => {
      nextCard = result.current.getNextCard();
    });

    expect(nextCard).not.toEqual(firstCard);
    expect(nextCard).toEqual(initialCards[1]);
  });
  it("should getNextCard - return the next card against an empty deck and reshuffle", () => {
    const { result } = renderHook(() => useDeck(1));

    // With one deck we start with 42 cards
    expect(result.current.numCardsLeft).toEqual(42);

    // Let's draw some so there aren't enough left for draw X
    let burnCards: Card[] = [];
    act(() => {
      burnCards = result.current.getNextCards(41); // leave one
    });

    const initialCards: Card[] = [...result.current.cards]; // shallow copy the cards

    let firstCard, nextCard;

    act(() => {
      firstCard = result.current.getNextCard();
    });

    expect(firstCard).toEqual(initialCards[0]);

    act(() => {
      nextCard = result.current.getNextCard();
    });

    expect(result.current.numCardsLeft).toEqual(41);

    const shuffledCards: Card[] = [...result.current.cards]; // shallow copy the cards

    expect(shuffledCards.length).toEqual(41); // check that a card was taken off
    expect(nextCard).not.toEqual(firstCard);
  });
  it("should getNextCards - return the next X cards and be a different card each time", () => {
    const { result } = renderHook(() => useDeck());

    const initialCards: Card[] = [...result.current.cards]; //shallow copy the cards

    let firstCards: Card[] = [];
    let nextCards: Card[] = [];
    let singleCard: Card;

    act(() => {
      firstCards = result.current.getNextCards(5);
    });

    expect(firstCards.length).toEqual(5);
    expect(firstCards).toEqual(initialCards.slice(0, 5));

    act(() => {
      nextCards = result.current.getNextCards(4);
    });

    expect(nextCards.length).toEqual(4);
    expect(nextCards).toEqual(initialCards.slice(5, 9));

    // Get a single card now to make sure these got taken off the top
    act(() => {
      singleCard = result.current.getNextCard();
    });

    // @ts-ignore - throws not defined, that's ok
    expect(singleCard).toEqual(initialCards[9]); // should be the 10th card since we got next 5 then next 4
  });
  it("should getNextCards - and reshuffle if there are not enough cards left in the deck", () => {
    const { result } = renderHook(() => useDeck(1));

    // With one deck we start with 42 cards
    expect(result.current.numCardsLeft).toEqual(42);

    // Burn some cards
    act(() => {
      result.current.getNextCards(32);
    });

    // Ensure they were drawn
    expect(result.current.numCardsLeft).toEqual(10);

    const initialCards: Card[] = [...result.current.cards]; // shallow copy the cards

    let firstCards: Card[] = [];
    let nextCards: Card[] = [];
    let singleCard: Card;

    act(() => {
      firstCards = result.current.getNextCards(5);
    });

    expect(result.current.numCardsLeft).toEqual(5);
    expect(firstCards.length).toEqual(5);
    expect(firstCards).toEqual(initialCards.slice(0, 5));

    // The next draw should reshuffle
    act(() => {
      nextCards = result.current.getNextCards(10);
    });

    const shuffledCards: Card[] = [...result.current.cards]; // shallow copy the cards

    // Expecting a shuffled deck to be 37 since we would start with 42 and get the next 5 from it
    expect(result.current.numCardsLeft).toEqual(37);
    // expecting the last 4 cards of this deck and the first 6 of the new, reshuffled deck
    expect(nextCards.length).toEqual(10);
    // We don't have the updated shuffled deck in scope here so the length plus this check is enough
    expect(nextCards.slice(0, 5)).toEqual(initialCards.slice(5));

    // Get a single card now to make sure these got taken off the top
    act(() => {
      singleCard = result.current.getNextCard();
    });

    // @ts-ignore - throws not defined, that's ok
    expect(singleCard).toEqual(shuffledCards[0]); // should be the 10th card since we got next 5 then next 4
  });
  it("should drawUntil - draw cards up to a target of 0 -> 21", () => {
    const { result } = renderHook(() => useDeck(1));

    let drawResult = {
      drawnCards: [],
      handValue: 0,
      isBust: false,
    } as { drawnCards: Card[]; handValue: number; isBust: boolean };

    Array.from({ length: 21 }, (v, index) => index + 1).forEach((target) => {
      act(() => {
        drawResult = result.current.drawUntil(5, target);
      });

      expect(drawResult.handValue).toBeGreaterThanOrEqual(target);
      expect(drawResult.isBust).toEqual(drawResult.handValue > 21);
    });
  });
  it("should drawUntil - draw cards up to a target and reshuffle once current deck is empty", () => {
    const { result } = renderHook(() => useDeck(1));

    // With one deck we start with 42 cards
    expect(result.current.numCardsLeft).toEqual(42);

    // Burn some cards and leave 1
    act(() => {
      result.current.getNextCards(41);
    });

    expect(result.current.numCardsLeft).toEqual(1);

    let drawResult = {
      drawnCards: [],
      handValue: 0,
      isBust: false,
    } as { drawnCards: Card[]; handValue: number; isBust: boolean };

    act(() => {
      drawResult = result.current.drawUntil(8, 21);
    });

    // Make sure at least 1 cards came off the new deck
    expect(result.current.numCardsLeft).toBeGreaterThanOrEqual(41);

    expect(drawResult.handValue).toBeGreaterThanOrEqual(21);
    expect(drawResult.isBust).toEqual(drawResult.handValue > 21);
  });
});
