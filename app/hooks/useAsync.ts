import { useCallback, useEffect, useState } from 'react';

enum Status {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

type AsyncFunction = () => Promise<unknown>;

export const useAsync = (asyncFunction: AsyncFunction, immediate = true) => {
  const [status, setStatus] = useState(Status.IDLE);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setStatus(Status.PENDING);
      setValue(null);
      setError(null);

      const response = await asyncFunction();
      setValue(response);
      setStatus(Status.SUCCESS);
    } catch (err) {
      setError(err);
      setStatus(Status.ERROR);
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) execute();
  }, []);

  return { execute, status, response: value, error };
};
