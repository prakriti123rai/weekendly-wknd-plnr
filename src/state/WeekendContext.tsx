import React, { createContext, useReducer, useContext } from 'react';
import { weekendReducer } from './reducer';
import { WeekendlyState } from '../types';
import { usePersist } from '../hooks/usePersist';

const initialState: WeekendlyState = { 
  activities: {}, 
  schedule: [], 
  ui: { 
    theme: 'default',
    weekendType: 'standard',
    customDays: [],
    dismissedHolidaySuggestions: []
  } 
};

const WeekendContext = createContext<{
  state: WeekendlyState;
  dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });

export const WeekendProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(weekendReducer, initialState);
  
  // Add persistence
  usePersist(state, dispatch);
  
  return <WeekendContext.Provider value={{ state, dispatch }}>{children}</WeekendContext.Provider>;
};

export const useWeekend = () => useContext(WeekendContext);
