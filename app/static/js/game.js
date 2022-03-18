 import { Ducky } from "./Duck.js";
var c = document.getElementById("gamec");
var cduck;
var requestID = null;
var ctx = c.getContext("2d");
var keystore = {};
var yfactor = 0; //for frames in sprite sheet; 4 directions
var xfactor = 0; //also for frames; 3 frames walking stuff
var time = Date.now(); //for pacing thru frames in sprite sheet; milliseconds

function load_duck() {
    console.log(cname);
    console.log(cskin);
    cduck = new Ducky(cname, cskin);
    console.log(cduck.skin.src);
    cduck.skin.onload = animate; //when image loads, call animate fxn
}

window.onload = function() {
    console.log("test");
    load_duck();
    console.log("test");
};

function animate() {
  window.cancelAnimationFrame(requestID);
  ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
  keys();
  cduck.drawDuck(ctx, xfactor*78, yfactor*80);
  //let img = cduck.skin;
  //ctx.drawImage(img, 100, 100); //Image, xcor, ycor
  console.log("is it working yet");
  requestID = requestAnimationFrame(animate);
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
  console.log(time);
}

//determines xfactor based off time
function timing(){
  if (Date.now() - time < 200){
    xfactor = 0;
  }
  else if (Date.now() - time < 40) {
    xfactor = 1;
  }
  else if (Date.now() - time < 600){
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
