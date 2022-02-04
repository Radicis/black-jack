import React, { useContext } from "react";
import CardList from "../../shared/CardList/CardList";
import GameContext from "../../../contexts/gameContext";

const House = () => {
  const { dealerCards, dealerCount, showDealerCount } = useContext(GameContext);
  return (
    <section className="flex flex-col gap-4 items-center">
      <CardList
        showHandValue={showDealerCount}
        currentHandValue={dealerCount}
        cards={dealerCards}
      />
    </section>
  );
};

export default House;
