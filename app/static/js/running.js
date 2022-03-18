let c = document.getElementById("sandbox");
let goButton = document.getElementById("go");
let stopButton = document.getElementById("stop");

let ctx = c.getContext("2d");

let requestID;

let clear = (e) => {
  ctx.clearRect(0, 0, c.width, c.height);
};

var stopIt = () => {
  console.log( requestID );
  window.cancelAnimationFrame(requestID);
};

let clouds = new Array();
let coins = new Array();
let boulders = new Array();
let cloudsId, coinsId, bouldersId;

function createCloud(){
  let img = new Image(200, 100);
  img.src = 'http://clipart-library.com/img/1388735.png';
  let cloud = {"image":img, "x":c.width, "y":Math.floor(Math.random()*(c.height/2)), "dx":-0.5 }
  if (clouds.length < 3){
    clouds.push(cloud);
  }
  console.log(clouds);
}

function createCoin(){
  let coin = {"r":10, "x":c.width, "y":Math.floor(Math.random()*(c.height/2)), "dx":-0.5 };
  if (coins.length < 2){
    coins.push(coin);
  }
  console.log(coins);
}

function createBoulder(){
  let boulder = {"r":25, "x":c.width, "y":375, "dx":-0.5 };
  boulders.push(boulder);
  console.log(boulder);
  clearInterval(bouldersId);
  bouldersId = setInterval(createBoulder, Math.floor(Math.random()*5000)+2000);
}

let draw = () => {
	requestID = window.cancelAnimationFrame(requestID);
	clear();
  //draw background
  ctx.fillStyle = "#80f5f9";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "green";
  ctx.fillRect(0, 400, c.width, c.height);
  //clouds
  for (let i = 0; i < clouds.length; i++){
    ctx.beginPath();
    ctx.drawImage(clouds[i].image, clouds[i].x, clouds[i].y, clouds[i].image.width, clouds[i].image.height);
    clouds[i].x += clouds[i].dx;
    if (clouds[i].x <= -200){
      clouds.shift();
      i--;
    }
  }

  //coins
  ctx.fillStyle = "#d4af37";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  for (let i = 0; i < coins.length; i++){
    ctx.beginPath();
    ctx.arc(coins[i].x, coins[i].y, coins[i].r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    coins[i].x += coins[i].dx;
    if (coins[i].x <= -10){
      coins.shift();
      i--;
    }
  }

  //boulders
  ctx.fillStyle = "#6f532f";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  for (let i = 0; i < boulders.length; i++){
    ctx.beginPath();
    ctx.arc(boulders[i].x, boulders[i].y, boulders[i].r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    boulders[i].x += boulders[i].dx;
    if (boulders[i].x <= -25){
      boulders.shift();
      i--;
    }
  }

	requestID = window.requestAnimationFrame(draw);
};

function spawn(){
  if (!cloudsId){
    cloudsId = setInterval(createCloud, 5000);
    coinsId = setInterval(createCoin, 5500);
    bouldersId = setInterval(createBoulder, 6000);
  }
}

c.addEventListener( "click", draw );
goButton.addEventListener("click", spawn );
stopButton.addEventListener( "click",  stopIt );
