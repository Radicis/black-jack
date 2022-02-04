import React from "react";
import Player from "./Player/Player";
import CardCount from "./CardCount/CardCount";
import Controls from "../Controls/Controls";
import Dealer from "./Dealer/Dealer";
import useBlackJack from "../../hooks/useBlackJack";
import Characters from "./Characters/Characters";

const Game = () => {
  const {
    player,
    dealer,
    gameInitialised,
    initGame,
    setPlayerSticks,
    givePlayerACard,
    numCardsLeft,
  } = useBlackJack();
  return (
    <main className="flex flex-col relative p-4 h-full">
      {gameInitialised ? (
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
      <Characters />
      {/*<Scores players={players} />*/}
      <Controls
        onReset={() => console.log("Reset")}
        onInitGame={initGame}
        gameInitialised={gameInitialised}
      />
    </main>
  );
};

export default Game;
