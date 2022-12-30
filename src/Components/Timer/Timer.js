import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";


import "./TimerStyles.css";

const formatRemainingTime = time => {
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">00:00</div>;
  }

  return (
    <div className="timer">
      <div className="value">{formatRemainingTime(remainingTime)}</div>
    </div>
  );
};

export default function Timer({ OutOfTime, isPlaying }) {
  return (
    <CountdownCircleTimer
      className='CountdownCircleTimer'
      isPlaying={isPlaying}
      duration={900}
      colors={["#004777", "#F7B801", "#A30000"]}
      size={0}
      strokeWidth={0}
      onComplete={() => OutOfTime()}
    >
      {renderTime}
    </CountdownCircleTimer>
  );
}

