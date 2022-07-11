import { useState, useEffect } from 'react';

const PLAYER_X = 'X'
const PLAYER_O = 'O'

const STATUS_EMPTY = 'EMPTY'
const STATUS_PLAYER_X = 'X'
const STATUS_PLAYER_O = 'O'
const STATUS_DRAW = 'DRAW'

const INITIAL_GAME = JSON.stringify({
    0: {
      0: {
        value: STATUS_EMPTY
      },
      1: {
        value: STATUS_EMPTY
      },
      2: {
        value: STATUS_EMPTY
      }
    },
    1: {
      0: {
        value: STATUS_EMPTY
      },
      1: {
        value: STATUS_EMPTY
      },
      2: {
        value: STATUS_EMPTY
      }
    },
    2: {
      0: {
        value: STATUS_EMPTY
      },
      1: {
        value: STATUS_EMPTY
      },
      2: {
        value: STATUS_EMPTY
      }
    }
  })

const rowStyle = {
  display: 'flex'
}

const squareStyle = {
  'width':'60px',
  'height':'60px',
  'backgroundColor': '#ddd',
  'margin': '4px',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'fontSize': '20px',
  'color': 'white'
}

const boardStyle = {
  'backgroundColor': '#eee',
  'width': '208px',
  'alignItems': 'center',
  'justifyContent': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'border': '3px #eee solid'
}

const containerStyle = {
  'display': 'flex',
  'alignItems': 'center',
  'flexDirection': 'column'
}

const instructionsStyle = {
  'marginTop': '5px',
  'marginBottom': '5px',
  'fontWeight': 'bold',
  'fontSize': '16px',
  'textAlign': 'center'
}

const buttonStyle = {
  'marginTop': '15px',
  'marginBottom': '16px',
  'width': '80px',
  'height': '40px',
  'backgroundColor': '#8acaca',
  'color': 'white',
  'fontSize': '16px',
}

function getSquareContent(value) {
  switch (value) {
    case STATUS_EMPTY:
      return '';
    case STATUS_PLAYER_O:
      return 'O';
    case STATUS_PLAYER_X:
      return 'X';
    default:
      return '';
  }
}

function calculateGame(content, oldContent, currentPlayer) {
    const newContent = {
      ...oldContent
    }
    
    let status = STATUS_EMPTY;
    
    if (currentPlayer === PLAYER_X) {
      status = STATUS_PLAYER_X        
    }

    if (currentPlayer === PLAYER_O) {
      status = STATUS_PLAYER_O
    }

    newContent[content.lineIndex][content.columnIndex] = {
      value: status
    }    

    return newContent
}

function checkGameEnd(gameMatrix) {
  // check all lines
  
  if (
    gameMatrix[0][0].value === gameMatrix[0][1].value &&
    gameMatrix[0][0].value === gameMatrix[0][2].value
  ) {

    return gameMatrix[0][0].value
  }

  if (
    gameMatrix[1][0].value === gameMatrix[1][1].value &&
    gameMatrix[1][0].value === gameMatrix[1][2].value
  ) {
    return gameMatrix[1][0].value
  }

  if (
    gameMatrix[2][0].value === gameMatrix[2][1].value &&
    gameMatrix[2][0].value === gameMatrix[2][2].value
  ) {
    return gameMatrix[2][0].value
  }

  // check all columns 

  if (
    gameMatrix[0][0].value === gameMatrix[1][0].value &&
    gameMatrix[0][0].value === gameMatrix[2][0].value
  ) {
    return gameMatrix[0][0].value
  }

  if (
    gameMatrix[0][1].value === gameMatrix[1][1].value &&
    gameMatrix[0][1].value === gameMatrix[2][1].value
  ) {
    return gameMatrix[0][1].value
  }

  if (
    gameMatrix[0][2].value === gameMatrix[1][2].value &&
    gameMatrix[0][2].value === gameMatrix[2][2].value
  ) {
    return gameMatrix[0][2].value
  }

  // check all diagonals

  if (
    gameMatrix[0][0].value === gameMatrix[1][1].value &&
    gameMatrix[0][0].value === gameMatrix[2][2].value
  ) {
    return gameMatrix[0][0].value
  }

  if (
    gameMatrix[0][2].value === gameMatrix[1][1].value &&
    gameMatrix[0][2].value === gameMatrix[2][0].value
  ) {
    return gameMatrix[0][2].value
  }

  // if game in progress
  for (let indexLine in gameMatrix) {
    for (let indexColumn in gameMatrix[indexLine]) {
      if (gameMatrix[indexLine][indexColumn].value === STATUS_EMPTY) {
        return STATUS_EMPTY;
      }
    }
  }

  // final option is draw
  return STATUS_DRAW
}

function Square(props) {
  const handleOnClick = () => {
    props.onSquareClick(props)
  }

  return (
    <div
      className="square"
      style={squareStyle}
      onClick={handleOnClick}>
      { getSquareContent(props.columnContent.value) }
    </div>
  );
}

function Line(props) {
  const Columns = () => {
    const columns = []
    for (let index in props.lineItems) {
      columns.push(
        <Square 
          key={'square_' + index}
          lineIndex={props.lineIndex} 
          columnIndex={index} 
          columnContent={props.lineItems[index]} 
          onSquareClick={props.onSquareClick}
        />
      )
    }
    return columns;
  }
  return (
    <div className="board-row" style={rowStyle}>
      <Columns/>
    </div>
  )
}

function GameMatrix(props) {
  const Lines = () => {
    const lines = [];
    for (var index in props.gameMatrix) {
      lines.push(
        <Line 
          key={'line_' + index}
          lineIndex={index} 
          lineItems={props.gameMatrix[index]}
          onSquareClick={props.onSquareClick}
        />
      )
    }
    return lines
  }
  return <Lines/>
}


function Board(props) {
  return (
    <div style={containerStyle} className="gameBoard">
      { 
        !props.winner && (
          <div id="statusArea" className="status" style={instructionsStyle}>
            <h2>Game In Progress</h2>
            Next player: <span>{ props.currentPlayer }</span>
          </div>
        ) 
      }
      { 
        props.winner && (
          <div id="winnerArea" className="winner" style={instructionsStyle}>
            <h2>Game Over!</h2>
            Winner: <span>{ props.winner }</span>
          </div>
        ) 
      }
      <button style={buttonStyle} onClick={props.onResetGame}>Reset</button>
      <div style={boardStyle}>
        <GameMatrix 
          gameMatrix={props.gameMatrix}
          onSquareClick={props.onSquareClick}
        />        
      </div>
    </div>
  );
}

function Game() {
  const [gameMatrix, setGameMatrix] = useState(JSON.parse(INITIAL_GAME))
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_X)
  const [winner, setWinner] = useState(null)

  useEffect(() => {
    const winner = checkGameEnd(gameMatrix)
    if (winner !== STATUS_EMPTY) {
      setWinner(winner)
    }
  }, [currentPlayer, gameMatrix])

  const onSquareClick = (content) => {
    if (content.columnContent.value == STATUS_EMPTY) {
      setGameMatrix((oldContent) => {      
        return calculateGame(content, oldContent, currentPlayer)
      })
      setCurrentPlayer(oldPlayer => {
        if (oldPlayer === PLAYER_X) {
          return PLAYER_O
        }
        return PLAYER_X
      })
    }
  }

  const onResetGame = () => { 
    setGameMatrix(JSON.parse(INITIAL_GAME))
    setCurrentPlayer(PLAYER_X)
    setWinner(null)
  } 

  return (
    <div className="game">
      <div className="game-board">
        <Board
          gameMatrix={gameMatrix}
          currentPlayer={currentPlayer}
          winner={winner}
          onSquareClick={onSquareClick}
          onResetGame={onResetGame}
        />
      </div>
    </div>
  );
}

export default Game;