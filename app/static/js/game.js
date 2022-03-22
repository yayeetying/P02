import { Ducky } from "./Duck.js";
import {grasslands, seas, clouds, cloudsId, createCloud, drawBackground, spawn} from './race.js';

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

function stop(){
  window.cancelAnimationFrame(requestID);
}

function load_duck() {
//    console.log(cname);
//    console.log(cskin);
    cduck = new Ducky(cname, cskin);
//    console.log(cduck.skin.src);
    cduck.skin.onload = animate(0); //when image loads, call animate fxn
}

window.onload = function() {
//    console.log("test");
    load_duck();
//    console.log("test");
};

//for movement (arrow keys + jump) and drawing duck and drawing background
function animate(bg) {
  ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);

  //import module from race.js (drawBackground fxn) to draw background
  drawBackground(ctx, c, bg); //bg = 0 means grasslands, bg = 1 means sea

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

  if (bg == 0) { //grasslands
    cduck.drawDuck(ctx, xfactor*78, yfactor*80); //draw duck at bottom of screen
  }
  else if (bg == 1) { //seas
    cduck.xcor = 50;
    cduck.ycor = 400;
    cduck.drawDuck(ctx, xfactor*78, yfactor*80); //draw duck on sea level
  }

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
  animate(0); //draws background + duck + handles key movement
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
    && (Math.abs(cduck.ycor-item.y) < cduck.height) && cduck.xcor-item.x < 0) {

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
  animate(1); //draws background + duck + handles key movement
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

  if (detectCollision(coins)){
    numCoins++;
    console.log(numCoins);
  }

  //detect whether duck is colliding with obstacles
  if (detectCollision(obstacles)) {
    return; //pauses game when collided
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
  animate(0); //draws background + duck + handles key movement

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

  if (detectCollision(coins)){
    numCoins++;
    //for flying course, collecting coins should also propell ducky forward
    console.log(numCoins);
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

//temporary ducks
let temp0 = {"r":25, "x":100, "y":116.25, "speed":150 };
let temp1 = {"r":25, "x":100, "y":238.75, "speed":1 };
let temp2 = {"r":25, "x":100, "y":361.25, "speed":1 };
let temp3 = {"r":25, "x":100, "y":483.75, "speed":1 };

let start = {"x":150, "y":50, "w":25, "h":500}
let finish = {"x":5000, "y":50, "w":25 , "h":500 }
let raceTimer;
let standings = new Array();
standings.push(temp1);
standings.push(temp2);
standings.push(temp3);
let difficulty;


//running race
function drawRunningRace(){
  window.cancelAnimationFrame(requestID);
  clear();
  ctx.fillStyle = "#c53b2b";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#348C31";
  ctx.fillRect(0, 0, c.width, 50);
  ctx.fillRect(0, 550, c.width, 50);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 50, c.width, 10);
  ctx.fillRect(0, 172.5, c.width, 10);
  ctx.fillRect(0, 295, c.width, 10);
  ctx.fillRect(0, 417.5, c.width, 10);
  ctx.fillRect(0, 540, c.width, 10);

  ctx.fillRect(start.x, start.y, start.w, start.h);
  ctx.fillRect(finish.x, finish.y, finish.w, finish.h);

  ctx.fillStyle="blue";
  ctx.beginPath();
  ctx.arc(temp0.x, temp0.y, temp0.r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(temp1.x, temp1.y, temp1.r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(temp2.x, temp2.y, temp2.r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(temp3.x, temp3.y, temp3.r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  if (raceTimer > 500){
    if (temp0.x < 400){
      temp0.x += 1;
      temp1.x += 1;
      temp2.x += 1;
      temp3.x += 1;
    }else{
      temp1.x += (-2*((temp0.speed-temp1.speed)/temp1.speed));
      temp2.x += (-2*((temp0.speed-temp2.speed)/temp2.speed));
      temp3.x += (-2*((temp0.speed-temp3.speed)/temp3.speed));
      finish.x += -10;
    }

    start.x += -1*(temp0.speed/10);
  }

  raceTimer+=1;

  requestID = window.requestAnimationFrame(drawRunningRace);

  if (finish.x < -30){
    placement(1);
    stop();
    endRace();
    standings.pop();
    console.log(requestID);
  }
}

function runningRace(){
  clear();
  removeRaceButtons();
  raceTimer = 0;
  setDifficulty();
  standings.push(temp0);
  drawRunningRace();
}

function resetRace(){
  finish.x = 5000;
  temp0.x = 100;
  temp1.x = 100;
  temp2.x = 100;
  temp3.x = 100;
  start.x = 150;
}

function runningEasy(){
  difficulty = 1;
  resetRace();
  runningRace();
}

function runningMed(){
  difficulty = 2;
  resetRace();
  runningRace();
}

function runningHard(){
  difficulty = 3;
  resetRace();
  runningRace();
}

//swimming race
function drawSwimmingRace(){
  window.cancelAnimationFrame(requestID);
  clear();
  ctx.fillStyle = "#6ab7db";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, c.width, 50);
  ctx.fillRect(0, 550, c.width, 50);
  ctx.fillStyle = "#ff4040";
  ctx.fillRect(0, 50, c.width, 10);
  ctx.fillRect(0, 172.5, c.width, 10);
  ctx.fillRect(0, 295, c.width, 10);
  ctx.fillRect(0, 417.5, c.width, 10);
  ctx.fillRect(0, 540, c.width, 10);

  ctx.fillRect(start.x, start.y, start.w, start.h);
  ctx.fillRect(finish.x, finish.y, finish.w, finish.h);

  ctx.fillStyle="green";
  ctx.beginPath();
  ctx.arc(temp0.x, temp0.y, temp0.r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(temp1.x, temp1.y, temp1.r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(temp2.x, temp2.y, temp2.r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(temp3.x, temp3.y, temp3.r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  if (raceTimer > 500){
    if (temp0.x < 400){
      temp0.x += 1;
      temp1.x += 1;
      temp2.x += 1;
      temp3.x += 1;
    }else{
      temp1.x += (-2*((temp0.speed-temp1.speed)/temp1.speed));
      temp2.x += (-2*((temp0.speed-temp2.speed)/temp2.speed));
      temp3.x += (-2*((temp0.speed-temp3.speed)/temp3.speed));
      finish.x += -10;
    }

    start.x += -1*(temp0.speed/10);
  }

  raceTimer+=1;

  requestID = window.requestAnimationFrame(drawSwimmingRace);

  if (finish.x < -30){
    placement(1);
    stop();
    endRace();
    standings.pop();
    console.log(requestID);
  }
}

function swimmingRace(){
  clear();
  removeRaceButtons();
  raceTimer = 0;
  setDifficulty();
  standings.push(temp0);
  drawSwimmingRace();
}

function swimmingEasy(){
  difficulty = 1;
  resetRace();
  swimmingRace();
}

function swimmingMed(){
  difficulty = 2;
  resetRace();
  swimmingRace();
}

function swimmingHard(){
  difficulty = 3;
  resetRace();
  swimmingRace();
}

//flying race
function drawFlyingRace(){
  window.cancelAnimationFrame(requestID);
  clear();

  animate(0);

  let gradient = ctx.createLinearGradient(0, 600, 0, 0);
  // Add three color stops
  gradient.addColorStop(0, '#6bbffa');
  gradient.addColorStop(1, '#0e7cff');

  // Set the fill style and draw a rectangle
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = "black"
  ctx.fillRect(start.x, start.y-50, start.w, start.h+100);
  ctx.fillRect(finish.x, finish.y-50, finish.w, finish.h+100);

  ctx.fillStyle="red";
  ctx.beginPath();
  ctx.arc(temp0.x, temp0.y, temp0.r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(temp1.x, temp1.y, temp1.r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(temp2.x, temp2.y, temp2.r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(temp3.x, temp3.y, temp3.r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  if (raceTimer > 500){
    if (temp0.x < 400){
      temp0.x += 1;
      temp1.x += 1;
      temp2.x += 1;
      temp3.x += 1;
    }else{
      temp1.x += (-2*((temp0.speed-temp1.speed)/temp1.speed));
      temp2.x += (-2*((temp0.speed-temp2.speed)/temp2.speed));
      temp3.x += (-2*((temp0.speed-temp3.speed)/temp3.speed));
      finish.x += -10;
    }

    start.x += -1*(temp0.speed/10);
  }

  raceTimer+=1;

  requestID = window.requestAnimationFrame(drawFlyingRace);

  if (finish.x < -30){
    placement(1);
    stop();
    endRace();
    standings.pop();
    console.log(requestID);
  }
}

function flyingRace(){
  clear();
  removeRaceButtons();
  raceTimer = 0;
  setDifficulty();
  standings.push(temp0);
  drawFlyingRace();
}
function flyingEasy(){
  difficulty = 1;
  resetRace();
  flyingRace();
}
function flyingMed(){
  difficulty = 2;
  resetRace();
  flyingRace();
}
function flyingHard(){
  difficulty = 3;
  resetRace();
  flyingRace();
}

let raceResult = document.getElementById("standings");
let first = document.getElementById("1st");
let second = document.getElementById("2nd");
let third = document.getElementById("3rd");
let fourth = document.getElementById("4th");
let endRaceButton = document.getElementById("endRace");

endRaceButton.addEventListener("click", goBack);

function goBack(){
  clear()
  animate(0);
  raceResult.setAttribute("hidden", "hidden");
  removeRaceButtons();
  addButtons();
}

function endRace(array){
  ctx.fillStyle = "black";
  ctx.globalAlpha = 0.7;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.globalAlpha = 1;
  raceResult.removeAttribute("hidden")
  first.innerHTML = "1st: ";
  second.innerHTML = "2nd: ";
  third.innerHTML = "3rd: ";
  fourth.innerHTML = "4th: ";
  console.log(standings);
}

function placement(i){
  if (i === 0){
    //running
    standings.sort(function(a, b){return b.speed - a.speed});
  }else if (i === 1){
    //swimming
    standings.sort(function(a, b){return b.speed - a.speed});
  }else{
    //flying
    standings.sort(function(a, b){return b.speed - a.speed});
  }
}

function setDifficulty(){
  if (difficulty === 1){
    temp1.speed = 42.5;
    temp2.speed = 29.5;
    temp3.speed = 49.5;
  }else if (difficulty === 2){
    temp1.speed = 87.5;
    temp2.speed = 97.5;
    temp3.speed = 81.5;
  }else{
    temp1.speed = 148.5;
    temp2.speed = 143.5;
    temp3.speed = 132.5;
  }
}

let running1 = document.getElementById("running1");
let running2 = document.getElementById("running2");
let running3 = document.getElementById("running3");
let swimming1 = document.getElementById("swimming1");
let swimming2 = document.getElementById("swimming2");
let swimming3 = document.getElementById("swimming3");
let flying1 = document.getElementById("flying1");
let flying2 = document.getElementById("flying2");
let flying3 = document.getElementById("flying3");
let raceButtons = document.getElementById("race_buttons");
let closeRaceMenu = document.getElementById("closeRaceMenu");

function raceMenu(){
  removeButtons();
  ctx.fillStyle = "black";
  ctx.globalAlpha = 0.7;
  ctx.fillRect(0, 0, c.width, c.height);
  addRaceButtons();
  ctx.globalAlpha = 1;
}

function addRaceButtons(){
  raceButtons.removeAttribute("hidden");
}

function removeRaceButtons(){
  raceButtons.setAttribute("hidden", "hidden");
}

raceButton.addEventListener("click", raceMenu);
running1.addEventListener("click", runningEasy);
running2.addEventListener("click", runningMed);
running3.addEventListener("click", runningHard);
swimming1.addEventListener("click", swimmingEasy);
swimming2.addEventListener("click", swimmingMed);
swimming3.addEventListener("click", swimmingHard);
flying1.addEventListener("click", flyingEasy);
flying2.addEventListener("click", flyingMed);
flying3.addEventListener("click", flyingHard);

closeRaceMenu.addEventListener("click", goBack);
