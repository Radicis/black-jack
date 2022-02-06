import React, { useEffect } from "react";
import useBlackJack from "../../hooks/useBlackJack";
import Player from "./Player/Player";
import Controls from "../Controls/Controls";

const Game = () => {
  const {
    player,
    dealer,
    gameIsInitialised,
    roundActive,
    setPlayerSticks,
    givePlayerACard,
    numCardsLeft,
    startNewRound,
    setCurrentBet,
  } = useBlackJack();

  return (
    <main className="flex flex-col relative p-4 gap-8 height-full">
      {gameIsInitialised ? (
        <div className="flex flex-col md:flex-row gap-8 self-center ">
          <Player
            showHandValue
            status={player.status}
            cards={player.hand.cards}
            currentHandValue={player.hand.totalValue}
            name="Player"
          />
          <Player
            showHandValue={dealer.showHand}
            currentHandValue={dealer.hand.totalValue}
            cards={dealer.hand.cards}
            name="Dealer"
            status={dealer.status}
          />
        </div>
      ) : (
        <div className="text-xl font-medium flex items-center justify-center">
          Waiting to start the game
        </div>
      )}
      <Controls
        roundActive={roundActive}
        onGetNextCard={givePlayerACard}
        onStick={setPlayerSticks}
        numCardsLeft={numCardsLeft}
        score={player.score}
        onSetBet={setCurrentBet}
        onNewRound={startNewRound}
        gameInitialised={gameIsInitialised}
      />
    </main>
  );
};

export default Game;
