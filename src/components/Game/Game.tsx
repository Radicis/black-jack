import React from "react";
import Player from "./Player/Player";
import CardCount from "./CardCount/CardCount";
import Controls from "../Controls/Controls";
import Dealer from "./Dealer/Dealer";
import useBlackJack from "../../hooks/useBlackJack";

const Game = () => {
  const {
    player,
    dealer,
    gameIsInitialised,
    setPlayerSticks,
    givePlayerACard,
    numCardsLeft,
    startNewRound,
  } = useBlackJack();
  return (
    <main className="flex flex-col relative p-4 h-full">
      {gameIsInitialised ? (
        <>
          <Dealer
            showDealerHand={dealer.showHand}
            currentHandValue={dealer.hand.totalValue}
            cards={dealer.hand.cards}
          />
          <Player
            status={player.status}
            onGetNextCard={givePlayerACard}
            cards={player.hand.cards}
            currentHandValue={player.hand.totalValue}
            onStick={setPlayerSticks}
          />
          <CardCount numCardsLeft={numCardsLeft} />
        </>
      ) : (
        <div>Waiting to start the game</div>
      )}
      <Controls
        onNewRound={startNewRound}
        gameInitialised={gameIsInitialised}
      />
    </main>
  );
};

export default Game;
