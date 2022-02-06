import React from "react";
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
    <main className="flex flex-col relative p-4 h-full gap-8">
      {gameIsInitialised ? (
        <div className="flex gap-8 self-center">
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
        <div>Waiting to start the game</div>
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
