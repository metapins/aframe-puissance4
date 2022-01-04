import { createStore } from 'redux-dynamic-modules-core';
import { getObservableExtension } from 'redux-dynamic-modules-observable';
import { getPawnsModule } from './puissance4-game-domain.module';

export const store = createStore(
  {
    extensions: [getObservableExtension()],
  },
  getPawnsModule()
);
