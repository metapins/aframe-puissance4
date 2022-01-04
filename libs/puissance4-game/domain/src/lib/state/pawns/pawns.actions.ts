import { IPawn } from '../../entities/pawn';

export const AddPawn = 'puissance4-game/spawn/addPawn';
export const AddPawnSuccess = 'puissance4-game/spawn/addPawnSuccess';
export const AddPawnFailed = 'puissance4-game/spawn/addPawnFailed';
export const ResetPawns = 'puissance4-game/spawn/resetPawns';
export const SetPawnsPlayer = 'puissance4-game/spawn/setPawnsPlayer';
export const RefreshPawns = 'puissance4-game/spawn/refreshPawns';
export const UpdatedPawns = 'puissance4-game/spawn/updatedPawns';
export const CheckWinnerPawns = 'puissance4-game/spawn/checkWinnerPawns';
export const CheckWinnerPawnsSuccess =
  'puissance4-game/spawn/checkWinnerPawnsSuccess';

export const addPawn = (player: string, column: number) => {
  return {
    type: AddPawn,
    player,
    column,
  };
};
export const addPawnSuccess = (pawn: IPawn, nextPlayer: string) => {
  return {
    type: AddPawnSuccess,
    pawn,
    nextPlayer,
  };
};
export const addPawnFailed = () => {
  return {
    type: AddPawnFailed,
  };
};

export const resetPawns = () => {
  return {
    type: ResetPawns,
  };
};

export const setPawnsPlayer = (player: string) => {
  return {
    type: SetPawnsPlayer,
    player,
  };
};

export const refreshPawns = (
  pawns: IPawn[],
  nextPlayer: string | null,
  winner: string | null
) => {
  return {
    type: RefreshPawns,
    pawns,
    nextPlayer,
    winner,
  };
};

export const updatedPawns = (
  pawns: IPawn[],
  nextPlayer: string | null,
  winner: string | null
) => {
  return {
    type: UpdatedPawns,
    pawns,
    nextPlayer,
    winner,
  };
};

export const checkWinnerPawns = (nextPlayer: string | null) => {
  return {
    type: CheckWinnerPawns,
    nextPlayer,
  };
};

export const checkWinnerPawnsSuccess = (
  winner: { winner: string; pawns: Partial<IPawn>[] } | null,
  nextPlayer: string | null
) => {
  return {
    type: CheckWinnerPawnsSuccess,
    winner,
    nextPlayer,
  };
};
