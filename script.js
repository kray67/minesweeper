const ROWS = 15
const COLS = 15
const TOTAL_SQUARES = ROWS*COLS
const TOTAL_MINES = 25
const SQUARES = []

/* Square Obj Template {
    id: '1-1', // STR: row num & col num
    row: 1, // INT: row num
    col: 1, // INT: col num
    mine: false, // BOOL: square is mine
    near: 1, // INT: sum of neighbour mines
    empty: false, // BOOL: square is empty
    show: false // BOOL: square is opened
} */

const $board = document.getElementById('board')
const $minefield = document.getElementById('minefield')
const $gameOver = document.getElementById('gameOver')
// Set number of columns to be used in CSS grid
$minefield.style.setProperty('--col-count', COLS)

const createSquares = () => {
    let row = 1
    let col = 1
    for (let i = 1; i < (TOTAL_SQUARES + 1); i++) {
        SQUARES.push({
            id: i,
            row: row,
            col: col,
            mine: false,
            near: null,
            empty: false,
            show: false
        })
        row++
        if (row === ROWS + 1) {
            row = 1
            col++
        }
    }
    addMines()
}

const addMines = () => {
    const numbers = new Set()
    while (numbers.size < TOTAL_MINES) {
        const randomNumber = Math.floor(Math.random() * TOTAL_SQUARES) + 1
        numbers.add(randomNumber)
    }

    const MINE_IDS = Array.from(numbers)
    MINE_IDS.map(id => {
        SQUARES.find(square => square.id === id).mine = true
    })

    checkNeighbourMines()
}

const checkNeighbourMines = () => {
    const directions = [
        { dRow: -1, dCol: -1 },
        { dRow: -1, dCol: 0 },
        { dRow: -1, dCol: 1 },
        { dRow: 0, dCol: -1 },
        { dRow: 0, dCol: 1 },
        { dRow: 1, dCol: -1 },
        { dRow: 1, dCol: 0 },
        { dRow: 1, dCol: 1 },
    ]

    SQUARES.forEach((square) => {
        if (square.mine) return

        let near = 0

        directions.forEach(({ dRow, dCol }) => {
            const target = SQUARES.find(
                (sq) => sq.row === square.row + dRow && sq.col === square.col + dCol
            )
            if (target && target.mine) near++
        })

        square.near = near
        if (near === 0) square.empty = true
    })

    renderSquares()
}

const checkNeighbours = (id) => {
    console.log('checkNeighbours')
    const square = SQUARES.find(sq => sq.id === id)
    const directions = [
        { dRow: -1, dCol: -1 },
        { dRow: -1, dCol: 0 },
        { dRow: -1, dCol: 1 },
        { dRow: 0, dCol: -1 },
        { dRow: 0, dCol: 1 },
        { dRow: 1, dCol: -1 },
        { dRow: 1, dCol: 0 },
        { dRow: 1, dCol: 1 },
    ]

    const NEIGHBOURS = []

    directions.forEach(({ dRow, dCol }) => {
        const target = SQUARES.find(
            (sq) => sq.row === square.row + dRow && sq.col === square.col + dCol
        )
        if (target) NEIGHBOURS.push(target)
    })
    
    return NEIGHBOURS
}

const renderSquares = () => {
    SQUARES.forEach(square => {
        const $new_sq = document.createElement('div')
        $new_sq.setAttribute('id', square.id)
        $new_sq.classList.add("square")
        $new_sq.innerHTML = square.near || ''
        if (square.mine) {
            $new_sq.classList.add('mine')
            $new_sq.innerHTML = '💣'
        }
        if (square.empty) $new_sq.classList.add('empty')
        if (!square.mine && !square.empty) $new_sq.classList.add(`sq_${square.near}`)
        $minefield.appendChild($new_sq)
    })
}

createSquares()


const squareClickHandler = ($event) => {
    const sq_id = $event.target.id;
    if ($event.target.classList.contains('show')) return
    squareShow(parseFloat(sq_id))
}

const squareRightClickHandler = ($event) => {
    $event.preventDefault()
    if ($event.target.classList.contains('show')) return
    if ($event.target.classList.contains('flag')) {
        $event.target.classList.remove('flag')
        return
    }
    $event.target.classList.add('flag')
}

const squareShow = (id) => {
    const sq_obj = SQUARES.find(square => square.id === id)
    const $sq = document.getElementById(id)
    $sq.classList.remove('flag')
    sq_obj.show = true
    $sq.classList.add('show')
    if (sq_obj.empty) handleEmptySquare(id)
    if (sq_obj.mine) handleGameOver()
}

const handleEmptySquare = (id) => {
    const nbrsList = checkNeighbours(id)
    if (nbrsList && nbrsList.length) {
        nbrsList.forEach(nbr => {
            if (!nbr.show) {
                const $nbr = document.getElementById(nbr.id)
                if (!nbr.mine) {
                    nbr.show = true
                    $nbr.classList.add('show')
                }
                if (nbr.empty) squareShow(nbr.id)
            }
        })
    }
}

const handleGameOver = () => {
    $squares.forEach($sq => {
        $sq.style.pointerEvents = 'none'
        $gameOver.classList.add('show')
        setTimeout(() => {
            if ($sq.classList.contains('mine')) {
                $sq.classList.remove('flag')
                $sq.classList.add('show')
            }
        }, 150)
    })
}

const $squares = document.querySelectorAll('.square')
$squares.forEach(square => {
    square.addEventListener('click', squareClickHandler)
    square.addEventListener('contextmenu', squareRightClickHandler)
})
