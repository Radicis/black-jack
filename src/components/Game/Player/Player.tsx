import React from "react";
import PlayerControls from "./PlayerControls/PlayerControls";
import { Card, PlayerStatus } from "../../../types/types";
import CardList from "../../shared/CardList/CardList";

type Props = {
  status: PlayerStatus;
  onGetNextCard: () => void;
  cards: Card[];
  currentHandValue: number;
  onStick: () => void;
};

const Player = ({
  status,
  onGetNextCard,
  cards,
  currentHandValue,
  onStick,
}: Props) => {
  return (
    <section className="flex flex-col gap-4 items-center relative">
      {status === "bust" && (
        <div className="font-medium text-xl text-white absolute w-full h-full opacity-90 bg-gray-700 flex items-center justify-center">
          YOU BUST
        </div>
      )}
      {status === "stick" && (
        <div className="font-medium text-xl text-white absolute w-full h-full opacity-90 bg-gray-700 flex items-center justify-center">
          STICK
        </div>
      )}
      <CardList
        showHandValue
        currentHandValue={currentHandValue}
        cards={cards}
      />
      <PlayerControls onHitMe={onGetNextCard} onStick={onStick} />
    </section>
  );
};

export default Player;
