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
    movementDirection: 1,
    isInterval: false
}

var gCandyInterval;
var isFirstclick = true

// Called when game loads
function onInitGame() {
    gBoard = createBoard()
    renderBoard(gBoard)
    updateScore(0)
    
    gGame.isOn = true
    gIsAlienFreeze = false
    setContent()
    gGame.movementDirection = 1
    if (!isFirstclick) {
    
        gAliensInterval = setInterval(moveAliens, ALIEN_SPEED)

    }
}

function onBtnStart() {
    const elBtn = document.querySelector('.button-start')
    const msg = (gGame.isOn) ? 'Restart the invasion' : 'Start the invasion'
    elBtn.innerText = msg
    clearInterval(gAliensInterval)
    clearInterval(gBlinkLaserInterval)
    gGame.isInterval = false
    isFirstclick = false
    onInitGame()
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

    clearInterval(gAliensInterval)
    clearInterval(gBlinkLaserInterval)
    // clearInterval(gCandyInterval)
    setContent(str)
}

function setContent (str){
    const elContentSpans = document.querySelectorAll('.content span')
    const elContent = document.querySelector('.content')
    const elInnerText = document.querySelector('.game-end')
    
    // Display instructions
    if (gGame.isOn){
        // console.log('elContent :>> ', elContentSpans);
        for (var i = 0; i < elContentSpans.length; i++) {
            const elSpan = elContentSpans[i]
            elSpan.style.display = 'inline'
        } 
        elContent.classList.remove('won')
        elContent.classList.remove('lost')
        elInnerText.innerText = ' '
        return

        // Display game end msg
    } else {
        // Hide spans
        for (var i = 0; i < elContentSpans.length; i++) {
            const elSpan = elContentSpans[i]
            // console.log('elSpan :>> ', elSpan);
            elSpan.style.display = 'none'
        }
    }
    
    // Present won\lost game
    elContent.classList.add(`${str}`)
    
    
    const elMsg = (str === 'won') ? 'You won the game! \nThe aliens are gone!' : 'The invaders concured Earth :('
    elInnerText.innerText = elMsg 
         
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