"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const Clock = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="h-5">
      {time ? format(time, "HH:mm:ss", { locale: ko }) : ""}
    </span>
  );
};

export default Clock;
