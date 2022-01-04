import { pawnsEpics } from './state/pawns/pawns.epics';
import { pawnsReducer } from './state/pawns/pawns.reducer';

export function getPawnsModule() {
  return {
    id: 'pawns-module',
    reducerMap: {
      pawns: pawnsReducer,
    },
    epics: [pawnsEpics],
    // Actions to fire when this module is added/removed
    // initialActions: [],
    // finalActions: [],
  };
}
