import { createContext, useEffect, useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getAxis } from '../services/axis';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appState, setAppState] = useState([]);

  const {
    execute,
    response: responseAxis,
    status: statusAxis,
    error,
  } = useAsync(() => getAxis());

  useEffect(() => {
    if (statusAxis === 'success') {
      setAppState(responseAxis.data.axis);
    }
  }, [statusAxis]);

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};
