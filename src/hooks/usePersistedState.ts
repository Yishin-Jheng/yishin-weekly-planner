import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { saveJSON } from "../utils/storage";

export function usePersistedState<T>(
  key: string,
  initial: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    saveJSON(key, value);
  }, [key, value]);

  return [value, setValue];
}
