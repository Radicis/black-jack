import React, { ReactEventHandler } from "react";
import Button from "../shared/Button/Button";

type Props = {
  onReset: ReactEventHandler;
  onInitGame: ReactEventHandler;
  gameInitialised: boolean;
};

const Controls = ({ gameInitialised, onInitGame }: Props) => {
  return (
    <div className="flex gap-4">
      {gameInitialised ? (
        <>
          <Button onClick={onInitGame}>Next Hand</Button>
        </>
      ) : (
        <Button onClick={onInitGame}>Start Game</Button>
      )}
    </div>
  );
};

export default Controls;
