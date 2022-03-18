//https://ucarecdn.com/a87ffce5-df1c-4ea5-b706-135238c6487e/grasslands.jpeg

var background = new Image();
background.src = "https://ucarecdn.com/a87ffce5-df1c-4ea5-b706-135238c6487e/grasslands.jpeg";

let clouds = new Array();
let cloudsId;

function createCloud(){
  let img = new Image(200, 100);
  img.src = 'http://clipart-library.com/img/1388735.png';
  let cloud = {"image":img, "x":c.width, "y":Math.floor(Math.random()*(c.height/3)), "dx":-0.5 }
  if (clouds.length < 3){
    clouds.push(cloud);
  }
  console.log(clouds);
}

function drawBackground(ctx, canvas){

  //draw background
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  //clouds
  // for (let i = 0; i < clouds.length; i++){
  //   ctx.beginPath();
  //   ctx.drawImage(clouds[i].image, clouds[i].x, clouds[i].y, clouds[i].image.width, clouds[i].image.height);
  //   clouds[i].x += clouds[i].dx;
  //   if (clouds[i].x <= -200){
  //     clouds.shift();
  //     i--;
  //   }
  // }
};

function spawn(){
  if (!cloudsId){
    cloudsId = setInterval(createCloud, 5000);
  }
}

//exporting variables and functions
export {background, clouds, cloudsId, createCloud, drawBackground, spawn};