//class declaration
export class Ducky {
    //constructor; JS only allows for 1 constructor
    //default values are specified by = sign; ie. default runlvl=1
    //default values are for player duck
    constructor(name, image, runlvl=0, swimlvl=0,flylvl=0,
                runprog=0, swimprog=0, flyprog=0, stamina=50, xcor=50, ycor=500) {
        //duck var declaration
        this.height = 77;
        this.width = 77;
        this.skin = new Image();
        this.skin.src = image;
        this.name = name;
        this.running_level = runlvl;
        this.swimming_level = swimlvl;
        this.flying_level = flylvl;
        //NPC ducks don't need progress for courses
        this.run_progress = runprog;
        this.swim_progress = swimprog;
        this.fly_progress = flyprog;
        this.stamina = stamina;
        this.xcor = xcor;
        this.ycor = ycor;

        //~~~~?
        this.gra = 0.05;
        this.gravitySpeed = 0;
    }

    runup(exp) {
        this.run_progress += exp;
        let temp = this.run_progress;
        let requirement = 100;

        while (requirement < temp){
          this.running_level += 1;
          temp -= requirement;
          requirement += (1/2 * requirement);
        }

        return this.running_level;
    }
    swimup(exp) {
        this.swim_progress += exp;
        let temp = this.swim_progress;
        let requirement = 100;

        while (requirement < temp){
          this.swimming_level += 1;
          temp -= requirement;
          requirement += (1/2 * requirement);
        }

        return this.swimming_level;
    }
    flyup(exp) {
      this.fly_progress += exp;
      let temp = this.fly_progress;
      let requirement = 100;

      while (requirement < temp){
        this.flying_level += 1;
        temp -= requirement;
        requirement += (1/2 * requirement);
      }

      return this.flying_level;
  }

    namechange(name) {
        this.name = name;
    }
    skinchange(skin) {
        this.skin = skin;
    }

    moveUp(){
      this.ycor -= 5;
    }
    moveDown(){
      this.ycor += 5;
    }
    moveRight(){
      this.xcor += 5;
    }
    moveLeft(){
      this.xcor -= 5;
    }

    //default xy cors (if not inputted as param) are the duck's
    drawDuck(context, stepAnim, frameAnim){
      context.drawImage(this.skin, stepAnim, frameAnim, this.width, this.height,
      this.xcor, this.ycor, this.width, this.height); //sx, sy, swidth, sheight, dx, dy, ...
    }
    gravity(time) {
      this.fallspeed = (Date.now() - time) / 1000;
      this.fallspeed = 3 * this.fallspeed * this.fallspeed;
      this.ycor += this.fallspeed;
    }

    newGravity(){
      this.gravitySpeed += this.gra;
      this.ycor += this.gravitySpeed;
    }

    setLvl(lvl){
      this.running_level=lvl;
      this.swimming_level=lvl;
      this.flying_level=lvl;
    }

}
