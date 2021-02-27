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

    this.x = this.originalX;
    this.y = this.originalY;
    this.z = this.originalZ;

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
    const dx = this.mouse.x - this.x;
    const dy = this.mouse.y - this.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    const s = 100 / d;
  
    const normalX = dx / d;
    const normalY = dy / d;

    const oDistX = this.originalX - this.x;
    const oDistY = this.originalY - this.y;

    // inertial returning to original place
    this.x += this.speed / 10 * oDistX;
    this.y += this.speed / 10 * oDistY;

    // reaction on mouse
    this.x -= normalX * s;
    this.y -= normalY * s;
    this.megaZ = this.speed / 2 * s * s;
  
    this.setPointToArray();
  }

  changeImage(props) {
    this.originalX = props.x;
    this.originalY = props.y;
    this.originalZ = props.z;
  }
}