import React from "react";
import { Card, Suit } from "../../../types/types";
import {
  faDizzy,
  faGrinStars,
  faKissWinkHeart,
  faMeh,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  card: Card;
};

const suitMap = {
  heart: faKissWinkHeart,
  diamond: faGrinStars,
  club: faDizzy,
  spade: faMeh,
};

const RenderCard = ({ card }: Props) => {
  const { suit, label, faceUp } = card;
  const suitIcon = suitMap[Suit[suit] as Suit];
  return (
    <div
      className={`border border-black p-4 shadow flex flex-col gap-2 items-center text-2xl ${
        faceUp ? "opacity-100" : "opacity-20"
      }`}
    >
      <span>{faceUp ? label : "??"}</span>
      {faceUp ? (
        <FontAwesomeIcon icon={suitIcon} />
      ) : (
        <FontAwesomeIcon icon={faQuestionCircle} />
      )}
    </div>
  );
};

export default RenderCard;
