import {contain} from 'intrinsic-scale';

export default class Particle {
  constructor(props = {}) {
    this.index = props.index;
    this.mouse = props.mouse;

    this.NATURAL_X = props.x;
    this.NATURAL_Y = props.y;
    this.NATURAL_Z = props.z;

    this.NATURAL_WIDTH  = props.naturalWidth;
    this.NATURAL_HEIGHT = props.naturalHeight;

    this.containerWidth  = props.containerWidth;
    this.containerHeight = props.containerHeight;
    
    this.positionArr = props.positionArr;
   
    this.speed = Math.random() / 2;   

    this.updateSize();

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
  }

  updateSize() {
    const {width, height} = contain(this.containerWidth, this.containerHeight, this.NATURAL_WIDTH, this.NATURAL_HEIGHT);

    this.originalX = this.NATURAL_X * width - width / 2;
    this.originalY = height / 2 - this.NATURAL_Y * height;
    this.originalZ = this.NATURAL_Z;
  }

  resize(newContainerWidth, newContainerHeight) {    
    this.containerWidth = newContainerWidth;
    this.containerHeight = newContainerHeight;

    this.updateSize();
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
    // this.z = this.speed * 2 * s * s;
  
    this.setPointToArray();
  }

  changeImage(props) {
    this.NATURAL_WIDTH  = props.naturalWidth;
    this.NATURAL_HEIGHT = props.naturalHeight;
    
    this.NATURAL_X = props.x;
    this.NATURAL_Y = props.y;
    this.NATURAL_Z = props.z;
    
    this.updateSize();    
  }
}