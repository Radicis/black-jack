import { act, renderHook } from "@testing-library/react-hooks";
import useBlackJack from "./useBlackJack";
import useDeck from "./useDeck";
import { Card, PlayerStatus, Suit } from "../types/types";
import usePlayer from "./usePlayer";

const MOCK_CARD = {
  label: "Test",
  suit: "club" as Suit,
  value: 10,
};

jest.mock("./useDeck");
jest.mock("./usePlayer");

const mockedUseDeck = useDeck as jest.MockedFunction<typeof useDeck>;
const mockedUsePlayer = usePlayer as jest.MockedFunction<typeof usePlayer>;

const mockedUseDeckValue = {
  drawUntil(
    currentHandValue: number,
    target: number
  ): { drawnCards: Card[]; handValue: number; isBust: boolean } {
    return { drawnCards: [], handValue: 0, isBust: false };
  },
  initDeck(): void {},
  shuffleDeck(): void {},
  cards: [],
  numCardsLeft: 10,
  getNextCard: jest.fn().mockImplementation(() => MOCK_CARD),
  getNextCards: jest
    .fn()
    .mockImplementation(() => [MOCK_CARD, MOCK_CARD, MOCK_CARD, MOCK_CARD]),
};

const mockedUsePlayerValue = {
  resetHand: jest.fn(),
  player: {
    status: "ready" as PlayerStatus,
    score: 0,
    hand: {
      cards: [],
      totalValue: 0,
    },
    showHand: false,
  },
  setScore: jest.fn(),
  setStatus: jest.fn(),
  giveACard: jest.fn(),
  setShowHand: jest.fn(),
  setPlayer: jest.fn(),
};

describe("useBlackJack Hook", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedUseDeck.mockReturnValue(mockedUseDeckValue);
    mockedUsePlayer.mockReturnValue(mockedUsePlayerValue);
  });
  it("should expose the expected values", () => {
    const { result } = renderHook(() => useBlackJack());
    const keys = Object.keys(result.current);
    expect(keys).toEqual([
      "gameIsInitialised",
      "currentBet",
      "setCurrentBet",
      "endRound",
      "roundActive",
      "player",
      "dealer",
      "startNewRound",
      "setPlayerSticks",
      "givePlayerACard",
      "numCardsLeft",
      "playerIsWinner",
    ]);
  });

  it("should startNewRound and give player and dealer a fresh hand", () => {
    const mockGetNextCards = jest.fn().mockImplementation(() => [
      { ...MOCK_CARD, value: 1 },
      { ...MOCK_CARD, value: 2 },
      {
        ...MOCK_CARD,
        value: 3,
      },
      { ...MOCK_CARD, value: 4 },
    ]);

    mockedUseDeck.mockReturnValue({
      ...mockedUseDeckValue,
      getNextCards: mockGetNextCards,
    });

    const mockGiveACard = jest.fn();

    mockedUsePlayer.mockReturnValue({
      ...mockedUsePlayerValue,
      giveACard: mockGiveACard,
    });

    const { result } = renderHook(() => useBlackJack());

    act(() => {
      result.current.startNewRound();
    });

    expect(mockGetNextCards).toHaveBeenCalledTimes(1);
    expect(mockGetNextCards).toHaveBeenCalledWith(4);

    // We should have given out 4 cards
    expect(mockGiveACard).toHaveBeenCalledTimes(4);

    // Ensure correct cards given to player
    expect(mockGiveACard.mock.calls[0][0].value).toEqual(1);
    expect(mockGiveACard.mock.calls[1][0].value).toEqual(2);

    // Ensure correct cards given to dealer
    expect(mockGiveACard.mock.calls[2][0].value).toEqual(3);
    expect(mockGiveACard.mock.calls[3][0].value).toEqual(4);

    expect(result.current.gameIsInitialised).toEqual(true);
    expect(result.current.numCardsLeft).toEqual(10);
    expect(result.current.dealer.showHand).toEqual(false);
    expect(result.current.playerIsWinner).toEqual(false);
  });

  it("should setPlayerSticks - set the players status to stick", () => {
    const mockSetStatus = jest.fn();

    mockedUsePlayer.mockReturnValue({
      ...mockedUsePlayerValue,
      setStatus: mockSetStatus,
    });

    const { result } = renderHook(() => useBlackJack());

    act(() => {
      result.current.setPlayerSticks();
    });

    expect(mockSetStatus).toHaveBeenCalledTimes(1);
    expect(mockSetStatus).toHaveBeenCalledWith("stick");
  });

  it("should givePlayerACard - set the players status to stick", () => {
    const mockGetNextCard = jest.fn().mockImplementation(() => MOCK_CARD);

    mockedUseDeck.mockReturnValue({
      ...mockedUseDeckValue,
      getNextCard: mockGetNextCard,
    });

    const mockGiveACard = jest.fn();

    mockedUsePlayer.mockReturnValue({
      ...mockedUsePlayerValue,
      giveACard: mockGiveACard,
    });

    const { result } = renderHook(() => useBlackJack());

    act(() => {
      result.current.givePlayerACard();
    });

    expect(mockGetNextCard).toHaveBeenCalledTimes(1);
    expect(mockGiveACard).toHaveBeenCalledTimes(1);
    expect(mockGiveACard).toHaveBeenCalledWith(MOCK_CARD);
  });

  it("should endRound and the dealer wins", () => {
    const mockDrawUntil = jest.fn().mockImplementation(() => ({
      isBust: false,
      handValue: 100,
      drawnCards: [MOCK_CARD],
    }));

    mockedUseDeck.mockReturnValue({
      ...mockedUseDeckValue,
      drawUntil: mockDrawUntil,
    });

    const mockSetScore = jest.fn();
    const mockSetPlayer = jest.fn();

    mockedUsePlayer.mockReturnValue({
      ...mockedUsePlayerValue,
      setScore: mockSetScore,
      setPlayer: mockSetPlayer,
    });

    const { result } = renderHook(() => useBlackJack());

    act(() => {
      result.current.endRound();
    });

    expect(mockDrawUntil).toHaveBeenCalledTimes(1);
    expect(mockDrawUntil).toHaveBeenCalledWith(0, 1);
    expect(mockSetScore).toHaveBeenCalledTimes(1);
    expect(mockSetPlayer).toHaveBeenCalledWith({
      ...result.current.player,
      showHand: true,
      status: "stick",
      hand: {
        ...result.current.player.hand,
        totalValue: 100,
        cards: [MOCK_CARD],
      },
    });
    expect(result.current.playerIsWinner).toEqual(false);
    expect(mockSetScore).toHaveBeenCalledTimes(1);
    expect(mockSetScore).toHaveBeenCalledWith(-10);
  });

  it("should endRound and the player wins", () => {
    const mockDrawUntil = jest.fn().mockImplementation(() => ({
      isBust: true,
      handValue: 100,
      drawnCards: [MOCK_CARD],
    }));

    mockedUseDeck.mockReturnValue({
      ...mockedUseDeckValue,
      drawUntil: mockDrawUntil,
    });

    const mockSetScore = jest.fn();
    const mockSetPlayer = jest.fn();

    mockedUsePlayer.mockReturnValue({
      ...mockedUsePlayerValue,
      setScore: mockSetScore,
      setPlayer: mockSetPlayer,
    });

    const { result } = renderHook(() => useBlackJack());

    act(() => {
      result.current.endRound();
    });

    expect(mockDrawUntil).toHaveBeenCalledTimes(1);
    expect(mockDrawUntil).toHaveBeenCalledWith(0, 1);
    expect(mockSetScore).toHaveBeenCalledTimes(1);
    expect(mockSetPlayer).toHaveBeenCalledWith({
      ...result.current.player,
      showHand: true,
      status: "bust",
      hand: {
        ...result.current.player.hand,
        totalValue: 100,
        cards: [MOCK_CARD],
      },
    });
    expect(result.current.playerIsWinner).toEqual(true);
    expect(mockSetScore).toHaveBeenCalledTimes(1);
    expect(mockSetScore).toHaveBeenCalledWith(10);
  });

  it("should endRound and the player is bust", () => {
    const mockDrawUntil = jest.fn().mockImplementation(() => ({
      isBust: true,
      handValue: 100,
      drawnCards: [MOCK_CARD],
    }));

    mockedUseDeck.mockReturnValue({
      ...mockedUseDeckValue,
      drawUntil: mockDrawUntil,
    });

    const mockSetScore = jest.fn();
    const mockSetPlayer = jest.fn();

    mockedUsePlayer.mockReturnValue({
      ...mockedUsePlayerValue,
      player: {
        status: "bust" as PlayerStatus,
        score: 0,
        hand: {
          cards: [MOCK_CARD, MOCK_CARD, MOCK_CARD, MOCK_CARD, MOCK_CARD], // give him a charlie
          totalValue: 18,
        },
        showHand: false,
      },
      setScore: mockSetScore,
      setPlayer: mockSetPlayer,
    });

    const { result } = renderHook(() => useBlackJack());

    act(() => {
      result.current.endRound();
    });

    expect(mockDrawUntil).not.toHaveBeenCalled(); // we should skip it here as the player auto loses
    expect(mockSetPlayer).not.toHaveBeenCalled();
    expect(result.current.playerIsWinner).toEqual(false);
    expect(mockSetScore).toHaveBeenCalledWith(-10);
  });

  it("should endRound and the player wins on a 5 card charlie", () => {
    const mockDrawUntil = jest.fn().mockImplementation(() => ({
      isBust: true,
      handValue: 100,
      drawnCards: [MOCK_CARD],
    }));

    mockedUseDeck.mockReturnValue({
      ...mockedUseDeckValue,
      drawUntil: mockDrawUntil,
    });

    const mockSetScore = jest.fn();
    const mockSetPlayer = jest.fn();

    mockedUsePlayer.mockReturnValue({
      ...mockedUsePlayerValue,
      player: {
        status: "ready" as PlayerStatus,
        score: 0,
        hand: {
          cards: [MOCK_CARD, MOCK_CARD, MOCK_CARD, MOCK_CARD, MOCK_CARD], // give him a charlie
          totalValue: 18,
        },
        showHand: false,
      },
      setScore: mockSetScore,
      setPlayer: mockSetPlayer,
    });

    const { result } = renderHook(() => useBlackJack());

    act(() => {
      result.current.endRound();
    });

    expect(mockDrawUntil).not.toHaveBeenCalled(); // we should skip it here as the player auto wins
    expect(mockSetScore).toHaveBeenCalledTimes(1);
    expect(mockSetPlayer).not.toHaveBeenCalled();
    expect(result.current.playerIsWinner).toEqual(true);
    expect(mockSetScore).toHaveBeenCalledTimes(1);
    expect(mockSetScore).toHaveBeenCalledWith(10);
  });

  it("should setCurrentBet", () => {
    const { result } = renderHook(() => useBlackJack());

    expect(result.current.currentBet).toEqual(10);

    act(() => {
      result.current.setCurrentBet(100);
    });
    expect(result.current.currentBet).toEqual(100);
  });
});
