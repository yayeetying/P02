//https://ucarecdn.com/a87ffce5-df1c-4ea5-b706-135238c6487e/grasslands.jpeg

var background = new Image();
background.src = "https://ucarecdn.com/a87ffce5-df1c-4ea5-b706-135238c6487e/grasslands.jpeg";

let clouds = new Array();
let cloudsId = 5; //interval at which clouds spawn

//NPCs
let npc1, npc2, npc3;

function createCloud(){
  let img = new Image(200, 100);
  img.src = 'http://clipart-library.com/img/1388735.png';
  let cloud = {"image":img, "x":c.width, "y":Math.floor(Math.random()*(c.height/3)), "dx":-0.5 }
  if (clouds.length < 3){
    clouds.push(cloud); //add cloud to array clouds
  }
  console.log(clouds);
}

function drawBackground(ctx, canvas){

  //draw background
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  //clouds
  console.log('hey');
  spawn();
  console.log("heyyyyy");
  for (let i = 0; i < clouds.length; i++){
    ctx.beginPath();
    console.log(clouds[i]);
    ctx.drawImage(clouds[i].image, clouds[i].x, clouds[i].y, clouds[i].image.width, clouds[i].image.height);
    clouds[i].x += clouds[i].dx;
    if (clouds[i].x <= -200){
      clouds.shift();
      i--;
    }
  }
};

function spawn(){
  console.log(cloudsId);
  if (!cloudsId){
    cloudsId = setInterval(createCloud, 5000); //repeatedly call fxn with delay
  }
}

//temporary duckimgs
var npcimg = new Image();
npcimg.src = "https://ucarecdn.com/5db28345-9deb-4530-a434-732b59f6f54f/duckgray.png"

function createNPCs(){
  npc1 = new Ducky("NPC1", npcimg, 10, 10, 10, 60, 50, 500);
  npc2 = new Ducky("NPC2", npcimg, 10, 10, 10, 60, 50, 500);
  npc3 = new Ducky("NPC3", npcimg, 10, 10, 10, 60, 50, 500);
}

//exporting variables and functions
export {background, clouds, cloudsId, createCloud, drawBackground, spawn};
