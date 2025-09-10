import React, { createContext, useReducer, useContext } from 'react';
import { weekendReducer } from './reducer';
import { WeekendlyState } from '../types';

const initialState: WeekendlyState = { activities: {}, schedule: [], ui: { theme: 'default' } };

const WeekendContext = createContext<{
  state: WeekendlyState;
  dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });

export const WeekendProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(weekendReducer, initialState);
  return <WeekendContext.Provider value={{ state, dispatch }}>{children}</WeekendContext.Provider>;
};

export const useWeekend = () => useContext(WeekendContext);
