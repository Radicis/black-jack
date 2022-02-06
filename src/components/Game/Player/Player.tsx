import React from "react";
import { Card, PlayerStatus } from "../../../types/types";
import CardList from "../../shared/CardList/CardList";

type Props = {
  status: PlayerStatus;
  cards: Card[];
  currentHandValue: number;
  name: string;
  showHandValue: boolean;
};

const Player = ({
  status,
  name,
  showHandValue,
  cards,
  currentHandValue,
}: Props) => {
  return (
    <section className="flex flex-col gap-4 items-center relative">
      <div className="font-bold text-lg">{name}</div>
      {status === "bust" && (
        <div className="font-medium text-xl text-white absolute w-full h-full opacity-90 bg-gray-700 flex items-center justify-center">
          YOU BUST
        </div>
      )}
      {status === "stick" && (
        <div className="font-medium text-xl text-white absolute w-full h-full opacity-90 bg-gray-700 flex items-center justify-center">
          STICK on {currentHandValue}
        </div>
      )}
      <CardList
        showHandValue={showHandValue}
        currentHandValue={currentHandValue}
        cards={cards}
      />
    </section>
  );
};

export default Player;
