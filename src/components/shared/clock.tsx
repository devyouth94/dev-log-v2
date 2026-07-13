"use client";

import { useEffect, useState } from "react";

const seoulTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Seoul",
});

const getCurrentTime = () => seoulTimeFormatter.format(new Date());

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
