import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getAxis } from '../services/axis';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [axis, setAxis] = useState([]);

  const {
    execute,
    response: responseAxis,
    status: statusAxis,
    error,
  } = useAsync(() => getAxis());

  useEffect(() => {
    if (statusAxis === 'success') {
      setAxis(responseAxis.data.axis);
    }
  }, [statusAxis]);

  const value = useMemo(() => {
    return { axis };
  }, [axis]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useDataProvider = () => useContext(AppContext);
