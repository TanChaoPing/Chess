import { useState, useEffect } from 'react';
import './App.css';

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

function checkDetection(color, board) {
  let opposingColor = (color == "white") ? "black" : "white";
  let check = false;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j].split("-")[0] == color) {
        switch (board[i][j].split("-")[1]) {
          case "pawn":
            check = checkDetectionPawn(color, board, i, j);
            break;
          case "rook":
            check = checkDetectionRook(opposingColor, board, i, j);
            break;
          case "knight":
            check = checkDetectionKnight(opposingColor, board, i, j);
            break;
          case "bishop":
            check = checkDetectionBishop(opposingColor, board, i, j);
            break;
          case "queen":
            check = checkDetectionRook(opposingColor, board, i, j) || checkDetectionBishop(opposingColor, board, i, j);
            break;
          default:
            break;
        }
        if (check) return true;
      }
    }
  }
  return false;
}

function checkDetectionPawn(color, board, c1, c2) {
  // Check top left and top right for White
  if (color == "white" && c1-1 >= 0 && ((c2-1 >= 0 && board[c1-1][c2-1] == "black-king") || (c2+1 < 8 && board[c1-1][c2+1] == "black-king"))) return true;
  // Check top left and top right for Black
  if (color == "black" && c1+1 < 8 && ((c2-1 >= 0 && board[c1+1][c2-1] == "white-king") || (c2+1 < 8 && board[c1+1][c2+1] == "white-king"))) return true;
  return false;
}

function checkDetectionRook(opposingColor, board, c1, c2) {
  // Check Left
  for (let i = c2-1; i >= 0; i--) {
    if (board[c1][i] == `${opposingColor}-king`) return true;
    if (board[c1][i] != "") break;
  }
  // Check Right
  for (let i = c2+1; i < 8; i++) {
    if (board[c1][i] == `${opposingColor}-king`) return true;
    if (board[c1][i] != "") break;
  }
  // Check Up
  for (let i = c1-1; i >= 0; i--) {
    if (board[i][c2] == `${opposingColor}-king`) return true;
    if (board[i][c2] != "") break;
  }
  // Check Down
  for (let i = c1+1; i < 8; i++) {
    if (board[i][c2] == `${opposingColor}-king`) return true;
    if (board[i][c2] != "") break;
  }
  return false;
}

function checkDetectionKnight(opposingColor, board, c1, c2) {
  // Check all 8 knight cells
  let poss = [[c1-2, c1-1], [c1-2, c1+1], [c1-1, c2-2], [c1-1, c2+2], [c1+1, c2-2], [c1+1, c2+2], [c1+2, c1-1], [c1+2, c1+1]];
  for (let p of poss) {
    if (p[0] >= 0 && p[0] < 8 && p[1] >= 0 && p[1] < 8) {
      if (board[p[0]][p[1]] == `${opposingColor}-king`) return true;
    }
  }
  return false;
}

function checkDetectionBishop(opposingColor, board, c1, c2) {
  for (let i = c1-1, j = c2-1; i >= 0, j >= 0; i--, j--) { // NW
    if (i < 0 || j < 0) break;
    if (board[i][j] == `${opposingColor}-king`) return true;
    if (board[i][j] != "") break;
  }
  for (let i = c1-1, j = c2+1; i >= 0, j < 8; i--, j++) { // NE
    if (i < 0 || j > 7) break;
    if (board[i][j] == `${opposingColor}-king`) return true;
    if (board[i][j] != "") break;
  }
  for (let i = c1+1, j = c2-1; i < 8, j >= 0; i++, j--) { // SW
    if (i > 7 || j < 0) break;
    if (board[i][j] == `${opposingColor}-king`) return true;
    if (board[i][j] != "") break;
  }
  for (let i = c1+1, j = c2+1; i < 8, j < 8; i++, j++) { // SE
    if (i > 7 || j > 7) break;
    if (board[i][j] == `${opposingColor}-king`) return true;
    if (board[i][j] != "") break;
  }
  return false;
}

function Cell(props) {
  // Props: board, updateBoard, activeStatus, updateActiveStatus, poss, updatePossibleMoves, prev, updatePrev,
  // turn, updateTurn, target, updateTarget, promote, updatePromote, history, updateHistory, checked, updateChecked

  let bgColor = (props.alp + props.num) % 2 === 0 ? "#C4A484" : "white";
  const coordinate = [props.alp, props.num] // coordinate[0] is H-A, coordinate[1] is 1-8

  if (props.target[72-coordinate[0]][coordinate[1]-1]) bgColor = "pink";

  const [value, setValue] = useState(props.pc)
  
  useEffect(() => {
    setValue(props.pc);
  }, [props.pc]);

  function handleCellClick(activeStat) {
    let skipActive = false;
    (!activeStat) ? skipActive = showPieceMoves(false, value, coordinate) : deactivateOrMove();
    if (!skipActive) props.updateActiveStatus(!activeStat)
  }  
  
  function checkPieceExistOnCell(val, c1, c2, targetedCells) {
    if (props.board[c1][c2] != "") {
      // If different colors
      if (val.split("-")[0] != props.board[c1][c2].split("-")[0] && val.split("-")[1] != "pawn") targetedCells[c1][c2] = true;
      return true;
    }
    return false;
  }

  function checkPawnAttack(val, c1, c2, targetedCells) {
    let curBoard = props.board;
    if (val.split("-")[0] == "white") {
      if (c1-1 >= 0 && c2-1 >= 0 && curBoard[c1-1][c2-1] != "" && curBoard[c1-1][c2-1].split("-")[0] == "black") targetedCells[c1-1][c2-1] = true;
      if (c1-1 >= 0 && c2+1 < 8 && curBoard[c1-1][c2+1] != "" && curBoard[c1-1][c2+1].split("-")[0] == "black") targetedCells[c1-1][c2+1] = true;
    } else {
      if (c1+1 < 8 && c2-1 >= 0 && curBoard[c1+1][c2-1] != "" && curBoard[c1+1][c2-1].split("-")[0] == "white") targetedCells[c1+1][c2-1] = true;
      if (c1+1 < 8 && c2+1 < 8 && curBoard[c1+1][c2+1] != "" && curBoard[c1+1][c2+1].split("-")[0] == "white") targetedCells[c1+1][c2+1] = true;
    }
  }

  function editBoardNPoss(cur, poss, x, y) {
    cur[x][y] = "●";
    poss.push([x, y]);
  }

  function rookCheck(val, coords, curBoard, possibleMoves, targetedCells) {
    for (let i = coords[1]-2; i >= 0; i--) { // Left
      if (checkPieceExistOnCell(val, 72-coords[0], i, targetedCells)) break;
      editBoardNPoss(curBoard, possibleMoves, 72-coords[0], i);
    }
    for (let i = coords[1]; i <= 7; i++) { // Right
      if (checkPieceExistOnCell(val, 72-coords[0], i, targetedCells)) break;
      editBoardNPoss(curBoard, possibleMoves, 72-coords[0], i);
    }
    for (let i = 71 - coords[0]; i >= 0; i--) { // Up
      if (checkPieceExistOnCell(val, i, coords[1]-1, targetedCells)) break;
      editBoardNPoss(curBoard, possibleMoves, i, coords[1]-1);
    }
    for (let i = 73 - coords[0]; i <= 7; i++) { // Down
      if (checkPieceExistOnCell(val, i, coords[1]-1, targetedCells)) break;
      editBoardNPoss(curBoard, possibleMoves, i, coords[1]-1);
    }
  }

  function showPieceMoves(stop, val, coordinateArg) {
    let [pc_color, pc_type] = val.split("-");
    let coords = coordinateArg;
    let curBoard = structuredClone(props.board);
    let possibleMoves = [];
    let targetedCells = structuredClone(props.target);
    if (stop == false) {
      if ((props.turn == true && pc_color == "black") || (props.turn == false && pc_color == "white")) return true;
    }
    
    while (pc_type == "pawn" && pc_color == "white") {
      checkPawnAttack(val, 72-coords[0], coords[1]-1, targetedCells);
      if (coords[0] == 66) { // If pawn is at row G
        if (checkPieceExistOnCell(val, 5, coords[1]-1, targetedCells)) break;
        editBoardNPoss(curBoard, possibleMoves, 5, coords[1]-1);

        if (checkPieceExistOnCell(val, 4, coords[1]-1, targetedCells)) break;
        editBoardNPoss(curBoard, possibleMoves, 4, coords[1]-1);
      } else {
        if (checkPieceExistOnCell(val, 71-coords[0], coords[1]-1, targetedCells)) break;
        editBoardNPoss(curBoard, possibleMoves, 71-coords[0], coords[1]-1);
      }
      break;
    }
    
    while (pc_type == "pawn" && pc_color == "black") {
      checkPawnAttack(val, 72-coords[0], coords[1]-1, targetedCells);
      if (coords[0] == 71) { // If pawn is at row B
        if (checkPieceExistOnCell(val, 2, coords[1]-1, targetedCells)) break;
        editBoardNPoss(curBoard, possibleMoves, 2, coords[1]-1);
        if (checkPieceExistOnCell(val, 3, coords[1]-1, targetedCells)) break;
        editBoardNPoss(curBoard, possibleMoves, 3, coords[1]-1);
      } else {
        if (checkPieceExistOnCell(val, 73-coords[0], coords[1]-1, targetedCells)) break;
        editBoardNPoss(curBoard, possibleMoves, 73-coords[0], coords[1]-1);
      }
      break;
    }
    
    if (pc_type != "pawn") {
      switch (pc_type) {
        case "rook":
          rookCheck(val, coords, curBoard, possibleMoves, targetedCells);
          break;
        case "knight":
          let knightPoss = [];
          knightPoss.push([70 - coords[0], coords[1]-2], [70 - coords[0], coords[1]]) // Top
          knightPoss.push([71 - coords[0], coords[1]-3], [71 - coords[0], coords[1]+1]) // Mid-Top
          knightPoss.push([73 - coords[0], coords[1]-3], [73 - coords[0], coords[1]+1]) // Mid-Low
          knightPoss.push([74 - coords[0], coords[1]-2], [74 - coords[0], coords[1]]) // Low

          for (let k of knightPoss) {
            if (k[0] >= 0 && k[0] <= 7 && k[1] >= 0 && k[1] <= 7) {
              if (checkPieceExistOnCell(val, k[0], k[1], targetedCells)) continue;
              editBoardNPoss(curBoard, possibleMoves, k[0], k[1]);
            }
          }
          break;
        case "queen":
          rookCheck(val, coords, curBoard, possibleMoves, targetedCells);
        case "bishop":
          for (let i = 71 - coords[0], j = coords[1]-2; i >= 0, j >= 0; i--, j--) { // NW
            if (i < 0 || j < 0 || checkPieceExistOnCell(val, i, j, targetedCells)) break;
            editBoardNPoss(curBoard, possibleMoves, i, j);
          }
          for (let i = 71 - coords[0], j = coords[1]; i >= 0, j <= 7; i--, j++) { // NE
            if (i < 0 || j > 7 || checkPieceExistOnCell(val, i, j, targetedCells)) break;
            editBoardNPoss(curBoard, possibleMoves, i, j);
          }
          for (let i = 73 - coords[0], j = coords[1]-2; i <= 7, j >= 0; i++, j--) { // SW
            if (i > 7 || j < 0 || checkPieceExistOnCell(val, i, j, targetedCells)) break;
            editBoardNPoss(curBoard, possibleMoves, i, j);
          }
          for (let i = 73 - coords[0], j = coords[1]; i <= 7, j <= 7; i++, j++) { // SE
            if (i > 7 || j > 7 || checkPieceExistOnCell(val, i, j, targetedCells)) break;
            editBoardNPoss(curBoard, possibleMoves, i, j);
          }
          break;
        case "king":
          for (let i = 71 - coords[0]; i <= 73 - coords[0]; i++) {
            for (let j = coords[1]-2; j <= coords[1]; j++) {
              if (i < 0 || i > 7 || j < 0 || j > 7 || (i == 72 - coords[0] && j == coords[1]-1) || checkPieceExistOnCell(val, i, j, targetedCells)) continue;
              editBoardNPoss(curBoard, possibleMoves, i, j);
            }
          }
          break;
        default: // Cell has no pieces
          return true;
      }
    }

    // Add targeted cells into possible moves.
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (targetedCells[i][j]) possibleMoves.push([i, j]);
      }
    }

    // If checked, limit the possible moves.
    if (props.checked == pc_color) {
      let opposingColor = (pc_color == "white") ? "black" : "white";
      let newPossibleMoves = [];
      for (let p of possibleMoves) {
        const checkBoard = structuredClone(curBoard);
        checkBoard[p[0]][p[1]] = val;
        checkBoard[72-coords[0]][coords[1]-1] = "";
        
        // Check if it's pawn, if so remove the dots in the column
        if (pc_type == "pawn") {
          for (let i = 0; i < 8; i++) {
            if (checkBoard[i][coords[1]-1] == "●") checkBoard[i][coords[1]-1] = "";
          }
        }

        if (checkDetection(opposingColor, checkBoard)) {
          if (curBoard[p[0]][p[1]] == "●") curBoard[p[0]][p[1]] = "";
          targetedCells[p[0]][p[1]] = false;
        } else {
          newPossibleMoves.push(p);
        }
      }
      possibleMoves = [...newPossibleMoves];
    }

    // Ensure you don't accidentally check yourself
    let opposingColor = (pc_color == "white") ? "black" : "white";
    let newPossibleMoves = [];
    for (let p of possibleMoves) {
        const checkBoard = structuredClone(curBoard);
        checkBoard[p[0]][p[1]] = val;
        checkBoard[72-coords[0]][coords[1]-1] = "";
        
        if (checkDetection(opposingColor, checkBoard)) {
          if (curBoard[p[0]][p[1]] == "●") curBoard[p[0]][p[1]] = "";
          targetedCells[p[0]][p[1]] = false;
        } else {
          newPossibleMoves.push(p);
        }
    }
    possibleMoves = [...newPossibleMoves];

    if (stop) {
      let noMoves = true;
      for (let p of possibleMoves) {
        let tempBoard = structuredClone(curBoard);
        tempBoard[p[0]][p[1]] = val;
        tempBoard[72-coords[0]][coords[1]-1] = "";
        
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (tempBoard[i][j] == "●") tempBoard[i][j] = "";
          }
        }

        if (!checkDetection((pc_color == "white") ? "black" : "white", tempBoard)) {
          noMoves = false;
          break;
        }
      }
      return noMoves;
    }

    props.updatePossibleMoves(possibleMoves);
    props.updateTarget(targetedCells);
    props.updateBoard(curBoard);
    if (possibleMoves.length == 0) return true;
    return false;
  }

  function deactivateOrMove() {
    let selectMove = false;
    let possMoves = props.poss;

    // Check if user click on cells with ● (Move)
    for (let coord of possMoves) {
      if (72 - coordinate[0] == coord[0] && coordinate[1] - 1 == coord[1]) {
        selectMove = true;
        break;
      }
    }

    if (selectMove) { // Move the piece
      let newBoard = [...props.board];
      
      for (let coord of props.poss) if (newBoard[coord[0]][coord[1]] == "●") newBoard[coord[0]][coord[1]] = "";
      newBoard[72 - coordinate[0]][coordinate[1] - 1] = props.prev[2];
      newBoard[props.prev[0]][props.prev[1]] = "";

      
      let tempVal = props.prev[2].split("-")

      if (tempVal[1] == "king" && !props.kingMoved) props.updateKingMoved(true);

      // Promotion Detection
      if (tempVal[1] == "pawn") {
        if (tempVal[0] == "white" && 72-coordinate[0] == 0) {
          props.updatePromotion([true, "white", 72-coordinate[0], coordinate[1]-1]);
        }
        if (tempVal[0] == "black" && 72-coordinate[0] == 7) {
          props.updatePromotion([true, "black", 72-coordinate[0], coordinate[1]-1]);
        }
      }

      let inactiveTarget = props.target;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          inactiveTarget[i][j] = false;
        }
      }
      
      // New History Entry
      let newHistoryEntry = structuredClone(newBoard);
      
      // Check Detection
      let pieceColor = newBoard[72-coordinate[0]][coordinate[1]-1].split("-")[0];
      let opposingColor = pieceColor == "white" ? "black" : "white";
      if (checkDetection(pieceColor, [...newBoard])) {
        props.updateChecked(opposingColor);
        
        // Check checkmate & Undo need to reset color
        let checkmated = true;
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (newBoard[i][j].split("-")[0] == opposingColor) {
               if (!showPieceMoves(true, newBoard[i][j], [72-i, j+1])) {
                  checkmated = false;
                  break;
               }
            }
          }
          if (!checkmated) break;
        }
        if (checkmated) props.updateCheckmate(true);
      } else {
        props.updateChecked(null);
      }

      // History + Stuff Update 
      let newHistory = props.history.map(arr => [...arr]);
      newHistory.push(newHistoryEntry);
      props.updateHistory(newHistory);

      props.updateTarget(inactiveTarget);
      props.updateBoard(newBoard);
      props.updateTurn(!props.turn);

      return; 
    }

    // Deactivate
    let inactiveBoard = props.board;
    for (let coord of props.poss) if (inactiveBoard[coord[0]][coord[1]] == "●") inactiveBoard[coord[0]][coord[1]] = "";

    let inactiveTarget = props.target;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        inactiveTarget[i][j] = false;
      }
    }

    props.updateTarget(inactiveTarget);
    props.updateBoard(inactiveBoard);
  }

  return (
    <button
      className="chess-cell"
      id={`${String.fromCharCode(props.alp)}-${props.num}`}
      style={{backgroundColor: `${bgColor}`, disabled: `${props.checkmate}`}}
      onClick={() => {
        handleCellClick(props.activeStatus)
        props.updatePrev([72 - coordinate[0], coordinate[1] - 1, value])
        } 
      }>
      {(value != "" && value != "●") ? <img src={`/${value}.png`} width="60px" height="60px" /> : value}
    </button>
  )
}

function PopupPromotionModal(props) {
  let newBoard = props.board;
  
  function promotion(piece) {
    newBoard[props.c0][props.c1] = `${props.color}-${piece}`;
    props.updateBoard(newBoard);
    props.updatePromotion([false, null, null, null]);
  }

  return (
    <>
      { props.showModal &&
        <div id="popup-bg">
          <div id="popup-modal">
            <h1>Promotion!</h1>
            <p>Which piece do you want to promote the pawn to?</p>
            <button className="promotion-choice" onClick={() => {promotion("queen")}}><img src={`/${props.color}-queen.png`} /></button>
            <button className="promotion-choice" onClick={() => {promotion("knight")}}><img src={`/${props.color}-knight.png`} /></button>
            <button className="promotion-choice" onClick={() => {promotion("rook")}}><img src={`/${props.color}-rook.png`} /></button>
            <button className="promotion-choice" onClick={() => {promotion("bishop")}}><img src={`/${props.color}-bishop.png`} /></button>
          </div>
        </div>
      }
    </>
  )
}

function WinnerWindow(props) {
  let winColor = props.winnerColor ? "White" : "Black";
  return (
    <>
    {
      props.showModal &&
      <div id="winner-bg">
        <div id="winner-modal">
          <h2 id="winner-text">Congratulations! {winColor} has won the game!</h2>
          <button className="game-buttons" onClick={() => {
            props.updateCheckmate(false);
          }}>Close Window</button>
        </div>
      </div>
    }
    </>
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

function defaultTargeted() {
  let targetedBoard = new Array(8);
  for (let i = 0; i < 8; i++) targetedBoard[i] = new Array(8).fill(false);
  return targetedBoard;
}

function ChessBoard() {
  const [active, setActive] = useState(false);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [prevSelected, setPrevSelected] = useState([]);
  const [whiteTurn, setWhiteTurn] = useState(true);
  const [kingMoved, setKingMoved] = useState(false);
  const [promote, setPromote] = useState([false, null, null, null]); // showModal, color, c1, c2
  const [checked, setChecked] = useState(null);
  const [checkmate, setCheckmate] = useState(false);
  const [history, setHistory] = useState([BoardType("default")]);

  const [targeted, setTargeted] = useState(defaultTargeted());
  const [board, setBoard] = useState(BoardType("empty"));
  const [reactBoard, setReactBoard] = useState(updateHTMLBoard());

  useEffect(() => {
    setReactBoard(updateHTMLBoard())
  }, [board, history, targeted, promote, checkmate])

  function undoMove() {
    if (history.length != 1) {
      let newBoard = new Array(8);
      for (let i = 0; i < 8; i++) {
        newBoard[i] = new Array(8);
      }

      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          newBoard[i][j] = history[history.length-2][i][j];
        }
      }
      setTargeted(defaultTargeted());
      setBoard(newBoard);
      
      let newHistory = history.map(arr => [...arr]);
      newHistory.pop();
      setHistory(newHistory);
      setWhiteTurn(!whiteTurn);
    }
  }

  function updateTurn(turn) {setWhiteTurn(turn)}
  function updateKingMoved(status) {setKingMoved(status)}
  function updatePrevSelected(prevCell) {setPrevSelected(prevCell)}
  function updatePossibleMoves(poss) {setPossibleMoves([...poss])}
  function updateArrayBoard(latest_board) {setBoard([...latest_board])}
  function updateActive() {setActive(!active)}
  function updatePromote(arr) {setPromote(arr)}
  function updateChecked(status) {setChecked(status)}
  function updateCheckmate(check) {setCheckmate(check)}
  function updateHistory(hist) {setHistory([...hist])}
  function updateTargets(newTargets) {setTargeted([...newTargets])}
  
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
              kingMoved={kingMoved}
              updateKingMoved={updateKingMoved}
              target={targeted}
              updateTarget={updateTargets}
              updatePromotion={updatePromote}
              checked={checked}
              updateChecked={updateChecked}
              checkmate={checkmate}
              updateCheckmate={updateCheckmate}
              history={history}
              updateHistory={updateHistory}
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
      <WinnerWindow showModal={checkmate} winnerColor={!whiteTurn} updateCheckmate={updateCheckmate}/>
      <PopupPromotionModal showModal={promote[0]} color={promote[1]} c0={promote[2]} c1={promote[3]} board={board} updateBoard={updateArrayBoard} updatePromotion={updatePromote}/>
      <img src="/chess-logo.png" width="235px" height="200px"/>
      <hr id="line"></hr> <br />
      <div id="turn-container">
        <h2 id="turn-display">{whiteTurn ? "White" : "Black"}'s turn to move!</h2>
      </div>
      <br />
      {reactBoard}
      <br /><br />
      <button id="start-game" className="game-buttons" onClick={() => {
        setActive(false);
        setPossibleMoves([]);
        setPrevSelected([]);
        setWhiteTurn(true);
        setKingMoved(false);
        setTargeted(defaultTargeted());
        setChecked(null);
        setCheckmate(false);
        setBoard(BoardType("default"));
        setHistory([BoardType("default")]);
        setReactBoard(updateHTMLBoard());
      }}>Start Game!</button>
      <button id="undo-move" className="game-buttons" onClick={() => {
        undoMove();
      }}>Undo Move</button>
    </>
  )
}

function GamePage() {
  return (
    <div>
      <ChessBoard />
    </div>
  )
}

export default GamePage
