import { from, map } from 'rxjs';
import { store } from '../../puissance4-game-domain.store';

const state$ = from(store).pipe(map((state) => state.pawns));

export const pawns$ = state$.pipe(map((state) => state.pawns));
export const player$ = state$.pipe(map((state) => state.player));
export const nextPlayer$ = state$.pipe(map((state) => state.nextPlayer));
