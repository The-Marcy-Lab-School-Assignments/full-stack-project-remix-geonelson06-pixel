import {
  createContext,
  useContext,
} from 'react';

export const CurrentUserContext =
  createContext();

export const useCurrentUser = () => {
  return useContext(CurrentUserContext);
};