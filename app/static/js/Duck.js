//class declaration
export class Ducky {
    //constructor
    constructor(name, image) {
        //duck var declaration
        this.height;
        this.width;
        this.skin = new Image();
        this.skin.src = image;
        this.name = name;
        this.running_level = 1;
        this.swimming_level = 1;
        this.flying_level = 1;
        this.stamina = 50;
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

}