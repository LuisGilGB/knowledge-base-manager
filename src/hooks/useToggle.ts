import { useCallback, useState } from "react";

const useToggle = (initialState: boolean = false) => {
  const [isToggled, setIsToggled] = useState(initialState);
  const toggle = useCallback(() => setIsToggled(prev => !prev), []);
  return [isToggled, toggle] as const;
};

export default useToggle;
