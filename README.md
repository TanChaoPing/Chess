# Chess
Chess is a game of strategy that is played on a 8x8 chessboard. The game involves 2 players, namely "White" and "Black". Each player has a total of 16 pieces, which composes of 8 pawns, 2 rooks, 2 knights, 2 bishops, a queen, and lastly, a king. The goal of the game is to checkmate the opponent's king, in other words, threatening the king such that it is inescapable. In every game, White will go first, followed by Black, the turns will alternate until the game ends.

# Movements:

Each piece in the board has their unique movements, which are listed below.
- **Pawn**: The pawn can only go one tile forward, or two tiles only on its first move. It can capture the opponent's pieces by moving one tile diagonally forward. Pawns are the only piece in the game that capture differently than they move. Once the pawn reaches the other side of the board, it is given a choice to promote it to either a queen, rook, bishop, or knight.
- **Knight**: The knight moves and captures in an L-shaped manner, 2 tiles in one direction and 1 tile perpendicular to it. The knight is the only piece in the game that can jump over other pieces.
- **Bishop**: The bishop can move any number of tiles diagonally, until it sees any piece.
- **Rook**: The rook is similar to the bishop, as it can move any number of tiles horizontally until it sees any piece.
- **Queen**: The queen is the most powerful piece in the game, it is allowed to move diagonally, horizontally, and vertically.
- **King**: The king is the piece that one must be protecting throughout the entire game. If the player's king gets checkmated, the player loses. It can also capture other pieces, however its mobility is limited to its surrounding 8 tiles.

# How to install:

First, clone the repository using the `git clone https://github.com/TanChaoPing/Chess` command to your local desktop if you want to give it a try. Once the repository has been cloned locally, make sure you have Vite installed by running the command `npm install`. This will install all the dependencies inside the Vite project.

After the installation has been completed, the user can run the command `npm run dev` to run the website and play Minesweeper on their desktop locally.

Made by: Tan Chao Ping