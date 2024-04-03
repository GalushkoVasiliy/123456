import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

export default function useDebounceState<T = undefined>(
  initialValue: T,
  timeout = 300,
): [
  value: T,
  debounceValue: T,
  setValue: Dispatch<SetStateAction<T>>,
  reset: () => void,
] {
  const [value, setValue] = useState<T>(initialValue);
  const [debounceValue, setDebounceValue] = useState<T>(initialValue);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounceValue(value);
    }, timeout);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const resetSearch = useCallback(() => {
    setValue(initialValue);
    setDebounceValue(initialValue);
  }, [initialValue]);

  return [value, debounceValue, setValue, resetSearch];
}
