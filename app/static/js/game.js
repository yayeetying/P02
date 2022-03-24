import { Ducky } from "./Duck.js";
import {grasslands, seas, clouds, cloudsId, createCloud, drawBackground, spawn, clearClouds, startingClouds} from './race.js';

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
var duck;
var user;
var numCoins = 0; //number of coins --> used for purchasing skins, etc
var coinsAmount = document.getElementById("coins");
var changeXY = true;
let running = false;
let swimming = false;
let flying = false;
//for swimming courses
let stopGlvl; //what ycor to stop gravity
let diving = false;

//var stat_values; //array of [runlvl, swimlvl, flylvl]
//var stats; //string version of stat_values (JSON.stringify() to pass into python file)

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
let saveButton = document.getElementById("save");

function stop(){
  window.cancelAnimationFrame(requestID);
}

function save(difficulty = 0, race = "") {
    var ducksend;
    var usersend;
    var racesend;
    ducksend = [cduck.running_level, cduck.swimming_level, cduck.flying_level, cduck.stamina, cduck.run_progress, cduck.swim_progress, cduck.fly_progress];
    console.log(ducksend);
    usersend = numCoins;
    racesend = [race, difficulty];
    $.post("/save", {
      duck: JSON.stringify(ducksend),
      user: usersend,
      race: JSON.stringify(racesend)
    });
}
saveButton.addEventListener("click", save);
function load_duck(duck) {
//    console.log(cname);
//    console.log(cskin);
    if (duck != "undefined") {
      cduck = new Ducky(cname, cskin, duck[2], duck[3], duck[4], duck[5], duck[6], duck[7]);
    }
    else {
      cduck = new Ducky(cname, cskin);
    }
//    console.log(cduck.skin.src);
    cduck.skin.onload = animate(0); //when image loads, call animate fxn
}
window.onload = function() {
//    console.log("test");

    $.get("/load", function(input) {
      if (input != "no user") {
        duck = $.parseJSON(input)[0];
        user = $.parseJSON(input)[1];
        cname = duck[1]

        numCoins = user[1];
        console.log(duck);
        load_duck(duck);
        runningLvl.innerHTML = "Running <br> Lvl " + cduck.running_level;
        swimmingLvl.innerHTML = "Swimming <br> Lvl " + cduck.swimming_level;
        flyingLvl.innerHTML = "Flying <br> Lvl " + cduck.flying_level;
      }
      else {
        load_duck("undefined");
      }
    });
};

//for movement (arrow keys + jump) and drawing duck and drawing background
function animate(bg=0, stopGlvl=500) {
  ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);

  //import module from race.js (drawBackground fxn) to draw background
  drawBackground(ctx, c, bg); //bg = 0 means grasslands, bg = 1 means sea

  //arrow keys and duck movement
  keys();
  if (cduck.ycor >= stopGlvl) {
    time2 = Date.now();
  }
  if ((Date.now() - time3) < 3000 && cduck.ycor <= stopGlvl) {
    pressed = 1;
    cduck.moveUp();
  }
  else {
    pressed = 0;
  }

  if (bg == 0) { //grasslands
    if (changeXY == true) {  //for changing starting positions in different courses
      cduck.xcor = 50;
      cduck.ycor = 400;
      changeXY = false;
    } //draw duck at bottom left of screen
  }
  else if (bg == 1) { //seas
    if (changeXY == true) {
      cduck.xcor = 50;
      cduck.ycor = 370;
      changeXY = false;
    }
  }

  //for glitch where duck doesn't "load" --> ycor's just way out of canvas
  if (outOfBounds() == true) {
    if (bg == 0) {
      cduck.xcor = 50;
      cduck.ycor = 400;
    }
    else if (bg == 1){
      cduck.xcor = 50;
      cduck.ycor = 370;
    }
    changeXY = false;
  }

  //duck's gravity
  if (bg == 0 && !flying) {//grasslands, always want gravity
    cduck.gravity(time2);
  }
  else if (bg == 1) {//swimming;
    if (cduck.ycor < 375) { //duck jumped up
      cduck.gravity(time2);
    }
    if (cduck.ycor > c.clientHeight-50) { //if duck dives, can't dive under the canvas
      cduck.ycor = c.clientHeight-50;
    }
    if ((Date.now() - time3) < 200) { //after some time, duck is no longer "diving"
      diving = false;
      cduck.gravitySpeed = 0;
    }
    if (diving == false && cduck.ycor > 380 ){ //send 'er back up
      cduck.newGravity();
      console.log("gra: " + cduck.gra);
      console.log("gravitySpeed: " + cduck.gravitySpeed);
    }
  }

  console.log(cduck.xcor+","+cduck.ycor);

  cduck.drawDuck(ctx, xfactor*78, yfactor*80); //draw the duck
}

function outOfBounds(){
  // return ( (swimming == false && running == false && flying == false)
  //         && (cduck.xcor < -10 || cduck.xcor > c.clientWidth+10
  //         || cduck.ycor < -10 || cduck.ycor > c.clientHeight+10) );
  return (running == true && cduck.xcor != 50 && cduck.ycor != 400);
}

function keys() {
  if (keystore["ArrowUp"] && flying && cduck.ycor > 20) {
    timing(); //affects xfactor based off time
    cduck.moveUp();
  }
  if (keystore["ArrowDown"] && flying && cduck.ycor < 500) {
    timing();
    cduck.moveDown();
  }
  if (keystore["ArrowRight"] && swimming) {
    timing();
    cduck.moveRight();
    yfactor = 2;
  }
  if (keystore["ArrowLeft"] && swimming) {
    timing();
    cduck.moveLeft();
    yfactor = 1;
  }
  if (keystore[" "] && pressed == 0 && running) {
    time3 = Date.now();
    cduck.moveUp()
  }
  if (keystore["ArrowUp"] && pressed == 0 && swimming) {
    time3 = Date.now();
    cduck.moveUp()
  }
  if (swimming && diving == false && keystore["ArrowDown"]) {
    time3 = Date.now();
    diving = true;
  }
  if (diving == true) {
    console.log("yes");
    cduck.moveDown();
  }
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


let endTraining = document.getElementById("endTraining");
let endScore = document.getElementById("endScore");
let levelChange = document.getElementById("levelChange");
let stopTrainingButton = document.getElementById("stopTraining");
let retryTrainingButton = document.getElementById("retryTraining");
//for gaining exp & restarting duck menu when duck dies (collides into obstacle)
//course = 0 (running); course = 1 (swimming); course = 2 (flying)
function restart(course){
  endScore.innerHTML = "Score: "+score;
  if (course == 0) {
    let oldLevel = cduck.running_level;
    cduck.runup(score);
    levelChange.innerHTML = "Level Change From "+oldLevel+" To "+cduck.running_level;
    retryTrainingButton.addEventListener("click", trainRunning);
  }
  else if (course == 1) {
    let oldLevel = cduck.swimming_level;
    cduck.swimup(score);
    levelChange.innerHTML = "Level Change From "+oldLevel+" To "+cduck.swimming_level;
    retryTrainingButton.addEventListener("click", trainSwimming);
  }
  else if (course == 2) {
    let oldLevel = cduck.flying_level;
    cduck.flyup(score);
    levelChange.innerHTML = "Level Change From "+oldLevel+" To "+cduck.flying_level;
    retryTrainingButton.addEventListener("click", trainFlying);
  }
  // //update ducky skill lvls from js (Ducky object) to python
  // stat_values = [cduck.running_level, cduck.swimming_level, cduck.flying_level]; //duck stats in array
  // stats = JSON.stringify(stat_values);
  // console.log(stats);

  //update HTML display of ducky's levels
  runningLvl.innerHTML = "Running <br> Lvl " + cduck.running_level;
  swimmingLvl.innerHTML = "Swimming <br> Lvl " + cduck.swimming_level;
  flyingLvl.innerHTML = "Flying <br> Lvl " + cduck.flying_level;

  score = 0; //reset score after gaining exp for ducky
  changeXY = true; //allow for ducky to change xycors depending on which course chosen
}

function finishTraining(course){
  ctx.fillStyle = "black";
  ctx.globalAlpha = 0.7;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.globalAlpha = 1;
  restart(course);
  endTraining.removeAttribute("hidden");
  clearClouds();
  yfactor=0;
  cduck.xcor = 50;
  cduck.ycor = 500;
  changeXY = true;
}

stopTrainingButton.addEventListener("click", goBack);

//animates background (w/ clouds) and moving boulders and coins
let drawRunning = () => {
  //score
  if (requestID%5 == 0){
    score+=1;
  }
  scoreCounter.innerHTML = score;


  requestID = window.cancelAnimationFrame(requestID);
  clear();
  timing();
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
    finishTraining(0); //restart course, gain exp, bring back menu
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
  endTraining.setAttribute("hidden", "hidden");
  score = 0;
  dx = -0.5;
  coins = new Array();
  boulders = new Array();
  clearInterval(coinsId);
  clearInterval(bouldersId);
  //reset coinsId and bouldersId so they spawn again
  coinsId = false;
  bouldersId = false;
  running = true;
  swimming = false;
  flying = false;
  changeXY = true;
  yfactor=2;
  runningControls.removeAttribute("hidden");
  generalControls.setAttribute("hidden", "hidden");
  swimmingControls.setAttribute("hidden", "hidden");
  flyingControls.setAttribute("hidden", "hidden");
  clearClouds();
  startingClouds();
  spawn(5000);
  spawnRunning();
  drawRunning();
}

//coins, boulders, obstacles: all are Arrays(); param items should be an Array
function detectCollision(items){
  for (let i = 0; i < items.length; i++){
    var item = items[i];
    //cduck's xycors are of duck's top-left corner of img; item's xycors are center of item (ie. item is a circle)

    //if ((Math.abs(cduck.xcor-item.x) < cduck.width)
    //&& (Math.abs(cduck.ycor-item.y) < cduck.height) && cduck.xcor-item.x < 0) {

    let xdistance = Math.abs((cduck.xcor + cduck.width/2) -item.x) + 20; //constants are made for buffers
    let xradius = item.r + cduck.width/2;

    let ydistance = Math.abs((cduck.ycor + cduck.height/2) - item.y) + 10;
    let yradius = item.r + cduck.height/2;

    if (xdistance < xradius && ydistance < yradius) { //distance btwn objs < their radii, are colliding
      items.splice(i,1);
      //items.pop(item); //remove item that collided with duck
      i--;
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
    img = new Image(200,200);
    img.src = "https://ucarecdn.com/a401f407-9078-4d8b-9074-4d8248daaed4/flagboat.png";
    obstacle = {"image":img, "x":c.width, "y":300, "dx":dx }
  }else if (temp > 0.666){ //ferry
    img = new Image(400,400);
    img.src = "https://ucarecdn.com/41ec63b0-26c0-4b89-a3a7-0b234271528b/ferry.png";
    obstacle = {"image":img, "x":c.width, "y":200, "dx":dx }
  }else if (temp > 0.5){ //sailboat
    img = new Image(250,250);
    img.src = "https://ucarecdn.com/4a00717c-59d3-45ab-a4da-153523d00c63/sailboat.png";
    obstacle = {"image":img, "x":c.width, "y":300, "dx":dx }
  }else if (temp > 0.333){ //iceberg
    img = new Image(400,400);
    img.src = "https://ucarecdn.com/84168c3b-64f0-4e8b-abcd-0f8b54305d88/iceberg.png";
    obstacle = {"image":img, "x":c.width, "y":200, "dx":dx }
  }else if (temp > 0.166){ //stone post
    img = new Image(400,400);
    img.src = "https://ucarecdn.com/96db148a-a397-44d4-a2ab-bbcec2c1c98d/stone.png";
    obstacle = {"image":img, "x":c.width, "y":250, "dx":dx }
  }else{ //island
    img = new Image(400,400);
    img.src = "https://ucarecdn.com/edea2e26-a332-427c-8747-eed9ef761506/island.png";
    obstacle = {"image":img, "x":c.width, "y":225, "dx":dx }
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

//checks if duck is colliding with obstacle (made specially for swimming course)

function afterObstacle(obstacle) { //x direction
  //duck swimming into obstacle from the right
  if (cduck.xcor > obstacle.x+obstacle.image.width && cduck.xcor - obstacle.x < 5) {
    return obstacle.x;
  }
  return null;
}

function onObstacle(obstacle) { //y directions
  //coming from the top
  if ( (cduck.ycor < obstacle.y && obstacle.y - cduck.ycor < 5)
          || (cduck.ycor > obstacle.y+obstacle.image.height && cduck.ycor - obstacle.y < 5) ){
    return obstacle.y;
  }
  return null;
}

function beforeObstacle(obstacle){
  return (cduck.xcor < obstacle.x && obstacle.x - cduck.xcor < 10
     && cduck.ycor + cduck.height > obstacle.y);
}
function infrontObstacle(obstacle){
  return (cduck.xcor > obstacle.x+obstacle.image.width && cduck.xcor - obstacle.x < 5);
}
function aboveObstacle(obstacle){
  return (cduck.ycor < obstacle.y && obstacle.y - cduck.ycor < 5);
}
function belowObstacle(obstacle){
  return (cduck.ycor > obstacle.y+obstacle.image.height && cduck.ycor - obstacle.y < 5);
}

//checks if ducky is behind (to the left) of obstacle
function behindObstacle() {
  for (let i = 0; i < obstacles.length; i++){
    var obstacle = obstacles[i]; //obstacle is a dictionary
    let on = onObstacle(obstacle);
    let after = afterObstacle(obstacle);

    //checks if duck is behind obstacle
    if (beforeObstacle(obstacle) == true){
      console.log("behind");
      return obstacle.x;
    }
    // if (infrontObstacle(obstacle) == true){
    //   console.log("behind");
    //   return obstacle.x;
    // }
    // if (behindObstacle(obstacle) == true){
    //   console.log("behind");
    //   return obstacle.x;
    // }
    // if (behindObstacle(obstacle) == true){
    //   console.log("behind");
    //   return obstacle.x;
    // }
    // if (cduck.xcor < obstacle.x && obstacle.x - cduck.xcor < 10
    //    && cduck.ycor + cduck.height > obstacle.y) {
    //   console.log("behind");
    //   return obstacle.x;
    // }
    //checks if duck is on, below, or after obstacle
    //if yes, then simulate "standing on" object / can't get past object
    if (on != null) {
      cduck.ycor = on-10;
    }
    if (after != null){
      cduck.xcor = after+10;
    }

  }
  return;
}

let drawSwimming = () => {
  //score
  if (requestID%5 == 0){
    score+=1;
  }
  scoreCounter.innerHTML = score;

  requestID = window.cancelAnimationFrame(requestID);
  clear();
  animate(1, 370); //draws background + duck + handles key movement
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
    if (obstacles[i].x <= -obstacles[i].image.width){
      obstacles.shift();
      i--;
    }
  }

  //duck has to respect the objects!
  //ie. can't just pass thru them sorry that was cryptic
  let obx = behindObstacle();
  if (obx != null) {
    cduck.xcor = obx-10; //duck can't move past the obstacle
  }

  if (detectCollision(coins)){
    numCoins++;
    console.log(numCoins);
  }

  //lose training course when duck is to the left of canvas border
  if (cduck.xcor < -10 || cduck.xcor > c.width+10) {
    finishTraining(1);
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
  endTraining.setAttribute("hidden", "hidden");
  score = 0;
  dx = -0.5;
  coins = new Array();
  obstacles = new Array();
  clearInterval(coinsId);
  clearInterval(obstacleId);
  //reset coinsId and obstacleId so they spawn again
  coinsId = false;
  obstacleId = false;
  yfactor=2;
  running = false;
  flying = false;
  swimming = true;
  changeXY = true;
  swimmingControls.removeAttribute("hidden");
  generalControls.setAttribute("hidden", "hidden");
  runningControls.setAttribute("hidden", "hidden");
  flyingControls.setAttribute("hidden", "hidden");
  clearClouds();
  startingClouds();
  spawn(5000);
  spawnSwimming();
  drawSwimming();
}

let numMoves;
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
    //cduck.gravity(0);
    //for flying course, collecting coins should also propell ducky forward
    for (let i = 0; i < clouds.length; i++){
      clouds[i]["dx"] = -3;
      console.log(clouds[i]);
    }
    for (let i = 0; i < coins.length; i++){
      coins[i].dx = -3;
      console.log(coins[i]);
    }
    console.log(numCoins);
    console.log(cduck.ycor)
  }
  if (numMoves <= 0){
    finishTraining(2);
    return; //pauses game when number of moves runs out (dependent on stamina)
  }
  numMoves-=1;
  console.log(numMoves);

  // if (numCoins == 0){
  //   if (score > 400){
  //     cduck.gravity(time2);
  //     console.log(cduck.ycor)
  //   }
  // }
  // else{
  //   if (score - lastCoinPickUp > 200){
  //     cduck.gravity(time2)
  //   }
  // }

  //detectCollision for flying; restart(2);

  requestID = window.requestAnimationFrame(drawFlying);
};

function spawnFlying(){
  if (!coinsId){
    coinsId = setInterval(createCoin, 6000);
  }
}

function trainFlying(){
  removeButtons();
  endTraining.setAttribute("hidden", "hidden");
  score = 0;
  dx = -0.5;
  coins = new Array();
  clearInterval(coinsId);
  //reset coinsId so they spawn again
  coinsId = false;
  running = false;
  swimming = false;
  flying = true;
  changeXY = true;
  yfactor=2;
  flyingControls.removeAttribute("hidden");
  generalControls.setAttribute("hidden", "hidden");
  runningControls.setAttribute("hidden", "hidden");
  swimmingControls.setAttribute("hidden", "hidden");
  numMoves = cduck.stamina*50;
  clearClouds();
  startingClouds();
  spawn(5000);
  spawnFlying();
  drawFlying();
}

//has entered training courses
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

//in main menu
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
  scoreCounter.setAttribute("hidden", "hidden");
  coinsAmount.setAttribute("hidden", "hidden");
  staminaButton.setAttribute("hidden", "hidden");
  backButton.setAttribute("hidden", "hidden");

  //shop items; turn them hidden
  staminaButton.setAttribute("hidden","hidden");
}

runningButton.addEventListener("click", trainRunning );
swimmingButton.addEventListener("click", trainSwimming );
flyingButton.addEventListener("click", trainFlying );

shopButton.addEventListener("click", goShop);

var store = new Image();
store.src = "https://ucarecdn.com/606482d4-94a6-4350-add3-d494086725f5/store.webp";
var feed = new Image(); //for stamina
feed.src = "https://ucarecdn.com/759f677c-0a84-4f1b-a72c-41ac3dbdb026/stamina.png"

//shop items
let staminaButton = document.getElementById("staminaButton");
let backButton = document.getElementById("backButton");
let notEnough = document.getElementById("notEnough");
let bought = document.getElementById("bought");

staminaButton.addEventListener("click", buyStamina);
backButton.addEventListener("click", goBack);

function goShop(){
  removeButtons();
  //draw background of store
  ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
  ctx.drawImage(store, 0,0, c.clientWidth, c.clientHeight);

  scoreCounter.setAttribute("hidden", "hidden");
  coinsAmount.removeAttribute("hidden");
  staminaButton.removeAttribute("hidden");
  backButton.removeAttribute("hidden");
  coinsAmount.innerHTML = "Coins: "+numCoins;

  ctx.drawImage(feed, 130, 330, 200, 200);
}

function buyStamina(){
  if (numCoins < 5){//stamina costs 5 coins each
    boughtItem(0);
  }
  else {
    numCoins -= 5;
    coinsAmount.innerHTML = "Coins: "+numCoins;
    boughtItem(1);
    cduck.stamina += 1;
    energyLvl.innerHTML = "Energy <br>" + cduck.stamina;
  }
  staminaButton.setAttribute("hidden", "hidden");
  backButton.removeAttribute("hidden");
}

//0 = cannot buy (not enough money); 1 = bought
function boughtItem(wasBought){
  ctx.fillStyle = "black";
  ctx.globalAlpha = 0.7;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.globalAlpha = 1;
  if (wasBought == 0) {
    notEnough.removeAttribute("hidden");
  }
  else {
    bought.removeAttribute("hidden");
  }
}


//temporary ducks 116.25
let npcImg = "https://ucarecdn.com/5db28345-9deb-4530-a434-732b59f6f54f/duckgray.png"
let npc1 = new Ducky("Perry", npcImg, 1, 1, 1, 0, 0, 0, 150, 60, 201.75);
let npc2 = new Ducky("Duckio", npcImg, 1, 1, 1, 0, 0, 0, 150, 60, 324.25);
let npc3 = new Ducky("Bob", npcImg, 1, 1, 1, 0, 0, 0, 150, 60, 446.75);

let start = {"x":150, "y":50, "w":25, "h":500}
let finish = {"x":7500, "y":50, "w":25 , "h":500 }
let raceTimer;
let standings = new Array();
standings.push(npc1);
standings.push(npc2);
standings.push(npc3);
let difficulty;
var race;


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

  yfactor=2;
  cduck.drawDuck(ctx, xfactor*78, yfactor*80);
  npc1.drawDuck(ctx, xfactor*78, yfactor*80);
  npc2.drawDuck(ctx, xfactor*78, yfactor*80);
  npc3.drawDuck(ctx, xfactor*78, yfactor*80);

  ctx.font = '20px serif';
  ctx.fillStyle="black";
  ctx.fillText("You", 5, 89.25);
  ctx.fillText('Perry', 5, 211.75);
  ctx.fillText('Duckio', 5, 334.25);
  ctx.fillText('Bob', 5, 456.75);

  if (raceTimer > 500){
    timing();
    if (cduck.xcor < 340){
      cduck.xcor += 1;
      npc1.xcor += 1;
      npc2.xcor += 1;
      npc3.xcor += 1;
    }else{
      npc1.xcor += (-2*((cduck.running_level-npc1.running_level)/npc1.running_level));
      npc2.xcor += (-2*((cduck.running_level-npc2.running_level)/npc2.running_level));
      npc3.xcor += (-2*((cduck.running_level-npc3.running_level)/npc3.running_level));
    }

    ctx.fillStyle="white";
    ctx.fillRect(finish.x, finish.y, finish.w, finish.h);
    finish.x += -1*(cduck.running_level/5);
    start.x += -1*(cduck.running_level/5);
  }

  raceTimer+=1;

  requestID = window.requestAnimationFrame(drawRunningRace);

  updateEnergy(0);

  if (finish.x < -30){
    placement(0);
    stop();
    endRace();
    standings.pop();
  }
}

function runningRace(){
  clear();
  removeRaceButtons();
  cduck.xcor = 60;
  cduck.ycor = 79.25;
  raceTimer = 0;
  race = "run";
  setDifficulty();
  standings.push(cduck);
  drawRunningRace();
}

function resetRace(){
  raceTimer = 0;
  energyBar = 150;
  finish.x = 7500*difficulty;
  cduck.xcor = 100;
  cduck.ycor = 79.25;
  npc1.xcor = 60;
  npc2.xcor = 60;
  npc3.xcor = 60;
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

  yfactor=2;
  cduck.drawDuck(ctx, xfactor*78, yfactor*80);
  npc1.drawDuck(ctx, xfactor*78, yfactor*80);
  npc2.drawDuck(ctx, xfactor*78, yfactor*80);
  npc3.drawDuck(ctx, xfactor*78, yfactor*80);

  ctx.font = '20px serif';
  ctx.fillStyle="black";
  ctx.fillText("You", 5, 89.25);
  ctx.fillText('Perry', 5, 211.75);
  ctx.fillText('Duckio', 5, 334.25);
  ctx.fillText('Bob', 5, 456.75);

  if (raceTimer > 500){
    timing();
    if (cduck.xcor < 340){
      cduck.xcor += 1;
      npc1.xcor += 1;
      npc2.xcor += 1;
      npc3.xcor += 1;
    }else{
      npc1.xcor += (-2*((cduck.swimming_level-npc1.swimming_level)/npc1.swimming_level));
      npc2.xcor += (-2*((cduck.swimming_level-npc2.swimming_level)/npc2.swimming_level));
      npc3.xcor += (-2*((cduck.swimming_level-npc3.swimming_level)/npc3.swimming_level));
    }

    finish.x += -1*(cduck.swimming_level/5);
    start.x += -1*(cduck.swimming_level/5);
  }

  raceTimer+=1;

  requestID = window.requestAnimationFrame(drawSwimmingRace);

  updateEnergy(1);

  if (finish.x < -30){
    placement(1);
    stop();
    endRace();
    standings.pop();
  }
}

function swimmingRace(){
  clear();
  removeRaceButtons();
  raceTimer = 0;
  race = "swim";
  cduck.xcor = 60;
  cduck.ycor = 79.25;
  setDifficulty();
  standings.push(cduck);
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

  for (let i = 0; i < clouds.length; i++){
    ctx.beginPath();
    ctx.drawImage(clouds[i].image, clouds[i].x, clouds[i].y, clouds[i].image.width, clouds[i].image.height);
    clouds[i].x += clouds[i].dx;
    if (clouds[i].x <= -200){
      clouds.shift();
      i--;
    }
  }

  yfactor=2;
  cduck.drawDuck(ctx, xfactor*78, yfactor*80);
  npc1.drawDuck(ctx, xfactor*78, yfactor*80);
  npc2.drawDuck(ctx, xfactor*78, yfactor*80);
  npc3.drawDuck(ctx, xfactor*78, yfactor*80);

  ctx.font = '20px serif';
  ctx.fillStyle="black";
  ctx.fillText("You", 5, 89.25);
  ctx.fillText('Perry', 5, 211.75);
  ctx.fillText('Duckio', 5, 334.25);
  ctx.fillText('Bob', 5, 456.75);

  if (raceTimer > 500){
    timing();
    if (cduck.xcor < 340){
      cduck.xcor += 1;
      npc1.xcor += 1;
      npc2.xcor += 1;
      npc3.xcor += 1;
    }else{
      npc1.xcor += (-2*((cduck.flying_level-npc1.flying_level)/npc1.flying_level));
      npc2.xcor += (-2*((cduck.flying_level-npc2.flying_level)/npc2.flying_level));
      npc3.xcor += (-2*((cduck.flying_level-npc3.flying_level)/npc3.flying_level));
    }

    finish.x += -1*(cduck.flying_level/5);
    start.x += -1*(cduck.flying_level/5);
  }

  raceTimer+=1;

  requestID = window.requestAnimationFrame(drawFlyingRace);

  updateEnergy(2);

  if (finish.x < -30){
    placement(2);
    stop();
    clearInterval(cloudsId);
    clearClouds();
    endRace();
    standings.pop();
  }
}

function flyingRace(){
  clear();
  startingClouds();
  spawn(3500);
  removeRaceButtons();
  raceTimer = 0;
  race = "fly"
  cduck.xcor = 60;
  cduck.ycor = 79.25;
  setDifficulty();
  standings.push(cduck);
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
  clear();
  changeXY = true;
  animate(0);
  raceResult.setAttribute("hidden", "hidden");
  endTraining.setAttribute("hidden", "hidden");
  running = false;
  swimming = false;
  flying = false;
  generalControls.removeAttribute("hidden");
  runningControls.setAttribute("hidden", "hidden");
  swimmingControls.setAttribute("hidden", "hidden");
  flyingControls.setAttribute("hidden", "hidden");
  notEnough.setAttribute("hidden", "hidden");
  bought.setAttribute("hidden", "hidden");
  save();
  removeRaceButtons();
  addButtons();
}

function endRace(){
  ctx.fillStyle = "black";
  ctx.globalAlpha = 0.7;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.globalAlpha = 1;
  raceResult.removeAttribute("hidden");
  first.innerHTML = "1st: " + standings[0].name;
  second.innerHTML = "2nd: " + standings[1].name;
  third.innerHTML = "3rd: " + standings[2].name;
  fourth.innerHTML = "4th: " + standings[3].name;
  cduck.xcor = 50;
  cduck.ycor = 500;
  if (standings[0].name == cduck.name) {
    save(difficulty, race);
  }
  changeXY = true;
}

function placement(i){
  if (i === 0){
    //running
    standings.sort(function(a, b){return b.running_level - a.running_level});
  }else if (i === 1){
    //swimming
    standings.sort(function(a, b){return b.swimming_level - a.swimminglevel});
  }else{
    //flying
    standings.sort(function(a, b){return b.flyinglevel - a.flyinglevel});
  }
}

function setDifficulty(){
  if (difficulty === 1){
    npc1.setLvl(42.5);
    npc2.setLvl(29.5);
    npc3.setLvl(49.5);
  }else if (difficulty === 2){
    npc1.setLvl(87.5);
    npc2.setLvl(97.5);
    npc3.setLvl(81.5);
  }else{
    npc1.setLvl(148.5);
    npc2.setLvl(143.5);
    npc3.setLvl(132.5);
  }
}

let energyBar = 150;

function updateEnergy(i){
  if (cduck.xcor >= 340 && requestID%5 === 0 && energyBar > 0){
    energyBar -= (150/cduck.stamina);
  }
  if (energyBar <= 0 && finish.x > cduck.xcor){
    standings.pop();
    placement(i);
    standings.push(cduck);
    clearInterval(cloudsId);
    clearClouds();
    stop();
    endRace();
  }
  ctx.fillStyle = "gray";
  ctx.fillRect(595, 20, 160, 60);
  ctx.fillStyle = "yellow";
  ctx.fillRect(600, 25, energyBar, 50);
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
  scoreCounter.setAttribute("hidden", "hidden");
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

//race options menu
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

let generalControls = document.getElementById("generalControls");
let runningControls = document.getElementById("runningControls");
let swimmingControls = document.getElementById("swimmingControls");
let flyingControls = document.getElementById("flyingControls");
