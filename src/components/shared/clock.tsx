"use client";

import { useEffect, useState } from "react";

import { formatInSeoulTime } from "src/utils/date";

const getCurrentTime = () => formatInSeoulTime(new Date(), "HH:mm:ss");

const Clock = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => setTime(getCurrentTime());

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return <span className="h-3 leading-none">{time}</span>;
};

export default Clock;
