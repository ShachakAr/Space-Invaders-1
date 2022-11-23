'use strict'

const HERO = '🗼';
const ALIEN = '👽';
const LASER = '🔺';
const SKY = 'SKY'
const GROUND = 'GROUND'
const BUNKER = 'BUNKER'

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3

var gBoard;
var gGame = {
    isOn: false,
    aliensCount: 0,
    score: 0,
    movementDirection: 1
}

// Called when game loads
function onInitGame() {
    gBoard = createBoard()
    renderBoard(gBoard)
    console.log(gBoard)
    gGame.isOn = true
    updateScore(0)
    
    gIntervalAliens = setInterval(() => {
        moveAliens()
    }, ALIEN_SPEED);

}

// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
function createBoard() {
    const board = buildBoard(BOARD_SIZE, BOARD_SIZE)
    createHero(board)
    createAliens(board)
    return board
}

// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            // Creating spesific class name for every cell
            // var cellClass = getClassNamePos({ i: i, j: j }) + ' '

            // Adding cells type
            var cellClass = (currCell.type === SKY) ? 'sky' : 'ground'

            strHTML += `\t<td data-i='${i}' data-j='${j}' class="cell ${cellClass}" >\n`

            // Adding game elements
            if (currCell.gameObject === ALIEN) {
                strHTML += ALIEN
            } else if (currCell.gameObject === HERO) {
                strHTML += HERO
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    // Insert the table to an HTML container
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function gameEnding(str) {
    console.log('You', str, 'the game')
    gGame.isOn = false
    clearInterval(gIntervalAliens)
    clearInterval(gBlinkLaserInterval)
}

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject;
    var elCell = getElCell(pos);
    elCell.innerHTML = gameObject || '';
}