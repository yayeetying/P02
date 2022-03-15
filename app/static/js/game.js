import { Ducky } from "./Duck.js";
var c = document.getElementById("gamec");
var cduck;
var ctx = c.getContext("2d");

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
  cduck.drawDuck(ctx);
  //let img = cduck.skin;
  //ctx.drawImage(img, 100, 100); //Image, xcor, ycor
  console.log("is it working yet");
}

document.addEventListener('keydown', function(e) {
  let name = e.key; //ArrowUp, ArrowDown
  console.log(name);

  if (name == "ArrowUp") {
    cduck.moveUp();
  }
  else if (name == "ArrowDown"){
    cduck.moveDown();
  }
  else if (name == "ArrowRight"){
    cduck.moveRight();
  }
  else if (name == "ArrowLeft"){
    cduck.moveLeft();
  }

  console.log("xcor " + cduck.xcor);
  console.log("ycor " + cduck.ycor);
}, false);
