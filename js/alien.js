'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens;

var gAliensTopRowIdx;
var gAliensBottomRowIdx;
var gLeftEdgeAlien;
var gRightEdgeAlien;


var gIsAlienFreeze = false;

function createAliens(board) {
    gAliensTopRowIdx = 1
    gAliensBottomRowIdx = ALIENS_ROW_COUNT
    gLeftEdgeAlien = 0
    gRightEdgeAlien = ALIENS_ROW_LENGTH - 1
    for (var i = gAliensTopRowIdx; i <= ALIENS_ROW_COUNT; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
            const currCell = board[i][j]
            currCell.gameObject = ALIEN
            gGame.aliensCount++
        }
    }
}

function handleAlienHit(pos) {
    // TODO:  add countAliens function to declare victory
    console.log('Hit')

    updateScore(10)
    gGame.aliensCount--
    updateCell(pos, null)

    // Check victory
    if (gGame.aliensCount === 0) {
        gameEnding('Won')
    }

}

// Moving the aliens
function moveAliens() {
    if (gIsAlienFreeze) return
    // Moving right
    if (gGame.movementDirection > 0) {
        // End of board
        if (gRightEdgeAlien === BOARD_SIZE - 1) {
            shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        } else {
            shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        }
    } else {
        // Moving left    
        // End of board 
        if (gLeftEdgeAlien === 0) {
            shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        } else {
            shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        }
    }

}

function shiftBoardRight(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = gRightEdgeAlien; j >= gLeftEdgeAlien; j--) {
            if (board[i][j].gameObject === null) continue
            const pos = { i: i, j: j }
            // Remove alien from currPos
            updateCell(pos, null)
            // Move alien right
            pos.j++
            updateCell(pos, ALIEN)
        }
    }
    gLeftEdgeAlien++
    gRightEdgeAlien++
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = gLeftEdgeAlien; j <= gRightEdgeAlien; j++) {
            if (board[i][j].gameObject === null) continue
            const pos = { i: i, j: j }
            // Remove alien from currPos
            updateCell(pos, null)
            // Move alien down
            pos.j--
            updateCell(pos, ALIEN)
        }
    }
    gLeftEdgeAlien--
    gRightEdgeAlien--
}

function shiftBoardDown(board, fromI, toI) {
   
    // If the aliens lended
    if (toI + 1 === BOARD_SIZE - 2) {
        gameEnding('lost')
        return
    }

    // Loop the rows of alieans bottom to top
    for (var i = toI; i >= fromI; i--) {
        // Loop to move each alien left to right
        for (var j = gLeftEdgeAlien; j <= gRightEdgeAlien; j++) {
            if (board[i][j].gameObject === null) continue
            const pos = { i: i, j: j }
            // Remove alien from currPos
            updateCell(pos, null)
            // Move alien down
            pos.i++
            updateCell(pos, ALIEN)
        }
    }
    gAliensBottomRowIdx++
    gAliensTopRowIdx++
    gGame.movementDirection *= -1
}
