export const COLS = 10;
export const LINHAS = 20;
export const TAMANHO_BLOCO = 30;
/**
 * LINHAS_POR_LEVEL - A cada 10 linhas passa-se 1 nível.
 */
export const LINHAS_POR_LEVEL = 10;

/**
 * Declara a corres do preenchimento 
 */
export const CORES = [
  'none',
  'rgba(54, 192, 9)',//Peça 4 partes reta
  'rgba(175, 167, 162)',// Peça L esquerdo
  'rgba(143, 197, 209)',// Peça L esquerdo
  'rgba(196, 79, 193)',// Peça quadrado
  'rgba(191, 52, 6)',// Peça Z direita
  'rgba(239, 205, 61)',// Peça T
  'rgba(255, 0, 0)',// Peça Z direita
];

/*
 * Cores mais claras
 */
export const CORES_CLARAS = [
  'none',
  'rgba(54, 192, 9)',//Peça 4 partes reta
  'rgba(175, 167, 162)',// Peça L esquerdo
  'rgba(143, 197, 209)',// Peça L esquerdo
  'rgba(196, 79, 193)',// Peça quadrado
  'rgba(191, 52, 6)',// Peça Z direita
  'rgba(239, 205, 61)',// Peça T
  'rgba(255, 0, 0)',// Peça Z direita
];

/*
 * Cores mais escuras
 */
export const CORES_ESCURAS = [
  'none',
  'rgba(54, 192, 9)',//Peça 4 partes reta
  'rgba(175, 167, 162)',// Peça L esquerdo
  'rgba(143, 197, 209)',// Peça L esquerdo
  'rgba(196, 79, 193)',// Peça quadrado
  'rgba(191, 52, 6)',// Peça Z direita
  'rgba(239, 205, 61)',// Peça T
  'rgba(255, 0, 0)',// Peça Z direita
];

/*
* Formas
* [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] = Reta ( — )
* [[2, 0, 0], [2, 2, 2], [0, 0, 0]] = L esquerdo ( ⌙ )
* [[0, 0, 3], [3, 3, 3], [0, 0, 0]] = L direito ( ﹂ )
* [[4, 4], [4, 4]] = Quadrado 4x4 ( ▉ )
* [[0, 5, 5], [5, 5, 0], [0, 0, 0]] = Z Invertido ( !Z )
* [[0, 6, 0], [6, 6, 6], [0, 0, 0]] = T invertido ( ┷ )
* [[7, 7, 0], [0, 7, 7], [0, 0, 0]] = Z ( Z )
 */
export const FORMAS = [
  [],
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
  [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
  [[4, 4], [4, 4]],
  [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
  [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
  [[7, 7, 0], [0, 7, 7], [0, 0, 0]],
];

/*
* Código ASCII das teclas ESC, espaço, esquerda, cima, direita, baixo
*/
export class TECLA {
  static readonly ESC = 27;
  static readonly SPACE = 32;
  static readonly LEFT = 37;
  static readonly UP = 38;
  static readonly RIGHT = 39;
  static readonly DOWN = 40;
}


/*
* Pontuação:
* Uma linha: 10 pontos,
* Duas linhas: 30 pontos,
* Três linhas: 50 pontos,
* Drop "suave": 1 ponto a cada linha descida,
* Drop "agressivo": 2 pontos a cada linha descida
*/
export class PONTOS {
  static readonly SINGLE = 100;
  static readonly DOUBLE = 300;
  static readonly TRIPLE = 500;
  static readonly TETRIS = 800;
  static readonly SOFT_DROP = 1;
  static readonly HARD_DROP = 2;
}

/*
* Pontuação ao passar de nível:
* Level inicial: ganha 800 pontos,
* Level 1: ganha 720,
* e assim sucessivamente.
*/
export class LEVEL {
  static readonly 0 = 800;
  static readonly 1 = 720;
  static readonly 2 = 630;
  static readonly 3 = 550;
  static readonly 4 = 470;
  static readonly 5 = 380;
  static readonly 6 = 300;
  static readonly 7 = 220;
  static readonly 8 = 130;
  static readonly 9 = 100;
  static readonly 10 = 80;
  static readonly 11 = 80;
  static readonly 12 = 80;
  static readonly 13 = 70;
  static readonly 14 = 70;
  static readonly 15 = 70;
  static readonly 16 = 50;
  static readonly 17 = 50;
  static readonly 18 = 50;
  static readonly 19 = 30;
  static readonly 20 = 30;
}
