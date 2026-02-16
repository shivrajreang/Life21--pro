let money = 50;
let happiness = 50;
let career = 50;
let level = 1;
let rounds = 0;
let maxRounds = 5;
let timeLeft = 10;
let timer;

loadProgress();
updateBars();
startTimer();

function choose(type){
  let click = document.getElementById("clickSound");
click.currentTime = 0;
click.play().catch(function(error){
  console.log("Sound blocked:", error);
});
  if(rounds >= maxRounds){
    return;
  }

  rounds++;

  if(type==="business"){ money+=10; career+=5; }
  if(type==="study"){ career+=10; }
  if(type==="party"){ happiness+=10; money-=5; }
  if(type==="love"){ happiness+=8; }

  randomEvent();
  updateBars();
  saveProgress();
  resetTimer();

  if(rounds === maxRounds){
    endGame();
  }
}

function randomEvent(){
  const events=[
    {text:"Market crash!", money:-5},
    {text:"Bonus reward!", money:10},
    {text:"Unexpected romance!", happiness:5},
    {text:"Training course!", career:5}
  ];

  let e = events[Math.floor(Math.random()*events.length)];
  document.getElementById("eventText").innerText = e.text;

  money += e.money || 0;
  happiness += e.happiness || 0;
  career += e.career || 0;
}

function limitStats(){
  money = Math.max(0, Math.min(100, money));
  happiness = Math.max(0, Math.min(100, happiness));
  career = Math.max(0, Math.min(100, career));
}

function updateBars(){
  limitStats();

  document.getElementById("moneyBar").style.width = money + "%";
  document.getElementById("happinessBar").style.width = happiness + "%";
  document.getElementById("careerBar").style.width = career + "%";

  checkGameOver();
}

function checkGameOver(){
  if(money <= 0 || happiness <= 0 || career <= 0){
    clearInterval(timer);
    document.getElementById("eventText").innerText =
      "💀 Game Over!";

    let gameOver = document.getElementById("gameOverSound");
    gameOver.currentTime = 0;
    gameOver.play();
  }
}

function startTimer(){
  timer = setInterval(()=>{
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;

    if(timeLeft <= 0){
      clearInterval(timer);
      happiness -= 5;
      updateBars();
      resetTimer();
    }
  },1000);
}

function resetTimer(){
  clearInterval(timer);
  timeLeft = 10;
  document.getElementById("timer").innerText = timeLeft;
  startTimer();
}

function endGame(){
let levelSound = document.getElementById("levelSound");
levelSound.currentTime = 0;
levelSound.play().catch(function(error){});
  clearInterval(timer);
  document.getElementById("eventText").innerText =
    "🎯 Level Complete!";

  level++;
  document.getElementById("level").innerText = level;

  money -= 5;
  happiness -= 5;
  career -= 5;

  rounds = 0;
  maxRounds += 1;

  saveProgress();
  startTimer();
}

function restartGame(){
  localStorage.removeItem("life21progress");
  location.reload();
}

function saveProgress(){
  const data = {
    money,
    happiness,
    career,
    level,
    rounds,
    maxRounds
  };
  localStorage.setItem("life21progress", JSON.stringify(data));
}

function loadProgress(){
  const saved = localStorage.getItem("life21progress");
  if(saved){
    const data = JSON.parse(saved);
    money = data.money;
    happiness = data.happiness;
    career = data.career;
    level = data.level;
    rounds = data.rounds;
    maxRounds = data.maxRounds;
    document.getElementById("level").innerText = level;
  }
}