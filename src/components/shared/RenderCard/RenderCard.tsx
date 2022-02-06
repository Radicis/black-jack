import React from "react";
import { Suit } from "../../../types/types";
import {
  faDizzy,
  faGrinStars,
  faKissWinkHeart,
  faMeh,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  suit: Suit;
  label: string;
  faceUp: boolean;
};

const suitMap = {
  heart: faKissWinkHeart,
  diamond: faGrinStars,
  club: faDizzy,
  spade: faMeh,
};

const RenderCard = ({ suit, label, faceUp }: Props) => {
  const suitIcon = suitMap[suit];
  return (
    <div
      className={`border border-gray-500 p-6 flex flex-col rounded-lg shadow-lg gap-2 items-center text-2xl ${
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
