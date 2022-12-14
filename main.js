let startBtn = document.querySelector(".control-btn span");
let dashboardName = document.querySelector(".title-box .name span");
let theName = document.querySelector(".title-box .name span");
let tries = document.querySelector(".title-box .tries span");
let leaderBoard = document.querySelector(".leader-board table");
let timer = document.querySelector(".title-box .timer");
let correctTable = document.querySelector("table tr.correct-table");
let tableHead = document.querySelectorAll("table tr.correct-table th");

let duration = 1000;
let blocksContainer = document.querySelector(".memory-block");
let blocks = Array.from(blocksContainer.querySelectorAll(".game-block"));
let correctChoose = new Audio("./sounds/right.wav");
let wrongChoose = new Audio("./sounds/error.mp3");
let winnerSound = new Audio("./sounds/win.wav");
let loserSound = new Audio("./sounds/lose2.wav");
let backgroundMusic = new Audio("./sounds/backgroundMusic.mp3");
let sec = 30;
let myArr = [];
let content = "";

backgroundMusic.volume = 0.03;
wrongChoose.volume = 0.4;
correctChoose.volume = 0.3;
winnerSound.volume = 0.4;
loserSound.volume = 0.4;

let correctCount = 0;
let countDown;
let getName;
timer.innerHTML = sec;
let detail = JSON.parse(localStorage.getItem("info") || "[]");

startBtn.onclick = function () {
  let nameInput = prompt("Enter Your Name");
  if (nameInput == "" || nameInput == null) {
    dashboardName.innerHTML = "Unknown";
  } else {
    dashboardName.innerHTML = nameInput;
  }
  blocks.forEach((block) => {
    block.classList.add("is-flipped");

    setTimeout(() => {
      block.classList.remove("is-flipped");
    }, 1500);
  });
  document.querySelector(".control-btn ").remove();
  backgroundMusic.play();
  countDown = setInterval(function () {
    timer.innerHTML = sec;
    sec--;
    if (sec < 0) {
      clearInterval(countDown);
      alert("You Lose");
      blocksContainer.classList.add("no-clicking");
      loserSound.play();
      addLocal();
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  }, 1000);
};

let orderRange = [...Array(blocks.length).keys()];
shuffle(orderRange);

blocks.forEach((block, index) => {
  block.style.order = orderRange[index];

  block.addEventListener("click", function () {
    flipBlock(block);
  });
});

function flipBlock(selected) {
  selected.classList.add("is-flipped");
  let getSelectedArray = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );

  if (getSelectedArray.length == 2) {
    stopClick();

    checkMethod(getSelectedArray[0], getSelectedArray[1]);
  }
}

function stopClick() {
  blocksContainer.classList.add("no-clicking");

  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

function checkMethod(first, second) {
  if (first.dataset.technology == second.dataset.technology) {
    correctCount++;
    first.classList.remove("is-flipped");
    second.classList.remove("is-flipped");
    first.classList.add("has-match");
    second.classList.add("has-match");
    correctChoose.load();
    correctChoose.play();
    if (correctCount * 2 == blocks.length) {
      clearInterval(countDown);
      addLocal();
      winnerSound.play();
      setTimeout(() => {
        location.reload();
      }, 4000);
    }
  } else {
    Number(tries.innerHTML++);
    wrongChoose.play();

    setTimeout(() => {
      first.classList.remove("is-flipped");
      second.classList.remove("is-flipped");
    }, duration);
  }
}

function shuffle(array) {
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    current--;
    random = Math.floor(Math.random() * current);
    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }

  return array;
}

let test = [];
let final = [];
function addLocal() {
  if (dashboardName.innerHTML != "Unknown") {
    let playerInfo = {
      name: dashboardName.innerHTML,
      wrongCount: tries.innerHTML,
      correct: correctCount,
    };
    detail.push(playerInfo);

    detail.sort((a, b) => {
      return b.correct - a.correct || a.wrongCount - b.wrongCount;
    });

    if (detail.length >= 15) {
      detail.splice(3);
    }

    localStorage.setItem("info", JSON.stringify(detail));
  }
}
let isClick = true;
function showTable() {
  detail.forEach((box, index) => {
    content = `
      <tr>
        <td class="player-name">${box.name}
          <span class="sorting">${index + 1}</span>
        </td>
        <td>${box.correct}</td>
        <td class="wrong-counter">${box.wrongCount}</td>

      </tr>
    `;
    if (index == 0) {
      content = `
      <tr>
        <td class="player-name first">${box.name}
          <span class="sorting">${index + 1}</span>
        </td>
        <td class="first">${box.correct}</td>
        <td class="wrong-counter first">${box.wrongCount}</td>

      </tr>
    `;
    } else if (index == 1) {
      content = `
      <tr>
        <td class="player-name second">${box.name}
          <span class="sorting ">${index + 1}</span>
        </td>
        <td class="second">${box.correct}</td>
        <td class="wrong-counter second">${box.wrongCount}</td>

      </tr>
    `;
    } else if (index == 2) {
      content = `
      <tr>
        <td class="player-name third">${box.name}
          <span class="sorting">${index + 1}</span>
        </td>
        <td class="third">${box.correct}</td>
        <td class="wrong-counter third">${box.wrongCount}</td>

      </tr>
    `;
    }

    leaderBoard.innerHTML += content;
  });
}
showTable();

// ondblclick

function tableClick() {
  if (isClick) {
    detail.sort((a, b) => {
      return a.correct - b.correct || b.wrongCount - a.wrongCount;
    });

    isClick = false;
  } else {
    detail.sort((a, b) => {
      return b.correct - a.correct || a.wrongCount - b.wrongCount;
    });

    isClick = true;
  }

  localStorage.setItem("info", JSON.stringify(detail));
  removeOld();
}

function removeOld() {
  leaderBoard
    .querySelectorAll("tr:not(.correct-table)")
    .forEach((e) => e.parentElement.remove());
  setTimeout(() => {
    showTable();
  }, 0);
}

/* 
 -1 add music in background 
 -2 add timer 
 -3 make leaderboard and save score in localsorage 
 -4 sort table on click the correct-row
 -5 make alot of boxex 
*/
