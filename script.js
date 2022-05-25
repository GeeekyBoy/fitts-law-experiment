let gameData = null
const activatePage = (pageName) => {
  const availPages = document.querySelectorAll("div[data-page]")
  for (const availPage of availPages) {
    if (availPage.dataset.page === pageName) {
      if (!availPage.className) {
        availPage.className = "active";
      }
    } else if (availPage.className) {
      availPage.className = "";
    }
  }
}

function handleRightBlockClick () {
  if (gameData.currTrial.startedAt) {
    const currTime = Date.now()
    gameData.trialsData.push([
      gameData.currTrial.distance,
      gameData.currTrial.width,
      currTime - gameData.currTrial.startedAt
    ])
    gameData.currTrial = null;
    gameData.doneTrials++;
    if (gameData.trialsCount === gameData.doneTrials) {
      activatePage("result");
    } else {
      generateTrial();
    }
  }
}

function handleLeftBlockClick (event) {
  if (!gameData.currTrial.startedAt) {
    event.target.className = "active";
    gameData.currTrial.startedAt = Date.now();
  }
}

function handleDownloadBtnClick () {
  const csvLines = ['Trial,D,W,MT'];
  gameData.trialsData.forEach((x, i) => {
    csvLines.push((i + 1) + "," + x.join(","));
  });
  downloadString(csvLines.join("\n"), "text/csv", "results.csv");
}

function handleTryAgainBtnClick () {
  gameData = null
  activatePage("home");
}

const generateTrial = () => {
  const trialsCountElem = document.getElementById("trialsCountTxt");
  const leftBlockElem = document.getElementById("leftBlock");
  const rightBlockElem = document.getElementById("rightBlock");
  const maxWidth = Math.min(window.innerWidth / 2 - 40 - 20, 200);
  const randomWidth = Math.floor(Math.random() * (maxWidth - 10) + 10);
  const maxDistance = document.body.offsetWidth - randomWidth * 2 - 80 - 40;
  const randomDistance =  Math.floor(Math.random() * (maxDistance - 50) + 50);
  leftBlockElem.style.width = randomWidth + "px";
  rightBlockElem.style.width = randomWidth + "px";
  leftBlockElem.style.marginRight = randomDistance + "px";
  leftBlockElem.className = "";
  trialsCountElem.innerText = `Trial ${gameData.doneTrials + 1} Out Of ${gameData.trialsCount}`
  gameData.currTrial = {
    startedAt: null,
    width: randomWidth,
    distance: randomDistance
  }
}

function startGame(event) {
  event.preventDefault();
  event.stopPropagation();
  const trialsCount = parseInt(event.target.querySelector("input").value, 10);
  gameData = {
    trialsCount: trialsCount,
    doneTrials: 0,
    trialsData: [],
    currTrial: null
  }
  activatePage("test");
  generateTrial();
}

// https://gist.github.com/danallison/3ec9d5314788b337b682
function downloadString(text, fileType, fileName) {
  var blob = new Blob([text], { type: fileType });
  var a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
}