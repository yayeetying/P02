import { Ducky } from "./Duck.js";
var c = document.getElementById("gamec");
var cduck;
var requestID = null;
var ctx = c.getContext("2d");
var keystore = {};

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
  cduck.drawDuck(ctx);
  //let img = cduck.skin;
  //ctx.drawImage(img, 100, 100); //Image, xcor, ycor
  console.log("is it working yet");
  requestID = requestAnimationFrame(animate);
}
function keys() {
  
  if (keystore["ArrowUp"]) {
    cduck.moveUp();
  }
  if (keystore["ArrowDown"]) {
    cduck.moveDown();
  }
  if (keystore["ArrowRight"]) {
    cduck.moveRight();
  }
  if (keystore["ArrowLeft"]) {
    cduck.moveLeft();
  }

//  console.log("xcor " + cduck.xcor);
//  console.log("ycor " + cduck.ycor);
}
document.addEventListener('keydown', function(e) {
  keystore[e.key] = (e.type == 'keydown');
}, true);
document.addEventListener('keyup', function(e) {
  keystore[e.key] = (e.type == 'keydown');
}, true);
