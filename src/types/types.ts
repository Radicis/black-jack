export const suits = ["heart", "diamond", "club", "spade"] as const;
export type Suit = typeof suits[number];

export type PlayerStatus = "stick" | "bust" | "ready";

/**
 * Models a Card object representing teh cards suit and value, wit the value being numerical from 1 -> 13
 * with 11-13 -> being J/Q/K respectively
 */
export type Card = {
  suit: Suit;
  value: number;
  label: string;
};

export type Hand = {
  totalValue: number;
  cards: Card[];
};

export type Player = {
  score: number;
  status: PlayerStatus;
  hand: Hand;
  showHand: boolean;
};

export type Deck = {
  cards: Card[];
};
