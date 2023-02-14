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

  const firstPlayer = boardArray.find((cell) => cell !== " ");

  if (xCount < oCount || (xCount === oCount && firstPlayer === "x")) {
    return res.status(400).send("Bad Request - Not o's turn");
  }

  for (let i = 0; i < boardArray.length; i++) {
    if (boardArray[i] === " ") {
      boardArray[i] = "o";
      break;
    }
  }

  return res.status(200).send(boardArray.join(""));
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000 ");
});

