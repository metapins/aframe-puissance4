import { IPawn } from '../entities/pawn';

declare const NAF: any;

class PawnsService {
  public updatePawns(
    pawns: IPawn[],
    nextPlayer: string | null,
    winner: string | null
  ) {
    const puissance4Element = document.querySelector('[p4g-game-puissance4]');

    if (!NAF.utils.isMine(puissance4Element)) {
      NAF.utils.takeOwnership(puissance4Element);
    }

    puissance4Element.setAttribute('p4g-game-puissance4', {
      pawns: JSON.stringify(pawns),
      nextPlayer: JSON.stringify(nextPlayer),
      winner: JSON.stringify(winner),
    });
  }

  public add(column: number, pawns: IPawn[]) {
    const grid = this.pawnsToGrid(pawns);
    let line = 1;

    while (line < 7 && grid[line - 1][column - 1] !== '') {
      line++;
    }

    if (line === 7) {
      return null;
    }

    return { line, column };
  }

  public checkwin(
    pawns: IPawn[]
  ): { winner: string; pawns: Partial<IPawn>[] } | null {
    const grid = this.pawnsToGrid(pawns);
    let winner = null;
    let line = 1;

    while (!winner && line <= 6) {
      let column = 1;

      while (!winner && column <= 7) {
        winner = this.checkcase(grid, line, column);
        column++;
      }

      line++;
    }

    return winner;
  }

  private checkcase(
    grid: string[][],
    line: number,
    column: number
  ): { winner: string; pawns: Partial<IPawn>[] } | null {
    const color = grid[line - 1][column - 1];

    if (color === '') {
      return null;
    }

    // check line
    if (
      column <= 4 &&
      grid[line - 1][column] === color &&
      grid[line - 1][column + 1] === color &&
      grid[line - 1][column + 2] === color
    ) {
      return {
        winner: color,
        pawns: [
          { column: column, line: line },
          { column: column + 1, line: line },
          { column: column + 2, line: line },
          { column: column + 3, line: line },
        ],
      };
    }

    // check top
    if (
      line <= 3 &&
      grid[line][column - 1] === color &&
      grid[line + 1][column - 1] === color &&
      grid[line + 2][column - 1] === color
    ) {
      return {
        winner: color,
        pawns: [
          { column: column, line: line },
          { column: column, line: line + 1 },
          { column: column, line: line + 2 },
          { column: column, line: line + 3 },
        ],
      };
    }

    // check diag back
    if (
      line <= 3 &&
      column >= 4 &&
      grid[line][column - 2] === color &&
      grid[line + 1][column - 3] === color &&
      grid[line + 2][column - 4] === color
    ) {
      return {
        winner: color,
        pawns: [
          { column: column, line: line },
          { column: column - 1, line: line + 1 },
          { column: column - 2, line: line + 2 },
          { column: column - 3, line: line + 3 },
        ],
      };
    }

    // check diag forward
    if (
      line <= 3 &&
      column <= 4 &&
      grid[line][column] === color &&
      grid[line + 1][column + 1] === color &&
      grid[line + 2][column + 2] === color
    ) {
      return {
        winner: color,
        pawns: [
          { column: column, line: line },
          { column: column + 1, line: line + 1 },
          { column: column + 2, line: line + 2 },
          { column: column + 3, line: line + 3 },
        ],
      };
    }

    return null;
  }

  private pawnsToGrid(pawns: IPawn[]): string[][] {
    const grid = [
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
    ];

    for (const pawn of pawns) {
      grid[pawn.line - 1][pawn.column - 1] = pawn.player;
    }

    return grid;
  }
}

export const pawnsService = new PawnsService();
