import React from "react";
import CardList from "../../shared/CardList/CardList";
import { Card } from "../../../types/types";

type Props = {
  showDealerHand: boolean;
  cards: Card[];
  currentHandValue: number;
};

const Dealer = ({ showDealerHand, cards, currentHandValue }: Props) => {
  return (
    <section className="flex flex-col gap-4 items-center">
      <CardList
        showHandValue={showDealerHand}
        currentHandValue={currentHandValue}
        cards={cards}
      />
    </section>
  );
};

export default Dealer;
