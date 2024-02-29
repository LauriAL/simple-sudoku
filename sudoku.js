function numGen() {
    let grid = Array.from({ length:9 }, () => Array(9).fill(' '));
    let num = "123456789";

    for(let i = 0; num.length > 0 && i < 9; i++) {
        let index = Math.floor(Math.random() * num.length);
        let val = num.substring(index, index + 1);
        grid[0][i] = val;
        num = num.replace(val, '');
    }

    function solver() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {

                if(grid[i][j] == ' ') {
                    for(let val = 1; val < 10; val++) {

                        if(!(rowCheck(val, i, grid) || colCheck(val, j, grid) || subgrid(val, i, j, grid))) {
                            grid[i][j] = val;
                            if(solver()) {
                                return true;
                            }
                            grid[i][j] = ' ';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    solver();

    return grid;
}

function rowCheck(val, index, grid) {
    return grid[index].includes(val);
}

function colCheck(val, index, grid) {
    for(let i = 0; i < 9; i++) {
        if(grid[i][index] == val) {
            return true;
        }
    }
    return false;
}

function subgrid(val, row, col, grid) {
    for(let i = Math.floor(row/3) * 3; i < (Math.floor(row/3) * 3) + 3; i++) {
        for(let j = Math.floor(col/3) * 3; j < (Math.floor(col/3) * 3) + 3; j++) {
            if(grid[i][j] == val) {
                return true;
            }
        }
    }
    return false;
}

function removeValues(dif, sol) {
    let board = sol;

    for(let i = 1; i < dif; i++) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        board[row][col] = ' ';
    }
    return board;
}

var numSelected = null;

var errors = 0;

var solution = numGen();
var get = JSON.parse(JSON.stringify(solution));
var board = removeValues(50, get);

solution.forEach((i) => console.log(i + "\n"));
board.forEach((i) => console.log(i + "\n"));

window.onload = function() {
    setGame();
}

function setGame() {
    // Digits 1-9
    for (let i = 1; i<=9; i++) {
        //<div id="1" class="number">1</div>
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Board 9x9
    for (let r = 0; r<9; r++) {
        for (let c = 0; c<9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + " " + c.toString();
            if (board[r][c] != " ") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
} 

function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }
        
        // "0-0", "0-1", ... "8-8"
        let coords = this.id.split(" "); //["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
        } else {
            errors += 1;
            document.getElementById("errors").innerText = errors;
        }
    }
}