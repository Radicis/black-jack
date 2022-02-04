export enum Suit {
  heart = "heart",
  diamond = "diamond",
  club = "club",
  spade = "spade",
}

export enum PlayerStatus {
  STICK = "stick",
  BUST = "bust",
  READY = "reacy",
}

/**
 * Models a Card object representing teh cards suit and value, wit the value being numerical from 1 -> 13
 * with 11-13 -> being J/Q/K respectively
 */
export type Card = {
  suit: Suit;
  value: number;
  label: string;
  faceUp: boolean;
};

export type Player = {
  score: number;
  status: PlayerStatus;
  currentHandValue: number;
  cards: Card[];
};

export type Deck = {
  cards: Card[];
};
