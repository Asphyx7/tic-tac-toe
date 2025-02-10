function Gameboard() {
    const rows = 3
    const columns = 3
    const board = []

    for (i = 0; i < rows; i++) {
        board[i] = []

        for (j = 0; j < columns; j++) {
            board[i].push(Cell())
        }
    }

    const getBoard = () => board

    const getBoardWithValues = () => board.map((row) => row.map((cell) => cell.getSign()))

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getSign()))
        console.log(boardWithCellValues)
    }

    const assignSign = (row,column,player) => {
        board[row][column].addPlayerSign(player)
    }

    return{getBoard,getBoardWithValues,printBoard,assignSign}
}


function Cell() {

    let sign = ""

    const addPlayerSign = (player) => sign = player

    const getSign = () => sign

    return {addPlayerSign,getSign}
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard()
   
    const players = [
        {
            name: playerOneName,
            sign: "X"
        },
        {
            name: playerTwoName,
            sign: "O"
        }
    ]

    let activePlayer = players[0]
    let otherPlayer = players[1]

    const getActivePlayer = () => activePlayer

    const getOtherPlayer = () => otherPlayer

    const switchPlayerTurn = () => {
        if (activePlayer === players[0] && otherPlayer === players[1]) {
            activePlayer = players[1]
            otherPlayer = players[0]
        }
        else {
            activePlayer = players[0]
            otherPlayer = players[1]
        }
    }

    const printNewRound = () => {
        board.printBoard()
        console.log(`It's ${getActivePlayer().name}'s turn`)
    }

    const spotAlreadyTaken = (row,column) => {
        if (board.getBoard()[row][column].getSign() !== "") {
            return true
        }
        else {
            board.assignSign(row,column,getActivePlayer().sign)
            switchPlayerTurn()
        }
    }

    const announceWinner = () => {
        let hasWon = false
        if (board.getBoardWithValues()[0][0] === getOtherPlayer().sign && board.getBoardWithValues()[0][1] === getOtherPlayer().sign && board.getBoardWithValues()[0][2] === getOtherPlayer().sign 
        ||  board.getBoardWithValues()[0][0] === getOtherPlayer().sign && board.getBoardWithValues()[1][0] === getOtherPlayer().sign && board.getBoardWithValues()[2][0] === getOtherPlayer().sign 
        ||  board.getBoardWithValues()[2][0] === getOtherPlayer().sign && board.getBoardWithValues()[2][1] === getOtherPlayer().sign && board.getBoardWithValues()[2][2] === getOtherPlayer().sign  
        ||  board.getBoardWithValues()[2][2] === getOtherPlayer().sign && board.getBoardWithValues()[1][2] === getOtherPlayer().sign && board.getBoardWithValues()[0][2] === getOtherPlayer().sign  
        ||  board.getBoardWithValues()[0][1] === getOtherPlayer().sign && board.getBoardWithValues()[1][1] === getOtherPlayer().sign && board.getBoardWithValues()[2][1] === getOtherPlayer().sign   
        ||  board.getBoardWithValues()[1][0] === getOtherPlayer().sign && board.getBoardWithValues()[1][1] === getOtherPlayer().sign && board.getBoardWithValues()[1][2] === getOtherPlayer().sign 
        ||  board.getBoardWithValues()[0][0] === getOtherPlayer().sign && board.getBoardWithValues()[1][1] === getOtherPlayer().sign && board.getBoardWithValues()[2][2] === getOtherPlayer().sign   
        ||  board.getBoardWithValues()[2][0] === getOtherPlayer().sign && board.getBoardWithValues()[1][1] === getOtherPlayer().sign && board.getBoardWithValues()[0][2] === getOtherPlayer().sign) {
            hasWon = true
            return `Our winner is ${getOtherPlayer().name}`
        } 

        if (!hasWon) {
            const tie = board.getBoardWithValues().map((row) => row.filter((cell) => cell === ""))
            if (tie.filter((row) => row.length !== 0).length === 0) {
                return "Tie!!"
            }
        }
    }

    const playRound = (row,column) => {
        console.log(`Assigning ${getActivePlayer().name}'s sign.`)
        spotAlreadyTaken(row,column)
        announceWinner()
        printNewRound()
    }

    return {getActivePlayer,getOtherPlayer, playRound, board: board.getBoard, printNewRound, boardWithValues: board.getBoardWithValues,announceWinner}
}

function DisplayController() {
    const turn = document.querySelector(".turn");
    const result = document.querySelector(".result");
    const playerOne = document.querySelector("#player-one");
    const playerTwo = document.querySelector("#player-two");
    let startBtn = document.querySelector(".start");
    let resetBtn = document.querySelector(".reset");
    let game;
    
    startBtn.addEventListener("click", event => {
        game = GameController(playerOne.value || "Player One", playerTwo.value || "Player Two")
        let activePlayer = game.getActivePlayer()
        turn.textContent = `It's ${game.getActivePlayer().name}'s turn now...`
        startBtn.disabled = true

        document.addEventListener("click", event => {
            target = event.target
            cell = document.querySelectorAll(".cell")
            if (target.matches(".cell")) {
                game.playRound(target.dataset.row,target.dataset.column)
                activePlayer = game.getActivePlayer()
                otherPlayer = game.getOtherPlayer()
                if (target.textContent === "O" || target.textContent === "X") {
                    return
                }
                else {
                    target.textContent = otherPlayer.sign
                }
                turn.textContent = `It's ${activePlayer.name}'s turn now...`
                winner = game.announceWinner()
                result.textContent = winner

                if (result.textContent !== "") {
                    turn.textContent = "Game over"
                    cell.forEach((element) => element.classList.toggle("cell"))
                }
            }
        })
    })

    resetBtn.addEventListener("click", () => {
        document.querySelectorAll(".cell").forEach(cell => {
            cell.textContent = ""
        })

        result.textContent = ""
        turn.textContent = ""
        startBtn.disabled = false
        game = GameController(playerOne.value || "Player One", playerTwo.value || "Player Two")
    })
}

DisplayController()







