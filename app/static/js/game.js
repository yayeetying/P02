import { Ducky } from "./Duck.js";
import {background, clouds, cloudsId, createCloud, drawBackground, spawn} from './race.js';

var c = document.getElementById("gamec");
var cduck;
var requestID;
var ctx = c.getContext("2d");
var keystore = {};
var yfactor = 0; //for frames in sprite sheet; 4 directions
var xfactor = 0; //also for frames; 3 frames walking stuff
var time = Date.now(); //for pacing thru frames in sprite sheet; milliseconds
var time2 = Date.now();
var time3 = Date.now() - 3000;
var pressed = 0;
var numCoins = 0;

let score = 0;
let scoreCounter = document.getElementById("score");

let energyLvl = document.getElementById("energy");
let runningLvl = document.getElementById("runningLvl");
let flyingLvl = document.getElementById("flyingLvl");
let swimmingLvl = document.getElementById("swimmingLvl");
let profileButton = document.getElementById("profile");
let runningButton = document.getElementById("running");
let flyingButton = document.getElementById("flying");
let swimmingButton = document.getElementById("swimming");
let raceButton = document.getElementById("race");
let shopButton = document.getElementById("shop");

function load_duck() {
//    console.log(cname);
//    console.log(cskin);
    cduck = new Ducky(cname, cskin);
//    console.log(cduck.skin.src);
    cduck.skin.onload = animate; //when image loads, call animate fxn
}

window.onload = function() {
//    console.log("test");
    load_duck();
//    console.log("test");
};

//for movement (arrow keys + jump) and drawing duck
function animate() {
  ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
  //import module from race.js (drawBackground fxn) to draw background
  //console.log(background);
  drawBackground(ctx, c);

  //arrow keys and duck movement
  keys();
  if (cduck.ycor >= 500) {
    time2 = Date.now();
  }
  if ((Date.now() - time3) < 3000 && cduck.ycor <= 500) {
    pressed = 1;
    cduck.moveUp();
  }
  else {
    pressed = 0;
  }
  cduck.gravity(time2);
  cduck.drawDuck(ctx, xfactor*78, yfactor*80);

//  console.log("is it working yet");
}

function keys() {
  if (keystore["ArrowUp"]) {
    timing(); //affects xfactor based off time
    cduck.moveUp();
    yfactor = 3;
  }
  if (keystore["ArrowDown"]) {
    timing();
    cduck.moveDown();
    yfactor = 0;
  }
  if (keystore["ArrowRight"]) {
    timing();
    cduck.moveRight();
    yfactor = 2;
  }
  if (keystore["ArrowLeft"]) {
    timing();
    cduck.moveLeft();
    yfactor = 1;
  }
  if (keystore[" "] && pressed == 0) {
    time3 = Date.now();
    cduck.moveUp()
  }
//  console.log(time);
}

//determines xfactor based off time
function timing(){
  if (Date.now() - time < 150){
    xfactor = 0;
  }
  else if (Date.now() - time < 300) {
    xfactor = 1;
  }
  else if (Date.now() - time < 450){
    xfactor = 2;
  }
  else {
    time = Date.now(); //reset time
  }
}


document.addEventListener('keydown', function(e) {
  keystore[e.key] = (e.type == 'keydown');
}, true);
document.addEventListener('keyup', function(e) {
  keystore[e.key] = (e.type == 'keydown');
}, true);

let clear = (e) => {
  ctx.clearRect(0, 0, c.width, c.height);
};

let coins = new Array();
let boulders = new Array();
let obstacles = new Array();
let coinsId, bouldersId, obstacleId;;
let dx = -0.5;

function createCoin(){
  let coin = {"r":10, "x":c.width+10, "y":Math.floor(Math.random()*(c.height/4)*3), "dx":-0.5 };
  coins.push(coin);
  //console.log(coins);
}

function createBoulder(){
  let boulder = {"r":25, "x":c.width+25, "y":525, "dx":dx };
  boulders.push(boulder);
  //console.log(boulder);
  clearInterval(bouldersId);
  let interval;
  if (score <= 10000){
    dx = -0.5-0.5*(score/1000);
  }
  if (score <= 5000){
    interval = Math.random()*1000+(5250-score);
  }else{
    interval = Math.random()*750+250;
  }
  bouldersId = setInterval(createBoulder, interval);
}

//animates background (w/ clouds) and moving boulders and coins
let drawRunning = () => {
  //score
  if (requestID%5 == 0){
    score+=1;
  }
  scoreCounter.innerHTML = score;


  requestID = window.cancelAnimationFrame(requestID);
  clear();
  animate(); //draws background + duck + handles key movement
  //draw coins
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

  //draw boulders
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

  if (detectCollision(coins)){
    numCoins++;
    console.log(numCoins);
  }

  //detect whether duck is colliding with boulders
  if (detectCollision(boulders)) {
    return; //pauses game when collided
  }

  requestID = window.requestAnimationFrame(drawRunning);
};

//spawns coins and boulders in running course
function spawnRunning(){
  if (!coinsId){
    coinsId = setInterval(createCoin, 6000);
    bouldersId = setInterval(createBoulder, 6000);
  }
}

//user has clicked on button starting the running course
function trainRunning(){
  removeButtons(); //remove visible buttons
  score = 0;
  dx = -0.5;
  coins = new Array();
  boulders = new Array();
  clearInterval(coinsId);
  clearInterval(bouldersId);
  spawnRunning();
  drawRunning();
}

//coins, boulders, obstacles: all are Arrays(); param items should be an Array
function detectCollision(items){
  for (let i = 0; i < items.length; i++){
    var item = items[i];
    //cduck's xycors are of duck's top-left corner of img; item's xycors are center of item (ie. item is a circle)

    if ((Math.abs(cduck.xcor-item.x) < cduck.width)
    && (Math.abs(cduck.ycor-item.y) < cduck.height)) {

    // if ((cduck.xcor+cduck.width) - (item.x-item.r) < 0 &&
    //
    // (cduck.ycor+cduck.height) - (item.y-item.r) < 0 &&
    // ) {

      console.log("colliding");

      items.pop(item); //remove item that collided with duck
      return true;
    }
  }
}

//create obstacles for swimming course
function createObstacle(){
  dx = -0.5-0.25*Math.floor(score/1000)
  let temp = Math.random();
  let obstacle;
  let img;
  if (temp > 0.833){ //flag boat
    img = new Image(100,100);
    img.src = "https://ucarecdn.com/a401f407-9078-4d8b-9074-4d8248daaed4/flagboat.png";
    obstacle = {"image":img, "x":c.width, "y":400, "dx":dx }
  }else if (temp > 0.666){ //ferry
    img = new Image(100,100);
    img.src = "https://ucarecdn.com/41ec63b0-26c0-4b89-a3a7-0b234271528b/ferry.png";
    obstacle = {"image":img, "x":c.width, "y":400, "dx":dx }
  }else if (temp > 0.5){ //sailboat
    img = new Image(100,100);
    img.src = "https://ucarecdn.com/4a00717c-59d3-45ab-a4da-153523d00c63/sailboat.png";
    obstacle = {"image":img, "x":c.width, "y":400, "dx":dx }
  }else if (temp > 0.333){ //iceberg
    img = new Image(100,100);
    img.src = "https://ucarecdn.com/84168c3b-64f0-4e8b-abcd-0f8b54305d88/iceberg.png";
    obstacle = {"image":img, "x":c.width, "y":400, "dx":dx }
  }else if (temp > 0.166){ //stone post
    img = new Image(100,100);
    img.src = "https://ucarecdn.com/96db148a-a397-44d4-a2ab-bbcec2c1c98d/stone.png";
    obstacle = {"image":img, "x":c.width, "y":400, "dx":dx }
  }else{ //island
    img = new Image(100,100);
    img.src = "https://ucarecdn.com/edea2e26-a332-427c-8747-eed9ef761506/island.png";
    obstacle = {"image":img, "x":c.width, "y":400, "dx":dx }
  }
  obstacles.push(obstacle);
  //console.log(obstacles);
  let interval;
  if (score <= 10000){
    dx = -0.5-0.5*(score/1000);
  }
  if (score <= 10000){
    interval = (13000-score);
  }else{
    interval = 3000;
  }
  clearInterval(obstacleId);
  obstacleId = setInterval(createObstacle, interval);
}

let drawSwimming = () => {
  //score
  if (requestID%5 == 0){
    score+=1;
  }
  scoreCounter.innerHTML = score;

	requestID = window.cancelAnimationFrame(requestID);
	clear();
  animate(); //draws background + duck + handles key movement
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

	requestID = window.requestAnimationFrame(drawSwimming);
};

function spawnSwimming(){
  if (!coinsId){
    coinsId = setInterval(createCoin, 6000);
    obstacleId = setInterval(createObstacle, 10000);
  }
}

function trainSwimming(){
  removeButtons();
  score = 0;
  dx = -0.5;
  coins = new Array();
  obstacles = new Array();
  clearInterval(coinsId);
  clearInterval(obstacleId);
  spawnSwimming();
  drawSwimming();
}

let drawFlying = () => {
  //score
  if (requestID%5 == 0){
    score+=1;
  }
  scoreCounter.innerHTML = score;

	requestID = window.cancelAnimationFrame(requestID);
	clear();
  animate(); //draws background + duck + handles key movement

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

	requestID = window.requestAnimationFrame(drawFlying);
};

function spawnFlying(){
  if (!cloudsId){
    coinsId = setInterval(createCoin, 6000);
  }
}

function trainFlying(){
  removeButtons();
  score = 0;
  dx = -0.5;
  coins = new Array();
  clearInterval(coinsId);
  spawnFlying();
  drawFlying();
}

function removeButtons(){
  energyLvl.setAttribute("hidden", "hidden");
  runningLvl.setAttribute("hidden", "hidden");
  flyingLvl.setAttribute("hidden", "hidden");
  swimmingLvl.setAttribute("hidden", "hidden");
  profile.setAttribute("hidden", "hidden");
  runningButton.setAttribute("hidden", "hidden");
  flyingButton.setAttribute("hidden", "hidden");
  swimmingButton.setAttribute("hidden", "hidden");
  raceButton.setAttribute("hidden", "hidden");
  shopButton.setAttribute("hidden", "hidden");
  scoreCounter.removeAttribute("hidden");
}

function addButtons(){
  energyLvl.removeAttribute("hidden");
  runningLvl.removeAttribute("hidden");
  flyingLvl.removeAttribute("hidden");
  swimmingLvl.removeAttribute("hidden");
  profile.removeAttribute("hidden");
  runningButton.removeAttribute("hidden");
  flyingButton.removeAttribute("hidden");
  swimmingButton.removeAttribute("hidden");
  raceButton.removeAttribute("hidden");
  shopButton.removeAttribute("hidden");
  scoreCounter.removeAttribute("hidden", "hidden");
}

runningButton.addEventListener("click", trainRunning );
swimmingButton.addEventListener("click", trainSwimming );
flyingButton.addEventListener("click", trainFlying );
