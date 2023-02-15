import express, { Request, Response } from "express";

const app = express();

// Constants
const BOARD_SIZE: number = 9;
const EMPTY_SQUARE: string = " ";
const PLAYER_X: string = "x";
const PLAYER_O: string = "o";

app.get("/", (req: Request, res: Response) => {
  const board = req.query.board as string | undefined;

  // Check for valid board
  if (!isValidBoard(board)) {
    return res.status(400).send("Bad Request - Invalid board");
  }

  // Play the game
  const result = playGame(board);

  return res.status(200).send(result);
});

app.listen(3000, (): void => {
  console.log("Server is listening on port 3000 ");
});

const isValidBoard = (board: string | undefined): boolean => {
  return (
    board && board.length === BOARD_SIZE && Boolean(board.match(/^[ xo]*$/))
  );
};

// Game logic
const playGame = (board: string): string => {
  const boardArray = board.split("");

  if (!isOsTurn(boardArray)) {
    return "Bad Request - Not o's turn";
  }

  let moveMade = makeWinningMove(boardArray, PLAYER_O);

  if (!moveMade) {
    moveMade = makeBlockingMove(boardArray, PLAYER_X);
  }

  if (!moveMade) {
    makeRandomMove(boardArray, PLAYER_O);
  }

  return boardArray.join("");
};

const isOsTurn = (board: string[]): boolean => {
  const oCount = countSquares(board, PLAYER_O);
  const xCount = countSquares(board, PLAYER_X);
  const firstPlayer = board.find((square) => square !== " ");
  return xCount > oCount || (xCount === oCount && firstPlayer === PLAYER_O);
};

const countSquares = (board: string[], player: string): number => {
  return board.filter((square) => square === player).length;
};

const makeWinningMove = (board: string[], player: string): boolean => {
  for (let square = 0; square < board.length; square++) {
    if (board[square] === EMPTY_SQUARE) {
      board[square] = player;
      if (checkForWin(board, player)) {
        return true;
      }
      board[square] = EMPTY_SQUARE;
    }
  }
  return false;
};

const checkForWin = (board: string[], player: string): boolean => {
  const horizontalWinningPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];
  const verticalWinningPositions = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];
  const diagonalWinningPositions = [
    [0, 4, 8],
    [2, 4, 6],
  ];

  const winningPositions = [
    ...horizontalWinningPositions,
    ...verticalWinningPositions,
    ...diagonalWinningPositions,
  ];

  for (const positions of winningPositions) {
    if (positions.every((position) => board[position] === player)) {
      return true;
    }
  }

  return false;
};

const makeBlockingMove = (boardArray: string[], player: string): boolean => {
  for (let square = 0; square < boardArray.length; square++) {
    if (boardArray[square] === EMPTY_SQUARE) {
      boardArray[square] = player;
      if (checkForWin(boardArray, player)) {
        boardArray[square] = PLAYER_O;
        return true;
      }
      boardArray[square] = EMPTY_SQUARE;
    }
  }
  return false;
};

const makeRandomMove = (boardArray: string[], player: string): void => {
  const emptySquares = boardArray.reduce((acc, curr, idx) => {
    if (curr === EMPTY_SQUARE) acc.push(idx);
    return acc;
  }, [] as number[]);
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  boardArray[emptySquares[randomIndex]] = PLAYER_O;
};
