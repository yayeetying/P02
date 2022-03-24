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
  let cloud = {"image":img, "x":c.width, "y":Math.floor(Math.random()*(c.height/3)), "dx":-2 }
  clouds.push(cloud);
  //console.log(clouds);
}

let backImg = new Image();
function drawBackground(ctx, canvas, background){

  if (background == 0){ //running + main menu: grasslands
    backImg.src = "https://ucarecdn.com/a87ffce5-df1c-4ea5-b706-135238c6487e/grasslands.jpeg";
  }else if (background == 1){//swimming: seas
    backImg.src = "https://ucarecdn.com/44e1e40d-274d-4620-a451-6bfe42f99bb6/sea.jpg";
  }

  newBackground(canvas, background);
  for (let i = 0; i < backgrounds.length; i++){
    ctx.beginPath();
    ctx.drawImage(backgrounds[i].image, backgrounds[i].x, backgrounds[i].y, backgrounds[i].w, backgrounds[i].h);
    backgrounds[i].x += backgrounds[i].dx;
    if (backgrounds[i].x <= -799){
      backgrounds.shift();
      i--;
    }
  }

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

let backgrounds = [];

function newBackground(canvas, background){
  if (backgrounds.length < 1){
    let background1 = {"image":backImg, "x":0, "y":0, "w":canvas.width, "h":canvas.height, "dx":-0.1};
    let background2 = {"image":backImg, "x":799, "y":0, "w":canvas.width, "h":canvas.height, "dx":-0.1};
    backgrounds.push(background1);
    backgrounds.push(background2);
  }else if (backgrounds.length < 2){
    let background = {"image":backImg, "x":799, "y":0, "w":canvas.width, "h":canvas.height, "dx":-0.1};
    backgrounds.push(background);
  }
}

function spawn(interval){
  //console.log(cloudsId);
  if (!cloudsId){
    cloudsId = setInterval(createCloud, interval); //repeatedly call fxn with delay
  }
}

function clearClouds(){
  clearInterval(cloudsId);
  cloudsId=null;
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
