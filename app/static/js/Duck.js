//class declaration
export class Ducky {
    //constructor
    constructor(name, image) {
        //duck var declaration
        this.height = 77;
        this.width = 77;
        this.skin = new Image();
        this.skin.src = image;
        this.name = name;
        this.running_level = 1;
        this.run_progress = 0;
        this.swimming_level = 1;
        this.swim_progress = 0;
        this.flying_level = 1;
        this.fly_progress = 0;
        this.stamina = 50;
        this.xcor = 100;
        this.ycor = 100;
    }
    runup(exp) {
        this.run_progress += exp;
        this.running_level = 0;
        temp = this.run_progress;
        requirement = 100;

        while (requirement < temp){
          this.running_level += 1;
          temp -= requirement;
          requirement += (1/2 * requirement);
        }

        return this.running_level;
    }
    swimup(exp) {
        this.swim_progress += exp;
        this.swimming_level = 0;
        temp = this.swim_progress;
        requirement = 100;

        while (requirement < temp){
          this.swimming_level += 1;
          temp -= requirement;
          requirement += (1/2 * requirement);
        }

        return this.swimming_level;
    }
    flyup(exp) {
      this.fly_progress += exp;
      this.flying_level = 0;
      temp = this.fly_progress;
      requirement = 100;

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

    drawDuck(context, stepAnim, frameAnim){
      context.drawImage(this.skin, stepAnim, frameAnim, this.width, this.height,
        this.xcor, this.ycor, this.width, this.height); //sx, sy, swidth, sheight, dx, dy, ...
    }

}
