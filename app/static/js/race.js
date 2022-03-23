//https://ucarecdn.com/a87ffce5-df1c-4ea5-b706-135238c6487e/grasslands.jpeg
import { Ducky } from "./Duck.js";

var grasslands = new Image();
grasslands.src = "https://ucarecdn.com/a87ffce5-df1c-4ea5-b706-135238c6487e/grasslands.jpeg";

var seas = new Image();
seas.src = "https://ucarecdn.com/44e1e40d-274d-4620-a451-6bfe42f99bb6/sea.jpg";

let clouds = new Array();
let cloudsId; //interval at which clouds spawn

let c = document.getElementById("gamec");

//NPCs
let npc1, npc2, npc3;

function createCloud(){
  let img = new Image(200, 110);
  img.src = 'https://www.freepnglogos.com/uploads/cloud-clipart/cloud-clipart-clipart-panda-clipart-images-5.png';
  let cloud = {"image":img, "x":c.width, "y":Math.floor(Math.random()*(c.height/3)), "dx":-0.5 }
  clouds.push(cloud);
  //console.log(clouds);
}

function drawBackground(ctx, canvas, background){

  //draw background
  if (background == 0) {
    //grasslands
    ctx.drawImage(grasslands, 0, 0, canvas.width, canvas.height);
  }
  else if (background == 1) {
    //seas
    ctx.drawImage(seas, 0, 0, canvas.width, canvas.height);
  }

<<<<<<< HEAD
  //spawn clouds
  spawn();
=======
  //clouds
  //console.log('hey');
  //console.log("heyyyyy");
>>>>>>> cdb8d2c825435c00e3a4105a407d667b83510343
  for (let i = 0; i < clouds.length; i++){
    ctx.beginPath();
    ctx.drawImage(clouds[i].image, clouds[i].x, clouds[i].y, clouds[i].image.width, clouds[i].image.height);
    clouds[i].x += clouds[i].dx;
    if (clouds[i].x <= -200){
      clouds.shift();
      i--;
    }
  }
};

function spawn(interval){
  //console.log(cloudsId);
  if (!cloudsId){
    cloudsId = setInterval(createCloud, interval); //repeatedly call fxn with delay
  }
}

function clearClouds(){
  clouds = [];
}

function startingClouds(){
  let img = new Image(200, 110);
  img.src = 'https://www.freepnglogos.com/uploads/cloud-clipart/cloud-clipart-clipart-panda-clipart-images-5.png';
  let cloud1 = {"image":img, "x":300, "y":Math.floor(Math.random()*(c.height/3)), "dx":-0.5 }
  let cloud2 = {"image":img, "x":550, "y":Math.floor(Math.random()*(c.height/3)), "dx":-0.5 }
  let cloud3 = {"image":img, "x":800, "y":Math.floor(Math.random()*(c.height/3)), "dx":-0.5 }
  clouds.push(cloud1);
  clouds.push(cloud2);
  clouds.push(cloud3);
}

//temporary duckimgs
var npcimg = new Image();
npcimg.src = "https://ucarecdn.com/5db28345-9deb-4530-a434-732b59f6f54f/duckgray.png"

function createNPCs(){
  // npc1 = new Ducky("NPC1", npcimg, 10, 10, 10, 60, 50, 500);
  // npc2 = new Ducky("NPC2", npcimg, 10, 10, 10, 60, 50, 500);
  // npc3 = new Ducky("NPC3", npcimg, 10, 10, 10, 60, 50, 500);
}

//exporting variables and functions
export {grasslands, seas, clouds, cloudsId, createCloud, drawBackground, spawn, clearClouds, startingClouds,
        npc1, npc2, npc3, createNPCs};
