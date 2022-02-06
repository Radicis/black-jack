import { act, renderHook } from "@testing-library/react-hooks";
import usePlayer from "./usePlayer";
import { PlayerStatus, Suit } from "../types/types";

const MOCK_CARD = {
  label: "Test",
  suit: Suit.club,
  value: 10,
};

describe("usePlayer Hook", () => {
  it("should expose the expected values", () => {
    const { result } = renderHook(() => usePlayer());
    const keys = Object.keys(result.current);
    expect(keys).toEqual([
      "resetHand",
      "player",
      "setScore",
      "setStatus",
      "giveACard",
      "setShowHand",
      "setPlayer",
    ]);
  });
  it("should init with the default player", () => {
    const { result } = renderHook(() => usePlayer());
    expect(result.current.player).toEqual({
      status: PlayerStatus.READY,
      score: 0,
      hand: {
        cards: [],
        totalValue: 0,
      },
      showHand: false,
    });
  });
  it("should giveACard - add the provided card to the players hand and hand value", () => {
    const { result } = renderHook(() => usePlayer());

    act(() => {
      result.current.giveACard(MOCK_CARD);
    });

    expect(
      expect(result.current.player).toEqual({
        status: PlayerStatus.READY,
        score: 0,
        hand: {
          cards: [MOCK_CARD],
          totalValue: MOCK_CARD.value,
        },
        showHand: false,
      })
    );
  });
  it("should giveACard - add the provided card to the players hand and hand value which makes the player BUST", () => {
    const { result } = renderHook(() => usePlayer());

    act(() => {
      result.current.giveACard(MOCK_CARD);
    });
    act(() => {
      result.current.giveACard(MOCK_CARD);
    });
    act(() => {
      result.current.giveACard(MOCK_CARD);
    });

    expect(
      expect(result.current.player).toEqual({
        status: PlayerStatus.BUST,
        score: 0,
        hand: {
          cards: [MOCK_CARD, MOCK_CARD, MOCK_CARD],
          totalValue: MOCK_CARD.value * 3,
        },
        showHand: false,
      })
    );
  });
  it("should resetHand - set the players hand and related round values while retaining the rest of the data", () => {
    const { result } = renderHook(() => usePlayer());

    act(() => {
      result.current.giveACard(MOCK_CARD);
    });
    act(() => {
      result.current.setScore(10);
    });
    act(() => {
      result.current.setStatus(PlayerStatus.BUST);
    });

    act(() => {
      result.current.resetHand();
    });

    expect(
      expect(result.current.player).toEqual({
        status: PlayerStatus.READY,
        score: 10,
        hand: {
          cards: [],
          totalValue: 0,
        },
        showHand: false,
      })
    );
  });
  it("should setScore - set the players score to the provided value but not modify others", () => {
    const { result } = renderHook(() => usePlayer());

    act(() => {
      result.current.giveACard(MOCK_CARD);
    });
    act(() => {
      result.current.setStatus(PlayerStatus.BUST);
    });

    act(() => {
      result.current.setScore(100);
    });

    expect(
      expect(result.current.player).toEqual({
        status: PlayerStatus.BUST,
        score: 100,
        hand: {
          cards: [MOCK_CARD],
          totalValue: MOCK_CARD.value,
        },
        showHand: false,
      })
    );
  });

  it("should setStatus - set the players status to the provided value but not modify others", () => {
    const { result } = renderHook(() => usePlayer());

    act(() => {
      result.current.giveACard(MOCK_CARD);
    });
    act(() => {
      result.current.setScore(100);
    });

    act(() => {
      result.current.setStatus(PlayerStatus.BUST);
    });
    expect(
      expect(result.current.player).toEqual({
        status: PlayerStatus.BUST,
        score: 100,
        hand: {
          cards: [MOCK_CARD],
          totalValue: MOCK_CARD.value,
        },
        showHand: false,
      })
    );
  });

  it("should setShowHand - set the players show hand to the provided value but not modify others", () => {
    const { result } = renderHook(() => usePlayer());
    act(() => {
      result.current.giveACard(MOCK_CARD);
    });
    act(() => {
      result.current.setScore(100);
    });
    act(() => {
      result.current.setStatus(PlayerStatus.BUST);
    });

    act(() => {
      result.current.setShowHand(true);
    });

    expect(
      expect(result.current.player).toEqual({
        status: PlayerStatus.BUST,
        score: 100,
        hand: {
          cards: [MOCK_CARD],
          totalValue: MOCK_CARD.value,
        },
        showHand: true,
      })
    );
  });
});
