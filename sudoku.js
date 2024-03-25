function numGen() {
    let grid = Array.from({ length:9 }, () => Array(9).fill(' '));
    let num = "123456789";

    for(let i = 0; num.length > 0 && i < 9; i++) {
        let index = Math.floor(Math.random() * num.length);
        let val = num.substring(index, index + 1);
        grid[0][i] = val;
        num = num.replace(val, '');
    }

    function filler() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {

                if(grid[i][j] == ' ') {
                    for(let val = 1; val < 10; val++) {

                        if(!(rowCheck(val, i, grid) || colCheck(val, j, grid) || subgrid(val, i, j, grid))) {
                            grid[i][j] = val;
                            if(filler()) {
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

    filler();

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

    wrong = 0;

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] == ' ') {
                wrong += 1;
            }
        }
    }

    return board;
}

var numSelected, errors, solution, get, board, difficulty, wrong, num;

let coords, r, c;

window.onload = function() {
    setGame();
}

function setGame() {
    numSelected = null;

    errors = 0;

    solution = numGen();
    get = JSON.parse(JSON.stringify(solution));
    board = removeValues(50, get);
    get = JSON.parse(JSON.stringify(board));

    document.getElementById("errors").innerText = `There are ${wrong} blanks`;
    // Difficulty and new game
    let diff = document.createElement("div");
    diff.id = "solve";
    diff.innerText = "Auto solve";
    diff.addEventListener("click", solver);
    diff.classList.add("diff");
    document.getElementById("difficulty").appendChild(diff);



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
            tile.id = r.toString() + "-" + c.toString();
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
    if (numSelected == this) {
        numSelected.classList.remove("number-selected");
        numSelected = null;
        return;
    } else {    
        if (numSelected != null) {
            numSelected.classList.remove("number-selected");
        }
        numSelected = this;
        numSelected.classList.add("number-selected");
    }
}

function selectTile() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }
        
        // "0-0", "0-1", ... "8-8"
        coords = this.id.split("-"); //["0", "0"]
        r = parseInt(coords[0]);
        c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
            wrong = wrong - 1;
            if (wrong === 0) {
                document.getElementById("errors").innerText = `You win with ${errors} errors!`;
            }
        } else {
            errors += 1;
            document.getElementById("errors").innerText = `Errors: ${errors}`;
        }
    }
}

function solver() {
    this.classList.add("tile-start");
    autoSolve();
}

function autoSolve() {
    for(let r = 0; r < 9; r++) {
        for(let c = 0; c < 9; c++) {
            coords = r.toString() + "-" + c.toString();
            if(document.getElementsById(coords).innerText == "") {
                for(let val = 1; val < 10; val++) {
                    if(isValid(document.getElementById("board"), r, c, val)) {
                        document.getElementById(coords).innerText = val;
                        if(autoSolve()) {
                            return true;
                        } else {
                            document.getElementById(coords).innerText = "";
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(board, row, col, val) {
    for(let i = 1; i < 10; i++) {
        const m = 3 * Math.floor(row/3) + math.floor(i/3);
        const n = 3 * Math.floor(col/3) + i % 3;
        let c = row.toString() + "-" + col.toString();
        if(board.getElementById(row.toString() + "-" + i.toString()).innerText == val || board.getElementById(i.toString() + "-" + col.toString()).innerText == k 
        || board.getElementById(m.toString() + "-" + n.toString()).innerText == val) {
            return false;
        }
    }
    return true;
}