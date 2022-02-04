import React, { ReactEventHandler } from "react";
import Button from "../../../shared/Button/Button";

type Props = {
  onHitMe: ReactEventHandler;
  onStick: ReactEventHandler;
};

const PlayerControls = ({ onHitMe, onStick }: Props) => {
  return (
    <div className="flex gap-4">
      <Button onClick={onHitMe}>HIT ME!</Button>
      <Button onClick={onStick}>STICK</Button>
    </div>
  );
};

export default PlayerControls;
