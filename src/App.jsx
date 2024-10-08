import { useState, useEffect, useContext, useRef, createContext } from 'react';
import './App.css';

const BoardContext = createContext(null);

function defaultPiecePosition(alp) { // Currying Function
  if (alp == "B") {
    return "white-pawn";
  } else if (alp == "G") {
    return "black-pawn";
  } else {
    return function(num) {
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

        // Default
        default:
          piece = "";
          break;
      }
      return piece;
    }
  }
}

function checkDetection(color, board) {
  let opposingColor = (color == "white") ? "black" : "white";
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j].split("-")[0] == color) {
        let funcArgs = [opposingColor, board, i, j];
        let functionObj = { // Functions into Object
          "pawn": checkDetectionPawn(color, board, i, j),
          "rook": checkDetectionRook(funcArgs),
          "knight": checkDetectionKnight(funcArgs),
          "bishop": checkDetectionBishop(funcArgs),
          "queen": checkDetectionRook(funcArgs) || checkDetectionBishop(funcArgs),
          "king": checkDetectionKing(funcArgs) 
        }
        if (functionObj[board[i][j].split("-")[1]]) return true;
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

function checkDetectionRook(funcArgs) {
  let [opposingColor, board, c1, c2] = funcArgs;
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

function checkDetectionKnight(funcArgs) {
  let [opposingColor, board, c1, c2] = funcArgs;
  // Check all 8 knight cells
  let poss = [[c1-2, c2-1], [c1-2, c2+1], [c1-1, c2-2], [c1-1, c2+2], [c1+1, c2-2], [c1+1, c2+2], [c1+2, c1-1], [c1+2, c1+1]];
  for (let p of poss) {
    if (p[0] >= 0 && p[0] < 8 && p[1] >= 0 && p[1] < 8) {
      if (board[p[0]][p[1]] == `${opposingColor}-king`) return true;
    }
  }
  return false;
}

function checkDetectionBishop(funcArgs) {
  let [opposingColor, board, c1, c2] = funcArgs;
  for (let i = c1-1, j = c2-1; i >= 0 && j >= 0; i--, j--) { // NW
    if (board[i][j] == `${opposingColor}-king`) return true;
    if (board[i][j] != "") break;
  }
  for (let i = c1-1, j = c2+1; i >= 0 && j < 8; i--, j++) { // NE
    if (board[i][j] == `${opposingColor}-king`) return true;
    if (board[i][j] != "") break;
  }
  for (let i = c1+1, j = c2-1; i < 8 && j >= 0; i++, j--) { // SW
    if (board[i][j] == `${opposingColor}-king`) return true;
    if (board[i][j] != "") break;
  }
  for (let i = c1+1, j = c2+1; i < 8 && j < 8; i++, j++) { // SE
    if (board[i][j] == `${opposingColor}-king`) return true;
    if (board[i][j] != "") break;
  }
  return false;
}

function checkDetectionKing(funcArgs) {
  let [opposingColor, board, c1, c2] = funcArgs;
  for (let i = c1-1; i < c1+2; i++) {
    for (let j = c2-1; j < c2+2; j++) {
      if ((c1 == i && c2 == j) || i < 0 || i > 7 || j < 0 || j > 7) continue;
      if (board[i][j] == `${opposingColor}-king`) return true; 
    }
  }
  return false;
}

function checkDraw(whiteCount, blackCount) {
  if (whiteCount == 1 && blackCount == 1) return true;
  return false;
}

function Cell(props) {
  const {board, updateBoard, activeStatus, updateActiveStatus, poss, updatePossibleMoves, prev, updatePrev, turn, updateTurn, whiteKingMoved, updateWhiteKingMoved, blackKingMoved, updateBlackKingMoved, target, updateTarget, updatePromotion, checked, updateChecked, checkmate, updateCheckmate, history, updateHistory, castHis, updateCastHis} = useContext(BoardContext);

  let bgColor = (props.alp + props.num) % 2 === 0 ? "#C4A484" : "white";
  const coordinate = [props.alp, props.num] // coordinate[0] is H-A, coordinate[1] is 1-8

  if (target[72-coordinate[0]][coordinate[1]-1]) bgColor = "pink";

  const [value, setValue] = useState(props.pc)
  
  useEffect(() => {
    setValue(props.pc);
  }, [props.pc]);

  function handleCellClick(activeStat) {
    let skipActive = false;
    (!activeStat) ? skipActive = showPieceMoves(false, value, coordinate) : deactivateOrMove();
    if (!skipActive) updateActiveStatus(!activeStat)
  }  
  
  function checkPieceExistOnCell(val, c1, c2, targetedCells) {
    if (board[c1][c2] != "") {
      // If different colors
      if (val.split("-")[0] != board[c1][c2].split("-")[0] && val.split("-")[1] != "pawn") targetedCells[c1][c2] = true;
      return true;
    }
    return false;
  }

  function checkPawnAttack(val, c1, c2, targetedCells) {
    let curBoard = board;
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
    let curBoard = structuredClone(board);
    let possibleMoves = [];
    let targetedCells = structuredClone(target);
    if (stop == false) {
      if ((turn == true && pc_color == "black") || (turn == false && pc_color == "white")) return true;
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

          // Castling
          if (pc_color == "white" && coords[0] == 65 && !whiteKingMoved && checked != "white") {
            if (curBoard[7][7] == "white-rook" && curBoard[7][6] == "" && curBoard[7][5] == "●") { // King Side
              editBoardNPoss(curBoard, possibleMoves, 7, 6);
            }
            if (curBoard[7][0] == "white-rook" && curBoard[7][1] == "" && curBoard[7][2] == "" && curBoard[7][3] == "●") { // Queen Side
              editBoardNPoss(curBoard, possibleMoves, 7, 2);
            }
          }

          if (pc_color == "black" && coords[0] == 72 && !blackKingMoved && checked != "black") {
            if (curBoard[0][0] == "black-rook" && curBoard[0][1] == "" && curBoard[0][2] == "" && curBoard[0][3] == "●") { // King Side
              editBoardNPoss(curBoard, possibleMoves, 0, 2);
            }
            if (curBoard[0][7] == "black-rook" && curBoard[0][6] == "" && curBoard[0][5] == "●") { // Queen Side
              editBoardNPoss(curBoard, possibleMoves, 0, 6);
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
    if (checked == pc_color) {
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

        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (checkBoard[i][j] == "●") checkBoard[i][j] = "";
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
        
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (checkBoard[i][j] == "●") checkBoard[i][j] = "";
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

    updatePossibleMoves(possibleMoves);
    updateTarget(targetedCells);
    updateBoard(curBoard);
    if (possibleMoves.length == 0) return true;
    return false;
  }

  function deactivateOrMove() {
    let selectMove = false;
    let possMoves = poss;

    // Check if user click on cells with ● (Move)
    for (let coord of possMoves) {
      if (72 - coordinate[0] == coord[0] && coordinate[1] - 1 == coord[1]) {
        selectMove = true;
        break;
      }
    }

    if (selectMove) { // Move the piece
      let newBoard = [...board];
      
      for (let coord of poss) if (newBoard[coord[0]][coord[1]] == "●") newBoard[coord[0]][coord[1]] = "";
      newBoard[72 - coordinate[0]][coordinate[1] - 1] = prev[2];
      newBoard[prev[0]][prev[1]] = "";

      let tempVal = prev[2].split("-")

      // King Move & Castling Move
      let global_king_moved = [false || whiteKingMoved, false || blackKingMoved];
      if (tempVal[0] == "white" && tempVal[1] == "king") {
        if (!whiteKingMoved) {
          if (72-coordinate[0] == 7 && coordinate[1]-1 == 6) { // White King Side
            newBoard[7][7] = "";
            newBoard[7][5] = "white-rook";
          }
          if (72-coordinate[0] == 7 && coordinate[1]-1 == 2) { // White Queen Side
            newBoard[7][0] = "";
            newBoard[7][3] = "white-rook";
          }
        }
        global_king_moved[0] = true; 
        updateWhiteKingMoved(true);
      }
      if (tempVal[0] == "black" && tempVal[1] == "king") {
        if (!blackKingMoved) {
          if (72-coordinate[0] == 0 && coordinate[1]-1 == 6) { // Black King Side
            newBoard[0][7] = "";
            newBoard[0][5] = "black-rook";
          }
          if (72-coordinate[0] == 0 && coordinate[1]-1 == 2) { // Black Queen Side
            newBoard[0][0] = "";
            newBoard[0][3] = "black-rook";
          }
        }
        global_king_moved[1] = true;
        updateBlackKingMoved(true);
      }

      // Promotion Detection
      if (tempVal[1] == "pawn") {
        if (tempVal[0] == "white" && 72-coordinate[0] == 0) {
          updatePromotion([true, "white", 72-coordinate[0], coordinate[1]-1]);
        }
        if (tempVal[0] == "black" && 72-coordinate[0] == 7) {
          updatePromotion([true, "black", 72-coordinate[0], coordinate[1]-1]);
        }
      }

      let inactiveTarget = target;
      let whiteCount = 0, blackCount = 0;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          // Set Inactive Target
          inactiveTarget[i][j] = false;

          // Count number of pieces
          let pc_color = newBoard[i][j].split("-")[0];
          if (pc_color == "white") {
            whiteCount++;
          } else if (pc_color == "black") {
            blackCount++;
          }
        }
      }

      // Check Draw
      if (checkDraw(whiteCount, blackCount)) {
        updateDraw(true);
      }
      
      // New History Entry
      let newHistoryEntry = structuredClone(newBoard);
      
      // Check Detection
      let pieceColor = newBoard[72-coordinate[0]][coordinate[1]-1].split("-")[0];
      let opposingColor = pieceColor == "white" ? "black" : "white";
      if (checkDetection(pieceColor, [...newBoard])) {
        updateChecked(opposingColor);
        
        // Check checkmate & Undo need to reset color
        if (availableMoves(newBoard, opposingColor)) {
          updateCheckmate(true);
          return;
        }
      } else {
        updateChecked(null);
      }

      // Stalemate Detection
      if (availableMoves(newBoard, opposingColor)) updateStalemate(true);

      // History + Stuff Update 
      let newHistory = history.map(arr => [...arr]);
      newHistory.push(newHistoryEntry);
      updateHistory(newHistory);

      let newCastlingHistory = structuredClone(castHis);
      if (turn) {
        newCastlingHistory[0].push(global_king_moved[0]);
      } else {
        newCastlingHistory[1].push(global_king_moved[1]);
      }
      updateCastHis(newCastlingHistory);

      updateTarget(inactiveTarget);
      updateBoard(newBoard);
      updateTurn(!turn);

      return; 
    }

    // Deactivate
    let inactiveBoard = board;
    for (let coord of poss) if (inactiveBoard[coord[0]][coord[1]] == "●") inactiveBoard[coord[0]][coord[1]] = "";

    let inactiveTarget = target;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        inactiveTarget[i][j] = false;
      }
    }

    updateTarget(inactiveTarget);
    updateBoard(inactiveBoard);
  }

  function availableMoves(newBoard, opposingColor) {
    let noMoves = true;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (newBoard[i][j].split("-")[0] == opposingColor) {
            if (!showPieceMoves(true, newBoard[i][j], [72-i, j+1])) {
              noMoves = false;
              break;
            }
        }
      }
      if (!noMoves) break;
    }
    return noMoves;
  }

  return (
    <button
      className="chess-cell"
      id={`${String.fromCharCode(props.alp)}-${props.num}`}
      style={{backgroundColor: `${bgColor}`, disabled: `${checkmate}`}}
      onClick={() => {
        handleCellClick(activeStatus)
        updatePrev([72 - coordinate[0], coordinate[1] - 1, value])
        } 
      }>
      {(value != "" && value != "●") ? <img src={`/${value}.png`} width="60px" height="60px" /> : value}
    </button>
  )
}

function PopupPromotionModal() {
  const {promote, board, updateBoard, updatePromotion} = useContext(BoardContext);
  let [showModal, color, c1, c2] = promote;

  let newBoard = structuredClone(board);
  
  function promotion(piece) {
    newBoard[c1][c2] = `${color}-${piece}`;
    updateBoard(newBoard);
    updatePromotion([false, null, null, null]);
  }

  return (
    <>
      { showModal &&
        <div id="popup-bg">
          <div id="popup-modal">
            <h1>Promotion!</h1>
            <p>Which piece do you want to promote the pawn to?</p>
            <button className="promotion-choice" onClick={() => {promotion("queen")}}><img src={`/${color}-queen.png`} /></button>
            <button className="promotion-choice" onClick={() => {promotion("knight")}}><img src={`/${color}-knight.png`} /></button>
            <button className="promotion-choice" onClick={() => {promotion("rook")}}><img src={`/${color}-rook.png`} /></button>
            <button className="promotion-choice" onClick={() => {promotion("bishop")}}><img src={`/${color}-bishop.png`} /></button>
          </div>
        </div>
      }
    </>
  )
}

function WinnerWindow() {
  const {turn, checkmate, draw, stalemate, updateCheckmate, updateDraw, updateStalemate} = useContext(BoardContext);
  let winColor = turn ? "White" : "Black";
  let showModal = checkmate || draw || stalemate, modalText;

  if (checkmate) {
    modalText = `Congratulations! ${winColor} has won the game!`;
  }
  if (draw) {
    modalText = `The game has ended in a draw!`;
  }
  if (stalemate) {
    modalText = `The game has ended in a stalemate!`;
  }

  return (
    <>
    {
      showModal &&
      <div id="winner-bg">
        <div id="winner-modal">
          <h2 id="winner-text">{modalText}</h2>
          <button className="game-buttons" onClick={() => {
            updateCheckmate(false);
            updateDraw(false);
            updateStalemate(false);
          }}>Close</button>
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
        let rowAlp = String.fromCharCode(i);
        if (rowAlp == "B" || rowAlp == "G") {
          board[-1*i+72][j-1] = defaultPiecePosition(rowAlp);
          continue;
        }
        board[-1*i+72][j-1] = defaultPiecePosition(rowAlp)(j);
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

  const [whiteKingMoved, setWhiteKingMoved] = useState(false);
  const [blackKingMoved, setBlackKingMoved] = useState(false);

  const [promote, setPromote] = useState([false, null, null, null]); // showModal, color, c1, c2
  const [checked, setChecked] = useState(null);
  const [checkmate, setCheckmate] = useState(false);
  const [draw, setDraw] = useState(false);
  const [stalemate, setStalemate] = useState(false);

  const [history, setHistory] = useState([BoardType("default")]);
  const [castlingHistory, setCastlingHistory] = useState([[], []]);

  const [targeted, setTargeted] = useState(defaultTargeted());
  const [board, setBoard] = useState(BoardType("empty"));
  const [reactBoard, setReactBoard] = useState(updateHTMLBoard());

  const turnRef = useRef(null);

  useEffect(() => {
    setReactBoard(updateHTMLBoard())
  }, [board, history, targeted, promote, checkmate])

  useEffect(() => {
    if (whiteTurn) {
      turnRef.current.style.backgroundColor = "white";
      turnRef.current.style.color = "black";
    } else {
      turnRef.current.style.backgroundColor = "black";
      turnRef.current.style.color = "white";
    }
  }, [whiteTurn])

  function resetGame() {
    setActive(false);
    setPossibleMoves([]);
    setPrevSelected([]);
    setWhiteTurn(true);
    setWhiteKingMoved(false);
    setBlackKingMoved(false);
    setTargeted(defaultTargeted());
    setChecked(null);
    setCheckmate(false);
    setDraw(false);
    setStalemate(false);
    setBoard(BoardType("default"));
    setHistory([BoardType("default")]);
    setCastlingHistory([[], []]);
    setReactBoard(updateHTMLBoard());
  }

  function undoMove() {
    if (history.length != 1) {
      let newBoard = structuredClone(history[history.length-2]);
      setTargeted(defaultTargeted());
      setBoard(newBoard);

      let newHistory = history.map(arr => [...arr]);
      newHistory.pop();

      let newCastlingHistory = structuredClone(castlingHistory);
      if (!whiteTurn) {
        if (whiteKingMoved) setWhiteKingMoved(false);
        newCastlingHistory[0].pop();
      } else {
        if (blackKingMoved) setBlackKingMoved(false);
        newCastlingHistory[1].pop();
      }
      setCastlingHistory(newCastlingHistory);

      setHistory(newHistory);
      setWhiteTurn(!whiteTurn);
    }
  }

  function updateTurn(turn) {setWhiteTurn(turn);}
  function updateWhiteKingMoved(status) {setWhiteKingMoved(status)}
  function updateBlackKingMoved(status) {setBlackKingMoved(status)}
  function updatePrevSelected(prevCell) {setPrevSelected(prevCell)}
  function updatePossibleMoves(poss) {setPossibleMoves([...poss])}
  function updateArrayBoard(latest_board) {setBoard([...latest_board])}
  function updateActive() {setActive(!active)}
  function updatePromote(arr) {setPromote(arr)}
  function updateChecked(status) {setChecked(status)}
  function updateCheckmate(check) {setCheckmate(check)}
  function updateDraw(status) {setDraw(status)}
  function updateStalemate(status) {setStalemate(status)}
  function updateHistory(hist) {setHistory([...hist])}
  function updateCastlingHistory(hist) {setCastlingHistory([...hist])}
  function updateTargets(newTargets) {setTargeted([...newTargets])}
  
  const boardProps = {
    board: board,
    updateBoard: updateArrayBoard,
    activeStatus: active,
    updateActiveStatus: updateActive,
    poss: possibleMoves,
    updatePossibleMoves: updatePossibleMoves,
    prev: prevSelected,
    updatePrev: updatePrevSelected,
    turn: whiteTurn,
    updateTurn: updateTurn,
    whiteKingMoved: whiteKingMoved,
    updateWhiteKingMoved: updateWhiteKingMoved,
    blackKingMoved: blackKingMoved,
    updateBlackKingMoved: updateBlackKingMoved,
    target: targeted,
    updateTarget: updateTargets,
    promote: promote,
    updatePromotion: updatePromote,
    checked: checked,
    updateChecked: updateChecked,
    checkmate: checkmate,
    updateCheckmate: updateCheckmate,
    draw: draw,
    updateDraw: updateDraw,
    stalemate: stalemate,
    updateStalemate: updateStalemate,
    history: history,
    updateHistory: updateHistory,
    castHis: castlingHistory,
    updateCastHis: updateCastlingHistory
  }

  function updateHTMLBoard() {
    let HTML_Board = [];
    for (let i = 72; i >= 65; i--) {
      HTML_Board.push(
        function() {
          let rowOfCells = [];
          for (let j = 1; j <= 8; j++) {
            rowOfCells.push( <Cell alp={i} num={j} pc={board[-i+72][j-1]} />)
          }
          return <div key={`row-${-i+73}`} id="chessRow">{rowOfCells}</div>;
        }()
      );
    }
    return <div id="chessBoard">{HTML_Board}</div>
  }

  return (
    <>
      <BoardContext.Provider value={boardProps}>
        <WinnerWindow />
        <PopupPromotionModal />
        
        <img id="chess-logo" src="/chess-logo.png" width="235px" height="200px"/>
        <hr id="line"></hr> <br />

        <div id="turn-container" ref={turnRef}>
          <h2 id="turn-display">{whiteTurn ? "White" : "Black"}'s turn to move!</h2>
        </div>
        <br />

        <div class="select-buttons">
          <button id="undo-move" className="game-buttons" onClick={() => {
            undoMove();
          }}>Undo Move</button>
          <button id="start-game" className="game-buttons" onClick={() => {
            resetGame();
          }}>Start Game!</button>
          <button id="resign" className="game-buttons" onClick={() => {
            setCheckmate(whiteTurn ? "white" : "black");
          }}>Resign</button>
        </div>

        <div class="chess-board">
          {reactBoard}
        </div>
        
        <br /><br />
        
      </BoardContext.Provider>
    </>
  )
}

function GamePage() {
  return (
    <>
      <ChessBoard />
      <br />
      <hr id="line"></hr>
      <p id="credits">Made by: Tan Chao Ping</p>
    </>
  )
}

export default GamePage