"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    const res = await fetch("/api/hello");
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Button onClick={handleClick}>Say Hello</Button>
      {message && <p className="text-xl">{message}</p>}
    </div>
  );
}
