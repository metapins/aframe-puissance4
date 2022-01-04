import produce from 'immer';
import { AnyAction, Reducer } from 'redux';
import { IPawn } from '../../entities/pawn';
import {
  AddPawnSuccess,
  CheckWinnerPawnsSuccess,
  RefreshPawns,
  ResetPawns,
  SetPawnsPlayer,
} from './pawns.actions';

export interface IPawnsState {
  pawns: IPawn[];
  player: string | null;
  winner: string | null;
  nextPlayer: string;
}

const INITIAL_STATE: IPawnsState = {
  pawns: [],
  winner: null,
  nextPlayer: 'yellow',
  player: null,
};

export const pawnsReducer: Reducer<IPawnsState, AnyAction> = (
  state = INITIAL_STATE,
  action: AnyAction
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case AddPawnSuccess:
        draft.pawns.push(action['pawn']);
        draft.nextPlayer = action['nextPlayer'];
        break;

      case CheckWinnerPawnsSuccess:
        {
          const winner = action['winner'];

          if (winner) {
            draft.winner = winner.color;
            for (const pawn of winner.pawns) {
              const storedPawn = draft?.pawns?.find(
                ({ column, line }) =>
                  column === pawn.column && line === pawn.line
              );

              if (storedPawn) storedPawn.winner = true;
            }
          }
        }
        break;

      case ResetPawns:
        draft.pawns = INITIAL_STATE.pawns;
        draft.nextPlayer = INITIAL_STATE.nextPlayer;
        draft.winner = INITIAL_STATE.winner;
        break;

      case SetPawnsPlayer:
        draft.player = action['player'];
        break;

      case RefreshPawns:
        draft.pawns = action['pawns'];
        draft.nextPlayer = action['nextPlayer']
          ? action['nextPlayer']
          : draft.nextPlayer;
        draft.winner = action['winner'];
        break;
    }
  });
};
