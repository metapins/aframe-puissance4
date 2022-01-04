import { IPawn } from '../..';
import { store } from '../puissance4-game-domain.store';
import { addPawn, resetPawns, setPawnsPlayer, refreshPawns } from '../state/pawns/pawns.actions';
import { pawns$, player$, nextPlayer$ } from '../state/pawns/pawns.selectors';

class GameFacade {
  public pawns$ = pawns$;
  public player$ = player$;
  public nextPlayer$ = nextPlayer$;

  public addPawn(player: string, column: number): void {
    store.dispatch(addPawn(player, column));
  }

  public reset(): void {
    store.dispatch(resetPawns());
  }

  public refreshPawns(pawns: IPawn[], nextPlayer: string, winner: string) {
    store.dispatch(refreshPawns(pawns, nextPlayer, winner));
  }

  public setPawnsPlayer(player: string) {
    store.dispatch(setPawnsPlayer(player));
  }
}
export const gameFacade = new GameFacade();
