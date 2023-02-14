import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  const board = req.query.board as string | undefined;

  if (!board || board.length !== 9 || !board.match(/^[ xo]*$/)) {
    return res.status(400).send("Bad Request - Invalid board");
  }

  const boardArray = board.split("");

  let oCount = 0,
    xCount = 0;

  for (const square of boardArray) {
    if (square === "o") {
      oCount++;
    } else if (square === "x") {
      xCount++;
    }
  }

  const firstPlayer = boardArray.find((square) => square !== " ");

  if (xCount < oCount || (xCount === oCount && firstPlayer === "x")) {
    return res.status(400).send("Bad Request - Not o's turn");
  }

  let moveMade = false;

  // Check for a winning move
  for (let i = 0; i < boardArray.length; i++) {
    if (boardArray[i] === " ") {
      boardArray[i] = "o";
      if (checkForWin(boardArray, "o")) {
        moveMade = true;
        break;
      }
      boardArray[i] = " ";
    }
  }

  // Check for a blocking move
  if (!moveMade) {
    for (let i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === " ") {
        boardArray[i] = "x";
        if (checkForWin(boardArray, "x")) {
          boardArray[i] = "o";
          moveMade = true;
          break;
        }
        boardArray[i] = " ";
      }
    }
  }

  // Make any move if no other moves have been made
  if (!moveMade) {
    for (let i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === " ") {
        boardArray[i] = "o";
        moveMade = true;
        break;
      }
    }
  }

  return res.status(200).send(boardArray.join(""));
});

app.listen(3000, (): void => {
  console.log("Server is listening on port 3000 ");
});

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
