import React, { useContext } from "react";
import House from "./House/House";
import Player from "./Player/Player";
import CardCount from "./CardCount/CardCount";
import GameContext from "../../contexts/gameContext";
import { PlayerStatus } from "../../types/types";
import Controls from "../Controls/Controls";

const Game = () => {
  const {
    givePlayerACard,
    numCardsLeft,
    setPlayerStatus,
    player,
    resetGame,
    initGame,
    gameOn,
    nextRound,
  } = useContext(GameContext);
  return (
    <main className="flex flex-col items-center justify-center gap-4">
      <House />
      {gameOn && (
        <Player
          status={player.status}
          onGetNextCard={givePlayerACard}
          cards={player.cards}
          currentHandValue={player.currentHandValue}
          onStick={() => setPlayerStatus(PlayerStatus.STICK)}
        />
      )}

      <CardCount numCardsLeft={numCardsLeft} />
      {/*<Scores players={players} />*/}
      <Controls
        onReset={resetGame}
        onInitGame={initGame}
        gameOn={gameOn}
        onNextRound={nextRound}
      />
    </main>
  );
};

export default Game;
