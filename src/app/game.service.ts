import { Injectable } from '@angular/core';
import { InterfacePeca } from './piece.component';
import { COLS, LINHAS, PONTOS } from './constants';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  /*
  * Checa se o movimento e a posição da peça é válida.
  */
  valid(p: InterfacePeca, board: number[][]): boolean {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (
          this.isEmpty(value) ||
          (this.insideWalls(x) &&
            this.aboveFloor(y) &&
            this.notOccupied(board, x, y))
        );
      });
    });
  }

  /*
* Checa se está vazio.
*/
  isEmpty(value: number): boolean {
    return value === 0;
  }

  /*
* Checa as paredes de dentro.
*/
  insideWalls(x: number): boolean {
    return x >= 0 && x < COLS;
  }


  /*
* Checa as linhas de cima.
*/
  aboveFloor(y: number): boolean {
    return y <= LINHAS;
  }

  /*
* Checa se determinada parte do tabuleiro está ocupada.
*/
  notOccupied(board: number[][], x: number, y: number): boolean {
    return board[y] && board[y][x] === 0;
  }

  /*
* Determina a rotação da peça
*/
  rotate(piece: InterfacePeca): InterfacePeca {
    let p: InterfacePeca = JSON.parse(JSON.stringify(piece));
    for (let y = 0; y < p.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
      }
    }
    p.shape.forEach(row => row.reverse());
    return p;
  }

  /*
* Definição da pontuação através de quantas linhas foram limpas.
*/
  getLinesClearedPoints(lines: number, level: number): number {
    const lineClearPoints =
      lines === 1
        ? PONTOS.SINGLE
        : lines === 2
          ? PONTOS.DOUBLE
          : lines === 3
            ? PONTOS.TRIPLE
            : lines === 4
              ? PONTOS.TETRIS
              : 0;

    return (level + 1) * lineClearPoints;
  }
}
