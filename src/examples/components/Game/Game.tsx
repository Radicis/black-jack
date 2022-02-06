import React from "react";
import Player from "./Player/Player";
import Controls from "../Controls/Controls";
import useBlackJack from "../../../src/hooks/useBlackJack";

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
            showHand
            status={player.status}
            cards={player.hand.cards}
            currentHandValue={player.hand.totalValue}
            name="Player"
          />
          <Player
            showHand={dealer.showHand}
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
        cardsLeft={numCardsLeft}
        score={player.score}
        onSetBet={setCurrentBet}
        onNewRound={startNewRound}
        gameInitialised={gameIsInitialised}
      />
    </main>
  );
};

export default Game;
