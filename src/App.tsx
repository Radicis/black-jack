import React from "react";
import Game from "./components/Game/Game";
import { GameProvider } from "./contexts/gameContext";
import Info from "./components/Info/Info";

const App = () => {
  return (
    <div className="p-12  flex flex-col gap-8 text">
      <header className="text-xl">TwentyOne?</header>
      <GameProvider>
        <Game />
      </GameProvider>
      <Info />
    </div>
  );
};

export default App;
