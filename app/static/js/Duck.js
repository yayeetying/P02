//class declaration
export class Ducky {
    //constructor
    constructor(name, image) {
        //duck var declaration
        this.height = 80;
        this.width = 78;
        this.skin = new Image();
        this.skin.src = image;
        this.name = name;
        this.running_level = 1;
        this.swimming_level = 1;
        this.flying_level = 1;
        this.stamina = 50;
        this.xcor = 100;
        this.ycor = 100;
    }
    runup() {
        this.running_level += 1;
        return this.running_level;
    }
    swimup() {
        this.swimming_level += 1;
        return this.swimming_level;
    }
    flyup() {
        this.flying_level += 1;
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
