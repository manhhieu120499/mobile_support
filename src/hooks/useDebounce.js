import React, { useEffect, useState } from "react";

export default function useDebounce(value, delay) {
  const [input, setInput] = useState(value);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setInput(value);
    }, [delay]);
    return () => clearTimeout(timeOut);
  });

  return input;
}
