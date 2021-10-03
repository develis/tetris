import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  HostListener,
  AfterViewInit
} from '@angular/core';
import {
  COLS,
  TAMANHO_BLOCO,
  LINHAS,
  CORES,
  CORES_CLARAS,
  LINHAS_POR_LEVEL,
  LEVEL,
  PONTOS,
  TECLA,
  CORES_ESCURAS
} from '../constants';
import { Peca, InterfacePeca } from '../piece';
import { GameService } from '../service';
import { Zoundfx } from 'ng-zzfx';
import { DifficultyComponent } from '../difficulty';

@Component({
  selector: 'game-board',
  templateUrl: 'board.component.html',
  styleUrls: ['board.component.css']
})
export class TabuleiroComponent implements OnInit, AfterViewInit {
  @ViewChild('board', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('next', { static: true })
  /*
   * Iniciando as variáveis dos nossos packages e as que vamos usar durante a implementação do método.
   */
  canvasNext: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  ctxNext: CanvasRenderingContext2D;
  board: number[][];
  piece: Peca;
  next: Peca;
  requestId: number;
  paused: boolean;
  gameStarted: boolean;
  time: { start: number; elapsed: number; level: number };
  points: number;
  highScore: number;
  lines: number;
  level: number;
  @ViewChild(DifficultyComponent) difficulty: DifficultyComponent;


  moves = {
    [TECLA.LEFT]: (p: InterfacePeca): InterfacePeca => ({ ...p, x: p.x - 1 }),
    [TECLA.RIGHT]: (p: InterfacePeca): InterfacePeca => ({ ...p, x: p.x + 1 }),
    [TECLA.DOWN]: (p: InterfacePeca): InterfacePeca => ({ ...p, y: p.y + 1 }),
    [TECLA.SPACE]: (p: InterfacePeca): InterfacePeca => ({ ...p, y: p.y + 1 }),
    [TECLA.UP]: (p: InterfacePeca): InterfacePeca => this.service.rotate(p)
  };
  playSoundFn: Function;

  onGamePadClick(button: number): void {

    let kb = new KeyboardEvent("keydown");

    switch (button) {
      case 1: Object.defineProperty(kb, 'keyCode', {
        get: () => TECLA.UP
      })
        break;
      case 2: Object.defineProperty(kb, 'keyCode', {
        get: () => TECLA.SPACE
      })
        break;
      case 3: Object.defineProperty(kb, 'keyCode', {
        get: () => TECLA.LEFT
      })
        break;
      case 4: Object.defineProperty(kb, 'keyCode', {
        get: () => TECLA.RIGHT
      })
        break;

    }

    this.keyEvent(kb)
  }


  /*
   * "Escutador" de eventos: quando uma tecla é pressionada e validando cada movimento.
   */

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === TECLA.ESC) {
      this.gameOver();
    } else if (this.moves[event.keyCode]) {
      event.preventDefault();
      this.playSoundFn([, 0, 733, .04, .19, 0, , 1.6, 2.2, , , , , .53, .01]);//Quando as peças viram
      // [2.01,,272,.03,.05,0,,.24,4.2,79,231,.05,.08,.2,,,.19,.45,.05]
      // Get new state
      let p = this.moves[event.keyCode](this.piece);
      if (event.keyCode === TECLA.SPACE) {
        // Hard drop
        while (this.service.valid(p, this.board)) {
          this.points += PONTOS.HARD_DROP;
          this.piece.mover(p);
          p = this.moves[TECLA.DOWN](this.piece);
        }
      } else if (this.service.valid(p, this.board)) {
        this.piece.mover(p);
        if (event.keyCode === TECLA.DOWN) {
          this.points += PONTOS.SOFT_DROP;
        }
      }
    }
  }

  constructor(private service: GameService) { }

  ngAfterViewInit(): void {
    let _board = this;
    this.initBoard();
    this.initSound();
    this.initNext();
    this.resetGame();
    this.highScore = 0;

    this.difficulty.onChange = function (newValue: any) {
      let dif: number = _board.difficulty.selectedDifficulty;
      let difName: string = _board.difficulty.difficulties.find(d => d.id == dif).name;

      _board.gameStarted = false;
      cancelAnimationFrame(this.requestId);
      _board.highScore = this.points > this.highScore ? this.points : this.highScore;
      _board.ctx.fillStyle = '#808080';
      _board.ctx.fillRect(1, 3, 8, 1.2);
      _board.ctx.font = "0.5px 'Press Start 2P'";
      _board.ctx.fillStyle = 'red';
      _board.ctx.fillText(`Modo: ${difName}`, 1.5, 4);
    }

    this.difficulty.onChange(1);
    this.difficulty.notifyGameStatus(false);

  }

  /*
   * Inicializando o jogo com as funções de cada elemento do Tetris.
   */

  ngOnInit() {

  }

  /*
   * Função de inicialização para os efeitos sonóros do jogo.
   */

  initSound() {
    this.playSoundFn = Zoundfx.start(0.2);
  }

  /*
   * Inicializando o tabuleiro, utilizando o Canvas Renderização de Contexto de duas Dimensões ( CanvasRenderingContext2D).
   */

  initBoard() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    /*
     * Calcula o tamanho do "canva/quadro" através através da importação do nosso arquivo de constantes.
     */
    this.ctx.canvas.width = COLS * TAMANHO_BLOCO;
    this.ctx.canvas.height = LINHAS * TAMANHO_BLOCO;

    /*
     * Escala compatível com cada bloco.
     */
    this.ctx.scale(TAMANHO_BLOCO, TAMANHO_BLOCO);
  }

  /*
   * Inicializando a próxima peça.
   */

  initNext() {
    this.ctxNext = this.canvasNext.nativeElement.getContext('2d');

    /*
 * Calcula o tamanho do "canva/quadro" através da importação do nosso arquivo de constantes.
    *O +2 é o espaço extra da sombra do próximo bloco.
 */
    this.ctxNext.canvas.width = 4 * TAMANHO_BLOCO + 2;
    this.ctxNext.canvas.height = 4 * TAMANHO_BLOCO;

    this.ctxNext.scale(TAMANHO_BLOCO, TAMANHO_BLOCO);
  }


  /*
* Função para jogar, quando o jogo está iniciado, reseta os pontos e constroi as peças.
*/
  play() {
    this.gameStarted = true;
    this.resetGame();
    this.next = new Peca(this.ctx);
    this.piece = new Peca(this.ctx);
    this.next.drawNext(this.ctxNext);
    this.time.start = performance.now();

    /*
* Se tem um jogo antigo ele cancela o antigo e inicia o novo.
*/
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }

    this.animate();
    this.difficulty.notifyGameStatus(true);
  }


  /*
* Função para resetar o jogo (pontos, linhas, leve, tabuleiro, tempo e despausar).
*/
  resetGame() {
    this.points = 0;
    this.lines = 0;
    this.level = 0;
    this.board = this.getEmptyBoard();
    this.time = { start: 0, elapsed: 0, level: LEVEL[this.level + 1 * this.difficulty.selectedDifficulty] };
    this.paused = false;
    this.addOutlines();
  }


  /*
* Função responsável pela animação da descida do bloco.
*/
  animate(now = 0) {
    this.time.elapsed = now - this.time.start;
    if (this.time.elapsed > this.time.level) {
      this.time.start = now;
      /*
* Se não houver mais como descer uma peça, acaba o jogo.
*/
      if (!this.drop()) {
        this.gameOver();
        return;
      }
    }
    this.draw();
    /*
      * Despacha um evento de evento sintético para o destino e retorna verdadeiro se o valor do atributo cancelável do evento for falso ou se seu *método preventDefault() não tiver sido invocado, e falso caso contrário.
 */
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  /*
   * Chamamos uma função do Canvas para desenhar as peças e o tabuleiro. 
   */
  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.piece.draw();
    this.drawBoard();
  }


  /*
 * Função para a descida de peças, considerando a tecla pressionada, a peça que está descendo e avalidação da mesma.
  * Confere também se houve uma linha que foi limpa e também se o eixo Y (vertical) está ok para receber mais peças,
  * caso contrário o jogo é encerrado.
 */
  drop(): boolean {
    let p = this.moves[TECLA.DOWN](this.piece);
    if (this.service.valid(p, this.board)) {
      this.piece.mover(p);
    } else {
      this.freeze();
      this.clearLines();
      if (this.piece.y === 0) {
        return false;
      }
      /*
       * Função de um package que emite som quando a peça "dropa" embaixo. 
      * https://www.npmjs.com/package/ng-zzfx
       */
      this.playSoundFn([, , 272, .03, .05, 0, , .24, 4.2, 79, 231, .05, .08, .2, .19, .45, .05]);
      [, , 224, .02, .02, .08, 10, 1.7, -13.9, , , , , , 6.7]

      this.piece = this.next;
      this.next = new Peca(this.ctx);
      this.next.drawNext(this.ctxNext);
    }
    return true;
  }


  /*
 * Função que faz a "limpa" nas linhas preenchidas, percorre todo o tabuleiro e checa cada condição.
  * Também checa se a pessoa tem condições o suficiente para passar de level.
 */
  clearLines() {
    let lines = 0;
    this.board.forEach((row, y) => {
      if (row.every(value => value !== 0)) {
        lines++;
        this.board.splice(y, 1);
        this.board.unshift(Array(COLS).fill(0));
      }
    });
    if (lines > 0) {
      this.points += this.service.getLinesClearedPoints(lines, this.level);
      this.lines += lines;
      if (this.lines >= LINHAS_POR_LEVEL) {
        this.level++;
        this.lines -= LINHAS_POR_LEVEL;
        this.time.level = LEVEL[this.level + 1 * this.difficulty.selectedDifficulty];
      }
    }
  }


  /*
* Pegar o espaço da peça dentro do tabuleiro e saber quais quadrados está ocupando.
*/
  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.board[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  /*
* Contruindo a peça com as cores respectivas descritas no arquivo de constantes.
*/

  private add3D(x: number, y: number, color: number): void {
    /*
    * Cor mais escura 
    */
    this.ctx.fillStyle = CORES_ESCURAS[color];
    /*
    * Vertical
    */
    this.ctx.fillRect(x + .9, y, .1, 1);
    /*
    * Horizontal
    */
    this.ctx.fillRect(x, y + .9, 1, .1);

    /*
    * Cor mais escura (preenchimento)
    */
    /*
    * Vertical
    */
    this.ctx.fillRect(x + .65, y + .3, .05, .3);
    /*
    * Horizontal
    */
    this.ctx.fillRect(x + .3, y + .6, .4, .05);

    /*
    * Cor mais clara (parte de fora)
    */
    this.ctx.fillStyle = CORES_CLARAS[color];

    /*
    * Cor mais clara (preenchimento)
    */
    /*
    * Vertical
    */
    this.ctx.fillRect(x + .3, y + .3, .05, .3);
    /*
    * Horizontal
    */
    this.ctx.fillRect(x + .3, y + .3, .4, .05);

    /*
    * Cor mais clara (parte de fora)
    */
    /*
    * Vertical
    */
    this.ctx.fillRect(x, y, .05, 1);
    this.ctx.fillRect(x, y, .1, .95);
    /*
    * Horizontal
    */
    this.ctx.fillRect(x, y, 1, .05);
    this.ctx.fillRect(x, y, .95, .1);
  }


  /*
* Adicionando o contorno preto
*/
  private addOutlines() {
    for (let index = 1; index < COLS; index++) {
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(index, 0, .025, this.ctx.canvas.height);
    }

    for (let index = 1; index < LINHAS; index++) {
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, index, this.ctx.canvas.width, .025);
    }
  }


  /*
* Desenhando o tabuleiro
*/
  drawBoard() {
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = CORES[value];
          this.ctx.fillRect(x, y, 1, 1);
          this.add3D(x, y, value);
        }
      });
    });
    this.addOutlines();
  }


  /*
* Função chamada quando o jogador pausa o jogo.
*/
  pause() {
    if (this.gameStarted) {
      if (this.paused) {
        this.animate();
      } else {
        this.ctx.font = "0.7px 'Press Start 2P'";
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('JOGO PAUSADO', 1, 4);
        cancelAnimationFrame(this.requestId);
      }

      this.paused = !this.paused;
    }
  }

  /*
* Função quando o jogador perde.
*/
  gameOver() {
    this.gameStarted = false;
    cancelAnimationFrame(this.requestId);
    this.highScore = this.points > this.highScore ? this.points : this.highScore;
    this.ctx.fillStyle = '#808080';
    this.ctx.fillRect(1, 3, 8, 1.2);
    this.ctx.font = "0.8px 'Press Start 2P'";
    this.ctx.fillStyle = 'red';
    this.ctx.fillText('GAME OVER', 1.5, 4);
    this.difficulty.notifyGameStatus(false);
  }

  /*
* Getter para quando o tabuleiro está vazio
*/
  getEmptyBoard(): number[][] {
    return Array.from({ length: LINHAS }, () => Array(COLS).fill(0));
  }
}
