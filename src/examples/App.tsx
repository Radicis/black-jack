import React from "react";
import Game from "./components/Game/Game";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const App = () => {
  return (
    <div className="w-full h-full bg-gradient-to-t from-gray-300 to-gray-200">
      <div className="flex flex-col gap-8 text container mx-auto border-l-2 border-r-2 shadow-xl h-full bg-gray-50">
        <Header />
        <Game />
        <Footer />
      </div>
    </div>
  );
};

export default App;
