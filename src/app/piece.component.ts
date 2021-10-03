import { CORES, FORMAS, CORES_CLARAS, CORES_ESCURAS } from './constants';

export interface InterfacePeca {
  x: number;
  y: number;
  color: string;
  shape: number[][];
}

export class Peca implements InterfacePeca {
  x: number;
  y: number;
  color: string;
  colorLighter: string;
  colorDarker: string;
  shape: number[][];

  /**
   * 
   * @param ctx Componente Tetris - Gera a peça que surgir
   */
  constructor(private ctx: CanvasRenderingContext2D) {
    this.gerar();
  }

  /**
   * Método para gerar as peças
   */
  gerar() {
    const typeId = this.randomizarPeca(CORES.length - 1);
    this.shape = FORMAS[typeId];
    this.color = CORES[typeId];
    this.colorLighter = CORES_CLARAS[typeId];
    this.colorDarker = CORES_ESCURAS[typeId];
    this.x = typeId === 4 ? 4 : 3;
    this.y = 0;
  }

  private add3D(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    // Cor escura
    ctx.fillStyle = this.colorDarker;
    // Vertical
    ctx.fillRect(x + .9, y, .1, 1);
    // Horizontal
    ctx.fillRect(x, y + .9, 1, .1);

    // Cor escura - dentro 
    // Vertical
    ctx.fillRect(x + .65, y + .3, .05, .3);
    // Horizontal
    ctx.fillRect(x + .3, y + .6, .4, .05);

    // Cor clara - fora
    ctx.fillStyle = this.colorLighter;

    // Cor clara - dentro 
    // Vertical
    ctx.fillRect(x + .3, y + .3, .05, .3);
    // Horizontal
    ctx.fillRect(x + .3, y + .3, .4, .05);

    // Cor clara - fora
    // Vertical
    ctx.fillRect(x, y, .05, 1);
    ctx.fillRect(x, y, .1, .95);
    // Horizontal
    ctx.fillRect(x, y, 1, .05);
    ctx.fillRect(x, y, .95, .1);
  }

  private addNextShadow(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, 1.025, 1.025);
  }

  draw() {
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = this.color;
          const currentX = this.x + x;
          const currentY = this.y + y;
          this.ctx.fillRect(currentX, currentY, 1, 1);
          this.add3D(this.ctx, currentX, currentY);
        }
      });
    });
  }

  drawNext(ctxNext: CanvasRenderingContext2D) {
    ctxNext.clearRect(0, 0, ctxNext.canvas.width, ctxNext.canvas.height);
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.addNextShadow(ctxNext, x, y);
        }
      });
    });

/*
* https://developer.mozilla.org/pt-BR/docs/Web/API/CanvasRenderingContext2D
 */

    ctxNext.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          ctxNext.fillStyle = this.color;
          const currentX = x + .025;
          const currentY = y + .025;
          ctxNext.fillRect(currentX, currentY, 1 - .025, 1 - .025);
          this.add3D(ctxNext, currentX, currentY);
        }
      });
    });
  }

  mover(p: InterfacePeca) {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
    
  }

  randomizarPeca(noOfTypes: number): number {
    return Math.floor(Math.random() * noOfTypes + 1);
  }
}
