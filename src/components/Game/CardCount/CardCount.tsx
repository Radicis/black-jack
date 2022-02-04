import React from "react";

type Props = {
  numCardsLeft: number;
};

function CardCount({ numCardsLeft = 0 }: Props) {
  return (
    <section>
      <div>Cards Left: {numCardsLeft}</div>
    </section>
  );
}

export default CardCount;
