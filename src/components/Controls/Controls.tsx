import React, { ReactEventHandler } from "react";
import Button from "../shared/Button/Button";

type Props = {
  onReset: ReactEventHandler;
  onInitGame: ReactEventHandler;
  gameInitialised: boolean;
};

const Controls = ({ gameInitialised, onInitGame }: Props) => {
  return (
    <div className="absolute -bottom-20 self-center w-96 gap-4 p-4 flex items-center justify-center rounded-full border-t-2 border-red-400 bg-gray-800">
      {gameInitialised ? (
        <Button onClick={onInitGame}>Next Hand</Button>
      ) : (
        <Button onClick={onInitGame}>Start Game</Button>
      )}
    </div>
  );
};

export default Controls;
