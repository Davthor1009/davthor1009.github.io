let boxes = document.querySelectorAll(".box");

let turn = "X";
let gameOver = false;

boxes.forEach(e =>{
    e.innerHTML = ""
    e.addEventListener("click", ()=>{
        if (!gameOver && e.innerHTML === "") {
            e.innerHTML = turn;
            checkWin();
            checkDraw();
            changeTurn();
        }
    })
})

function changeTurn() {
    if (turn === "X") {
        turn = "O";
        document.querySelector(".bg").style.left = "85px";
    }
    else{
        turn = "X";
        document.querySelector(".bg").style.left = "0";
    }
}

function checkWin() {
    let winCond = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
    for (let i = 0; i < winCond.length; i++) {
        let v0 = boxes[winCond[i][0]].innerHTML;
        let v1 = boxes[winCond[i][1]].innerHTML;
        let v2 = boxes[winCond[i][2]].innerHTML;

        if (v0 != "" && v0 === v1 && v0 === v2) {
            gameOver = true;
            document.querySelector("#result").innerHTML = turn + " GANA";
            document.querySelector("#play-again").style.display = "inline";

            for(j = 0; j<3; j++){
                boxes[winCond[i][j]].style.backgroundColor = "#08d9d6";
                boxes[winCond[i][j]].style.color = "#000";
            }
        }
    }
}

function checkDraw() {
    if (!gameOver) {
        let draw = true;
        boxes.forEach(e =>{
            if (e.innerHTML === "") draw = false;
        })

        if (draw) {
            gameOver = true;
            document.querySelector("#result").innerHTML = "EMPATE";
            document.querySelector("#play-again").style.display = "inline";
        }
    }
}

document.querySelector("#play-again").addEventListener("click", ()=>{
    gameOver = false;
    turn = "X";
    document.querySelector(".bg").style.left = "0";
    document.querySelector("#result").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";

    boxes.forEach(e =>{
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff";
    })
})