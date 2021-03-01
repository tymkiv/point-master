export default class Particle {
  constructor(props = {}) {
    this.index = props.index;
    this.mouse = props.mouse;

    this.originalX = props.x;
    this.originalY = props.y;
    this.originalZ = props.z;

    this.containerWidth  = props.containerWidth;
    this.containerHeight = props.containerHeight;
    
    this.positionArr = props.positionArr;
    this.sizeArr = props.sizeArr;
   
    this.speed = Math.random() * (0.5 - 0.001) + 0.001;
    this.megaZ = 0;

    this.stateToPLay = false;

    this.x = this.originalX;
    this.y = this.originalY;
    this.z = this.originalZ;

    this.time = 0;
    // random positioning outside the screen
    this.x = Math.floor(Math.random() * this.containerWidth) - this.containerWidth / 2; 
    this.y = this.containerHeight / 2 - (this.containerHeight + Math.floor(Math.random() * this.containerHeight * 2));

    this.setPointToArray();
  }

  setPointToArray() {
    this.positionArr[this.index * 3 + 0] = this.x;
    this.positionArr[this.index * 3 + 1] = this.y;
    this.positionArr[this.index * 3 + 2] = this.z;
    this.sizeArr[this.index] = this.megaZ;
  }

  move() {
    this.defaultPhysics();
    
    if (this.stateToPLay === 'one') {
      this.sketchOne();
    }
    
    // inertial returning to original place
    this.x += this.speed / 10 * this.oDistX;
    this.y += this.speed / 10 * this.oDistY;

    // reaction on mouse
    this.x -= this.normalX * this.s;
    this.y -= this.normalY * this.s;
    this.megaZ = this.speed / 2 * this.s * this.s;
  
    this.setPointToArray();
  }

  sketchOne() {
    this.time += 1;

    if (this.index % 2 === 0) {
      this.radius = Math.abs(Math.sin(this.time / 100) * 300) + 50;
    }
    if (this.index % 3 === 0) {
      this.radius = Math.abs(Math.cos(this.time / 100) * 300) + 50;
    }
    if (this.index % 5 === 0) {
      this.radius = Math.abs(Math.sin(this.time / 100)) * 100 + 100;
    }

    this.originalX = this.radius * Math.cos((2 * Math.PI * (this.index)/ 100 +this.time/100) );
    this.originalY = this.radius * Math.sin((2 * Math.PI * (this.index)/ 100 +this.time/100) );
    // this.z = Math.sin(this.time/100) * 50;
  }

  defaultPhysics() {
    this.dx = this.mouse.x - this.x;
    this.dy = this.mouse.y - this.y;
    this.d = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    this.s = 100 / this.d;

    this.normalX = this.dx / this.d;
    this.normalY = this.dy / this.d;

    this.oDistX = this.originalX - this.x;
    this.oDistY = this.originalY - this.y;
  }

  changeImage(props) {
    this.stateToPLay = false;
    this.originalX = props.x;
    this.originalY = props.y;
    this.originalZ = props.z;
  }

  changeSketch(sketch) {
    this.stateToPLay = sketch;
  }
}