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
let obstacles = new Array();
let cloudsId, coinsId, obstacleId;

function createCloud(){
  let img = new Image(200, 100);
  img.src = 'http://clipart-library.com/img/1388735.png';
  let cloud = {"image":img, "x":c.width, "y":Math.floor(Math.random()*(c.height/4)), "dx":-0.5 }
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

function createObstacle(){
  let temp = Math.random();
  let obstacle;
  let img;
  if (temp > 0.833){ //flag boat
    img = new Image(100,100);
    img.src = "http://clipart-library.com/image_gallery/485244.png";
    obstacle = {"image":img, "x":c.width, "y":160, "dx":-0.5 }
  }else if (temp > 0.666){ //ferry
    img = new Image(100,100);
    img.src = "http://clipart-library.com/image_gallery/485244.png";
    obstacle = {"image":img, "x":c.width, "y":160, "dx":-0.5 }
  }else if (temp > 0.5){ //sailboat
    img = new Image(100,100);
    img.src = "http://clipart-library.com/image_gallery/485244.png";
    obstacle = {"image":img, "x":c.width, "y":160, "dx":-0.5 }
  }else if (temp > 0.333){ //iceberg
    img = new Image(100,100);
    img.src = "http://clipart-library.com/image_gallery/485244.png";
    obstacle = {"image":img, "x":c.width, "y":160, "dx":-0.5 }
  }else if (temp > 0.166){ //stone post
    img = new Image(100,100);
    img.src = "http://clipart-library.com/image_gallery/485244.png";
    obstacle = {"image":img, "x":c.width, "y":160, "dx":-0.5 }
  }else{ //island
    img = new Image(100,100);
    img.src = "http://clipart-library.com/image_gallery/485244.png";
    obstacle = {"image":img, "x":c.width, "y":160, "dx":-0.5 }
  }
  obstacles.push(obstacle);
  console.log(obstacles);
}

let draw = () => {
	requestID = window.cancelAnimationFrame(requestID);
	clear();
  //draw background
  ctx.fillStyle = "green";
  ctx.fillRect(0, 000, c.width, c.height);
  ctx.fillStyle = "#9cd3db";
  ctx.fillRect(0, 250, c.width, c.height);
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

  //obstacles
  for (let i = 0; i < obstacles.length; i++){
    ctx.beginPath();
    ctx.drawImage(obstacles[i].image, obstacles[i].x, obstacles[i].y, obstacles[i].image.width, obstacles[i].image.height);
    obstacles[i].x += obstacles[i].dx;
    if (obstacles[i].x <= -100){
      obstacles.shift();
      i--;
    }
  }

	requestID = window.requestAnimationFrame(draw);
};

function spawn(){
  if (!cloudsId){
    cloudsId = setInterval(createCloud, 5000);
    coinsId = setInterval(createCoin, 5500);
    obstacleId = setInterval(createObstacle, 6000);
  }
}

c.addEventListener( "click", draw );
goButton.addEventListener("click", spawn );
stopButton.addEventListener( "click",  stopIt );
