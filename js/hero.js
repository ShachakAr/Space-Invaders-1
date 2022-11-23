'use strict'

const LASER_SPEED = 80;

var gHero = { pos: { i: 12, j: 5 }, isShoot: false };
var gBlinkLaserInterval;

// creates the hero and place it on board
function createHero(board) {
    const currCell = board[gHero.pos.i][gHero.pos.j]
    currCell.gameObject = HERO
}

// Handle game keys
function onKeyDown(event) {
    // console.log(event)

    switch (event.key) {
        case 'ArrowLeft':
            moveHero(-1)
            break
        case 'ArrowRight':
            moveHero(1)
            break
        case ' ':
            shoot()
            break
    }
}

// Move the hero right (1) or left (-1)
function moveHero(dir) {
    if (!gGame.isOn) return
    if (gHero.pos.j + dir < 0 || gHero.pos.j + dir > BOARD_SIZE - 1) dir = 0
    // Moving from
    updateCell(gHero.pos, null)
    gHero.pos.j += dir
    // Moving to
    updateCell(gHero.pos, HERO)

}
// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject;
    var elCell = getElCell(pos);
    elCell.innerHTML = gameObject || '';
}

// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
    if (gHero.isShoot || !gGame.isOn) return
    else {
        gHero.isShoot = true
        const laserNextPos = { i: gHero.pos.i - 1, j: gHero.pos.j }

        gBlinkLaserInterval = setInterval(() => {
            blinkLaser(laserNextPos)
            laserNextPos.i--
        }, LASER_SPEED)
    }   
    
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(nextPos) {

    // Hitting the end of the board
    if (nextPos.i < 0) {
        gHero.isShoot = false
        clearInterval(gBlinkLaserInterval)
        nextPos.i++
        updateCell(nextPos, null)
        return
    }

    const nextCell = gBoard[nextPos.i][nextPos.j]
    const lastPos = { i: nextPos.i + 1, j: nextPos.j }
    if (!nextCell.gameObject) {
        // Show laser
        updateCell(nextPos, LASER)
        // Remove laser from last cell
        if (gBoard[lastPos.i][lastPos.j].gameObject === HERO) return
        updateCell(lastPos, null)
        return

    } else if (nextCell.gameObject === ALIEN) {
        // Remove laser from last cell and clear interval
        gHero.isShoot = false
        clearInterval(gBlinkLaserInterval)
        updateCell(lastPos, null)
        // Remove alien and acts accordingly
        handleAlienHit(nextPos)
        // set edges
        setRightAlienIdx()
        setLeftAlienIdx()
        setBottomAlienRow()
        return

    } else if (nextCell.gameObject === BUNKER) {
        console.log('You hit a wall')
        gHero.isShoot = false

        return
    }

}

function setLeftAlienIdx (){
    var leftEdge = BOARD_SIZE - 1
    for (var i = gAliensBottomRowIdx; i >= gAliensTopRowIdx; i--){
        for (var j = BOARD_SIZE -1; j >= 0; j--){
            if (gBoard[i][j].gameObject === ALIEN) {
                if (j < leftEdge) leftEdge = j
                if (leftEdge === gLeftEdgeAlien) return
            }
        }
    }
    gLeftEdgeAlien = leftEdge
}

function setRightAlienIdx (){
    var rightEdge = 0
    for (var i = gAliensBottomRowIdx; i >= gAliensTopRowIdx; i--){
        for (var j = 0; j <= BOARD_SIZE -1; j++){
            if (gBoard[i][j].gameObject === ALIEN) {
                if (j > rightEdge) rightEdge = j
                if (rightEdge === gRightEdgeAlien) return
            }
        }
    }
    gRightEdgeAlien = rightEdge
}

function setBottomAlienRow (){
    for (var i = gAliensBottomRowIdx; i >= gAliensTopRowIdx; i--){
        for (var j = 0; j < BOARD_SIZE - 1; j++){
            if (gBoard[i][j].gameObject === ALIEN) {
                return
            }
        }
        gAliensBottomRowIdx--
    }
}