import { useState } from "react";

export const useMessage = () => {
  const [message, setMessage] = useState();

  const displayMessage = (newValue) => {
    setMessage(newValue);
    setTimeout(() => setMessage(false), 3000)
  };

  return { message, displayMessage };
};
