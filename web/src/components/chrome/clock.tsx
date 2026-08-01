"use client";

import { useEffect, useState } from "react";

function localTime(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} LOCAL`;
}

/* Ticks every second; renders the placeholder until mounted so server and
   client markup agree. */
export function Clock() {
  const [time, setTime] = useState("--:--:-- LOCAL");

  useEffect(() => {
    const id = setInterval(() => setTime(localTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return <span style={{ whiteSpace: "nowrap" }}>{time}</span>;
}
