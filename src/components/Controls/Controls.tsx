import React, { ReactEventHandler } from "react";
import Button from "../shared/Button/Button";

type Props = {
  onReset: ReactEventHandler;
  onInitGame: ReactEventHandler;
  onNextRound: ReactEventHandler;
  gameOn: boolean;
};

const Controls = ({ onReset, gameOn, onInitGame, onNextRound }: Props) => {
  return (
    <div className="flex gap-4">
      {gameOn ? (
        <>
          <Button onClick={onNextRound}>Next Round</Button>
          <Button onClick={onReset}>Reset</Button>
        </>
      ) : (
        <Button onClick={onInitGame}>Start Game</Button>
      )}
    </div>
  );
};

export default Controls;
