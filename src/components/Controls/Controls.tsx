import React, { ReactEventHandler } from "react";
import Button from "../shared/Button/Button";

type Props = {
  onNewRound: ReactEventHandler;
  onGetNextCard: () => void;
  onSetBet: (bet: number) => void;
  onStick: () => void;
  gameInitialised: boolean;
  roundActive: boolean;
  score: number;
  numCardsLeft: number;
};

const Controls = ({
  gameInitialised,
  onNewRound,
  score,
  roundActive,
  onStick,
  onGetNextCard,
  numCardsLeft,
  onSetBet,
}: Props) => {
  return (
    <div className="absolute self-center gap-4 p-4 flex flex-col items-center justify-center rounded-full border-t-2 border-red-400 bg-gray-800">
      <div className="flex gap-8">
        {gameInitialised && !roundActive && (
          <Button onClick={onNewRound}>Next Hand</Button>
        )}
        {!gameInitialised && <Button onClick={onNewRound}>Start Game</Button>}
        {gameInitialised && roundActive && (
          <div className="flex gap-8">
            <Button onClick={onGetNextCard}>Hit me</Button>
            <Button onClick={onStick}>Stick</Button>
          </div>
        )}
      </div>
      <div className="flex gap-8">
        <label
          htmlFor="bet"
          className="block text-sm font-medium text-gray-700"
        >
          Bet:{" "}
        </label>
        <select
          id="bet"
          name="bet"
          onChange={(e) => onSetBet(parseInt(e.target.value, 10))}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          defaultValue="10"
        >
          <option>10</option>
          <option>20</option>
          <option>50</option>
        </select>
      </div>
      <div className="flex gap-8">
        <div>Score: {score}</div>
        <div>Cards Left: {numCardsLeft}</div>
      </div>
    </div>
  );
};

export default Controls;
