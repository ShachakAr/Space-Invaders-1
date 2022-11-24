'use strict'

const LASER_SPEED = 80;

var gHero = {
    pos: { i: 12, j: 5 },
    isShoot: false,
    isRapid: false
};

var gBlinkLaserInterval;

const gLaserPositions = []

// creates the hero and place it on board
function createHero(board) {
    const currCell = board[gHero.pos.i][gHero.pos.j]
    currCell.gameObject = HERO
}

// Handle game keys
function onKeyDown(event) {
    // console.log(event.key)

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
        case 'n':
            explodeProjectile()
            break
        case 'x':
            rapidFire()

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


// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {

    if (gHero.isRapid) {
        gHero.isShoot = false
    }
    // there an active laser/ game-over
    if (gHero.isShoot || !gGame.isOn) return

    gHero.isShoot = true
    const laserNextPos = { i: gHero.pos.i - 1, j: gHero.pos.j }
    // add laser location to the array
    gLaserPositions.push(laserNextPos)
    // if there is no active interval
    if (!gGame.isInterval) {
        gBlinkLaserInterval = setInterval(() => {
            gGame.isInterval = true
            for (var i = 0; i < gLaserPositions.length; i++) {
                
                if (gLaserPositions[0] === null) {
                    gLaserPositions.splice(0, 1)
                    if (gLaserPositions.length === 0) {
                        clearInterval(gBlinkLaserInterval)
                        gGame.isInterval = false
                        return
                    } else {
                        i--
                    } continue
                }
    
                blinkLaser(gLaserPositions[i], i)
                if (gLaserPositions[i] !== null) gLaserPositions[i].i--
            }
        }, LASER_SPEED)

    } 
    else{console.log('there is an interval runing')}

}



function rapidFire() {
    gHero.isRapid = true
    setTimeout(() => {
        gHero.isRapid = false
    }, 3000);
}

function explodeProjectile() {
    if (!gHero.isShoot || gHero.isRapid) return
    // stop laser movment
    clearInterval(gBlinkLaserInterval)
    gGame.isInterval = false
    // Run loop to find negs
    explodeAlienNegs(gLaserPositions[0].i, gLaserPositions[0].j, gBoard)
    gLaserPositions.splice(0, 1, null)
    gHero.isShoot = false 
    console.log(gLaserPositions)
}

function explodeAlienNegs(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].gameObject === ALIEN) handleAlienHit({ i: i, j: j })
            updateCell({ i: i, j: j }, null)
        }
    }
    gHero.isShoot = false
}
console
// renders a LASER at specific cell for short time and removes it
function blinkLaser(nextPos, idx) {
    if (gLaserPositions.length === 0) clearInterval(gBlinkLaserInterval)
    // Hitting the end of the board
    if (nextPos.i < 0) {
        gHero.isShoot = false
        nextPos.i++
        updateCell(nextPos, null)
        // Remove laser from the positions array
        gLaserPositions.splice(idx, 1, null)
        return
    }

    const nextCell = gBoard[nextPos.i][nextPos.j]
    const lastPos = { i: nextPos.i + 1, j: nextPos.j }

    // Hitting empty cell
    if (!nextCell.gameObject) {
        // Show laser
        updateCell(nextPos, LASER)
        // Remove laser from last cell
        if (gBoard[lastPos.i][lastPos.j].gameObject === HERO) return
        updateCell(lastPos, null)
        return

        // hitting a laser   
    } else if (nextCell.gameObject === LASER) {
        // Show laser
        updateCell(nextPos, LASER)
        // Remove laser from last cell
        if (gBoard[lastPos.i][lastPos.j].gameObject === HERO) return
        updateCell(lastPos, null)
        // Remove laser from the positions array
        gLaserPositions.splice(idx - 1, 1, null)
        return

    } else if (nextCell.gameObject === ALIEN) {
        // Remove laser from last cell and clear interval
        gHero.isShoot = false
        updateCell(lastPos, null)
        // Remove alien and acts accordingly
        handleAlienHit(nextPos)
        // Remove laser from the positions array
        gLaserPositions.splice(idx, 1, null)
        // set edges if needed
        setRightAlienIdx()
        setLeftAlienIdx()
        setBottomAlienRow()
        if (gLeftEdgeAlien === 13 && gRightEdgeAlien === 0) gameEnding('won')
        return

    } else if (nextCell.gameObject === BUNKER) {
        console.log('You hit a bunker wall')
        gHero.isShoot = false

        // Remove laser from the positions array
        gLaserPositions.splice(idx, 1, null)

        return
    }
}

function setLeftAlienIdx() {
    var leftEdge = BOARD_SIZE - 1
    for (var i = gAliensBottomRowIdx; i >= gAliensTopRowIdx; i--) {
        for (var j = BOARD_SIZE - 1; j >= 0; j--) {
            if (gBoard[i][j].gameObject === ALIEN) {
                if (j < leftEdge) leftEdge = j
                if (leftEdge === gLeftEdgeAlien) return
            }
        }
    }
    console.log('leftEdge :>> ', leftEdge);
    gLeftEdgeAlien = leftEdge
}

function setRightAlienIdx() {
    var rightEdge = 0
    for (var i = gAliensBottomRowIdx; i >= gAliensTopRowIdx; i--) {
        for (var j = 0; j <= BOARD_SIZE - 1; j++) {
            if (gBoard[i][j].gameObject === ALIEN) {
                if (j > rightEdge) rightEdge = j
                if (rightEdge === gRightEdgeAlien) return
            }
        }
    }
    console.log('rightEdge :>> ', rightEdge);
    gRightEdgeAlien = rightEdge
}

function setBottomAlienRow() {
    for (var i = gAliensBottomRowIdx; i >= gAliensTopRowIdx; i--) {
        for (var j = 0; j < BOARD_SIZE - 1; j++) {
            if (gBoard[i][j].gameObject === ALIEN) {
                return
            }
        }
        gAliensBottomRowIdx--
    }
}

// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject;
    var elCell = getElCell(pos);
    elCell.innerHTML = gameObject || '';
}