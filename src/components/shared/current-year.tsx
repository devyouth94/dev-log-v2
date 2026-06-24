"use client";

import { useEffect, useState } from "react";

import { formatInSeoulTime } from "src/utils/date";

const getCurrentYear = () => formatInSeoulTime(new Date(), "yyyy");

const CurrentYear = () => {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(getCurrentYear());
  }, []);

  return year;
};

export default CurrentYear;
