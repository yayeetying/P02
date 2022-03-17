import { Ducky } from "./Duck.js";
var c = document.getElementById("gamec");
var cduck;
var requestID = null;
var ctx = c.getContext("2d");
var keystore = {};
var yfactor; //for frames in sprite sheet; 4 directions
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
    cduck.moveUp();
    yfactor = 3;
    xfactor++;
  }
  if (keystore["ArrowDown"]) {
    cduck.moveDown();
    yfactor = 0;
    xfactor++;
  }
  if (keystore["ArrowRight"]) {
    cduck.moveRight();
    yfactor = 2;
    xfactor++;
  }
  if (keystore["ArrowLeft"]) {
    cduck.moveLeft();
    yfactor = 1;
    xfactor++;
  }

  if (xfactor > 3){
    xfactor = 0; //reset
  }

}
document.addEventListener('keydown', function(e) {
  keystore[e.key] = (e.type == 'keydown');
}, true);
document.addEventListener('keyup', function(e) {
  keystore[e.key] = (e.type == 'keydown');
}, true);
