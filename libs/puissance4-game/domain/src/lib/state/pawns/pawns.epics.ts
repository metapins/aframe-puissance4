import { nanoid } from 'nanoid';
import { AnyAction } from 'redux';
import { combineEpics, ofType } from 'redux-observable';
import { map, Observable, withLatestFrom } from 'rxjs';
import { IPawn } from '../../entities/pawn';
import { pawnsService } from '../../infrastructure/pawns.service';
import {
  AddPawn,
  addPawnFailed,
  AddPawnSuccess,
  addPawnSuccess,
  CheckWinnerPawns,
  checkWinnerPawns,
  checkWinnerPawnsSuccess,
  CheckWinnerPawnsSuccess,
  ResetPawns,
  updatedPawns,
} from './pawns.actions';
import { IPawnsState } from './pawns.reducer';

const addPawnEpic = (
  action$: Observable<AnyAction>,
  state$: Observable<{ pawns: IPawnsState }>
) =>
  action$.pipe(
    ofType(AddPawn),
    withLatestFrom(state$),
    map(
      ([
        { player, column },
        {
          pawns: { pawns },
        },
      ]) => {
        const step = pawnsService.add(column, pawns);

        if (!step) {
          return addPawnFailed();
        }

        const nextPlayer = player === 'red' ? 'yellow' : 'red';
        const pawn: IPawn = {
          id: nanoid(),
          player,
          column: step.column,
          line: step.line,
          winner: false,
        };

        return addPawnSuccess(pawn, nextPlayer);
      }
    )
  );

const addPawnSuccessEpic = (action$: Observable<AnyAction>) =>
  action$.pipe(
    ofType(AddPawnSuccess),
    map(({ nextPlayer }) => checkWinnerPawns(nextPlayer))
  );

const checkWinnerPawnsEpic = (
  action$: Observable<AnyAction>,
  state$: Observable<{ pawns: IPawnsState }>
) =>
  action$.pipe(
    ofType(CheckWinnerPawns),
    withLatestFrom(state$),
    map(
      ([
        { nextPlayer },
        {
          pawns: { pawns },
        },
      ]) => {
        const winner = pawnsService.checkwin(pawns);
        return checkWinnerPawnsSuccess(winner, nextPlayer);
      }
    )
  );

const checkWinnerPawnsSuccessEpic = (
  action$: Observable<AnyAction>,
  state$: Observable<{ pawns: IPawnsState }>
) =>
  action$.pipe(
    ofType(CheckWinnerPawnsSuccess),
    withLatestFrom(state$),
    map(
      ([
        { nextPlayer, winner },
        {
          pawns: { pawns },
        },
      ]) => {
        pawnsService.updatePawns(pawns, winner?.winner ? null : nextPlayer, winner?.winner || null);
        return updatedPawns(pawns, winner?.winner ? null : nextPlayer, winner?.winner || null);
      }
    )
  );

const resetPawnsEpic = (
  action$: Observable<AnyAction>,
  state$: Observable<{ pawns: IPawnsState }>
) =>
  action$.pipe(
    ofType(ResetPawns),
    withLatestFrom(state$),
    map(
      ([
        ,
        {
          pawns: { pawns },
        },
      ]) => {
        pawnsService.updatePawns(pawns, 'yellow', null);
        return updatedPawns(pawns, 'yellow', null);
      }
    )
  );

export const pawnsEpics = combineEpics(
  addPawnEpic,
  addPawnSuccessEpic,
  checkWinnerPawnsEpic,
  checkWinnerPawnsSuccessEpic,
  resetPawnsEpic
);
