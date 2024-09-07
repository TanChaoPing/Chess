import { useState, useEffect } from 'react'
import './App.css'

function defaultPiecePosition(alp, num) {
  let piece;
  switch (alp + "-" + num) {
    // White Special Pieces
    case "A-1":
    case "A-8":
      piece = "white-rook";
      break;
    case "A-2":
    case "A-7":
      piece = "white-knight";
      break;
    case "A-3":
    case "A-6":
      piece = "white-bishop";
      break;
    case "A-4":
      piece = "white-queen";
      break;
    case "A-5":
      piece = "white-king";
      break;
    
    // White Pawns
    case "B-1":
    case "B-2":
    case "B-3":
    case "B-4":
    case "B-5":
    case "B-6":
    case "B-7":
    case "B-8":
      piece = "white-pawn"
      break;
    
    // Black Special Pieces
    case "H-1":
    case "H-8":
      piece = "black-rook";
      break;
    case "H-2":
    case "H-7":
      piece = "black-knight";
      break;
    case "H-3":
    case "H-6":
      piece = "black-bishop";
      break;
    case "H-4":
      piece = "black-queen";
      break;
    case "H-5":
      piece = "black-king";
      break;
    
    // White Pawns
    case "G-1":
    case "G-2":
    case "G-3":
    case "G-4":
    case "G-5":
    case "G-6":
    case "G-7":
    case "G-8":
      piece = "black-pawn";
      break;
    
    // Default
    default:
      piece = "";
      break;
  }
  return piece;
}

function Cell(props) {
  // Props: board, updateBoard, activeStatus, updateActiveStatus, poss, updatePossibleMoves, prev, updatePrev, turn, updateTurn

  const bgColor = (props.alp + props.num) % 2 === 0 ? "#C4A484" : "white";
  const coordinate = [props.alp, props.num] // coordinate[0] is H-A, coordinate[1] is 1-8

  const [value, setValue] = useState(props.pc)
  
  useEffect(() => {
    setValue(props.pc);
  }, [props.pc]);

  function handleCellClick(activeStat) {
    let skipActive = false;
    if (!activeStat) {
      skipActive = showPieceMoves();
    } else {
      deactivateOrMove();
    }
    if (!skipActive) props.updateActiveStatus(!activeStat)
  }  
  
  function showPieceMoves() {
    let [pc_color, pc_type] = value.split("-");
    let curBoard = props.board;
    let possibleMoves = []
    
    if ((props.turn == true && pc_color == "black") || (props.turn == false && pc_color == "white")) return true;

    if (pc_type == "pawn" && pc_color == "white") {
      if (coordinate[0] == 66) { // If pawn is at row G
        curBoard[5][coordinate[1]-1] = "●"
        curBoard[4][coordinate[1]-1] = "●"
        possibleMoves.push([5, coordinate[1]-1], [4, coordinate[1]-1])
      } else {
        curBoard[71 - coordinate[0]][coordinate[1] - 1] = "●"
        possibleMoves.push([71 - coordinate[0], coordinate[1]-1])
      }
    } else if (pc_type == "pawn" && pc_color == "black") {
      if (coordinate[0] == 71) { // If pawn is at row B
        curBoard[2][coordinate[1]-1] = "●"
        curBoard[3][coordinate[1]-1] = "●"
        possibleMoves.push([2, coordinate[1]-1], [3, coordinate[1]-1])
      } else {
        curBoard[73 - coordinate[0]][coordinate[1] - 1] = "●"
        possibleMoves.push([73 - coordinate[0], coordinate[1]-1])
      }
    } else {
      switch (pc_type) {
        case "rook":
          for (let i = coordinate[1]-2; i >= 0; i--) { // Left
            curBoard[72-coordinate[0]][i] = "●";
            possibleMoves.push([72-coordinate[0], i]);
          }
          for (let i = coordinate[1]; i <= 7; i++) { // Right
            curBoard[72-coordinate[0]][i] = "●";
            possibleMoves.push([72-coordinate[0], i]);
          }
          for (let i = 71 - coordinate[0]; i >= 0; i--) { // Up
            curBoard[i][coordinate[1]-1] = "●";
            possibleMoves.push([i, coordinate[1]-1]);
          }
          for (let i = 73 - coordinate[0]; i <= 7; i++) { // Down
            curBoard[i][coordinate[1]-1] = "●";
            possibleMoves.push([i, coordinate[1]-1]);
          }
          break;
        case "knight":
          let knightPoss = [];
          knightPoss.push([70 - coordinate[0], coordinate[1]-2], [70 - coordinate[0], coordinate[1]]) // Top
          knightPoss.push([71 - coordinate[0], coordinate[1]-3], [71 - coordinate[0], coordinate[1]+1]) // Mid-Top
          knightPoss.push([73 - coordinate[0], coordinate[1]-3], [73 - coordinate[0], coordinate[1]+1]) // Mid-Low
          knightPoss.push([74 - coordinate[0], coordinate[1]-2], [74 - coordinate[0], coordinate[1]]) // Low

          for (let k of knightPoss) {
            if (k[0] >= 0 && k[0] <= 7 && k[1] >= 0 && k[1] <= 7) {
              curBoard[k[0]][k[1]] = "●";
              possibleMoves.push([k[0], k[1]]);
            }
          }
          break;
        case "queen":
          for (let i = coordinate[1]-2; i >= 0; i--) { // Left
            curBoard[72-coordinate[0]][i] = "●";
            possibleMoves.push([72-coordinate[0], i]);
          }
          for (let i = coordinate[1]; i <= 7; i++) { // Right
            curBoard[72-coordinate[0]][i] = "●";
            possibleMoves.push([72-coordinate[0], i]);
          }
          for (let i = 71 - coordinate[0]; i >= 0; i--) { // Up
            curBoard[i][coordinate[1]-1] = "●";
            possibleMoves.push([i, coordinate[1]-1]);
          }
          for (let i = 73 - coordinate[0]; i <= 7; i++) { // Down
            curBoard[i][coordinate[1]-1] = "●";
            possibleMoves.push([i, coordinate[1]-1]);
          }
        case "bishop":
          for (let i = 71 - coordinate[0], j = coordinate[1]-2; i >= 0, j >= 0; i--, j--) { // NW
            if (i < 0 || j < 0) break;
            curBoard[i][j] = "●";
            possibleMoves.push([i, j]);
          }
          for (let i = 71 - coordinate[0], j = coordinate[1]; i >= 0, j <= 7; i--, j++) { // NE
            if (i < 0 || j > 7) break;
            curBoard[i][j] = "●";
            possibleMoves.push([i, j])
          }
          for (let i = 73 - coordinate[0], j = coordinate[1]-2; i <= 7, j >= 0; i++, j--) { // SW
            if (i > 7 || j < 0) break;
            curBoard[i][j] = "●";
            possibleMoves.push([i, j])
          }
          for (let i = 73 - coordinate[0], j = coordinate[1]; i <= 7, j <= 7; i++, j++) { // SE
            if (i > 7 || j > 7) break;
            curBoard[i][j] = "●";
            possibleMoves.push([i, j])
          }
          break;
        case "king":
          for (let i = 71 - coordinate[0]; i <= 73 - coordinate[0]; i++) {
            for (let j = coordinate[1]-2; j <= coordinate[1]; j++) {
              if (i < 0 || i > 7 || j < 0 || j > 7 || (i == 72 - coordinate[0] && j == coordinate[1]-1)) continue;
              curBoard[i][j] = "●";
              possibleMoves.push([i, j])
            }
          }
          break;
        default: // Cell has no pieces
          return true;
      }
    }

    props.updateBoard(curBoard);
    props.updatePossibleMoves(possibleMoves);
    return false;
  }

  function deactivateOrMove() {
    let selectMove = false;

    // Check if user click on cells with ●
    for (let coord of props.poss) {
      if (72 - coordinate[0] == coord[0] && coordinate[1] - 1 == coord[1]) {
        selectMove = true;
        break;
      }
    }

    if (selectMove) { // Move the piece
      let newBoard = props.board;
      for (let coord of props.poss) newBoard[coord[0]][coord[1]] = "";

      newBoard[72 - coordinate[0]][coordinate[1] - 1] = props.prev[2];
      newBoard[props.prev[0]][props.prev[1]] = "";
      props.updateBoard(newBoard);
      props.updateTurn(!props.turn);
      return; 
    }

    // If tap on cells other than ●, it will clear all the dots
    let inactiveBoard = props.board;
    for (let coord of props.poss) inactiveBoard[coord[0]][coord[1]] = "";
    props.updateBoard(inactiveBoard);
  }

  return (
    <button
      className="chess-cell"
      id={`${String.fromCharCode(props.alp)}-${props.num}`}
      style={{backgroundColor: `${bgColor}`}}
      onClick={() => {
        handleCellClick(props.activeStatus)
        props.updatePrev([72 - coordinate[0], coordinate[1] - 1, value])
        } 
      }>
      {(value != "" && value != "●") ? <img src={`/${value}.png`} width="60px" height="60px" /> : value}
    </button>
  )
}

function BoardType(type) {
  let board = new Array(8).fill("")
  for (let i = 0; i < 8; i++) {
    board[i] = new Array(8).fill("")
  }

  if (type == "default") {
    for (let i = 72; i >= 65; i--) {
      for (let j = 1; j <= 8; j++) {
        board[-1*i+72][j-1] = defaultPiecePosition(String.fromCharCode(i), j);
      }
    }
  }
  return board;
}

function ChessBoard() {
  const [active, setActive] = useState(false);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [prevSelected, setPrevSelected] = useState([]);
  const [whiteTurn, setWhiteTurn] = useState(true);

  const [board, setBoard] = useState(BoardType("empty"));
  const [reactBoard, setReactBoard] = useState(updateHTMLBoard());

  useEffect(() => {
    setReactBoard(updateHTMLBoard())
  }, [board])

  function updateTurn(turn) {setWhiteTurn(turn);}
  function updatePrevSelected(prevCell) {setPrevSelected(prevCell)}
  function updatePossibleMoves(poss) {setPossibleMoves([...poss])}
  function updateArrayBoard(latest_board) {setBoard([...latest_board])}
  function updateActive() {setActive(!active)}

  function updateHTMLBoard() {
    let HTML_Board = [];
    for (let i = 72; i >= 65; i--) {
      HTML_Board.push(
        function() {
          let rowOfCells = [];
          for (let j = 1; j <= 8; j++) {
            rowOfCells.push(
              <Cell alp={i} num={j} pc={board[-i+72][j-1]} 
              board={board} updateBoard={updateArrayBoard} 
              activeStatus={active} 
              updateActiveStatus={updateActive} 
              poss={possibleMoves}
              updatePossibleMoves={updatePossibleMoves}
              prev={prevSelected}
              updatePrev={updatePrevSelected}
              turn={whiteTurn}
              updateTurn={updateTurn}
              />)
          }
          return <div key={`row-${-i+73}`} id="chessRow">{rowOfCells}</div>;
        }()
      );
    }
    return <div id="chessBoard">{HTML_Board}</div>
  }

  return (
    <>
      {reactBoard}
      <br /><br />
      <button onClick={() => setBoard(BoardType("default"))}>Start Game!</button>
    </>
  )
}

function GamePage() {
  return (
    <>
      <p id="test"></p>
      <ChessBoard />
    </>
  )
}

export default GamePage
