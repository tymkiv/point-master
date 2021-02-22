import {contain} from 'intrinsic-scale';

export default class Particle {
  constructor(props = {}) {
    this.index    = props.index; // index of point
    this.floatArr = props.floatArr; // array of all normalized points
    this.mouse    = props.mouse;
    this.speed    = Math.random() / 2;   

    this.containerWidth  = props.containerWidth;
    this.containerHeight = props.containerHeight;
    
    this.NATURAL_WIDTH  = props.naturalWidth;  // natural size of pictur
    this.NATURAL_HEIGHT = props.naturalHeight;
    
    this.NATIVE_X = props.x; // natives values cannot be changed for one image
    this.NATIVE_Y = props.y;
    this.NATIVE_Z = props.z;

    this.originX = this.NATIVE_X; // gravitational coords
    this.originY = this.NATIVE_Y;
    this.originZ = this.NATIVE_Z;

    this.updateSize();    

    // random positioning outside the screen
    this.x = this.containerWidth - Math.floor(Math.random() * this.containerWidth); 
    this.y = this.containerHeight + Math.floor(Math.random() * this.containerHeight * 2);
    this.z = this.originZ;

    this.setPointToArray();
  }

  setPointToArray() {
    // normalized point and set in arr
    this.floatArr[this.index * 3 + 0] = this.x / this.containerWidth;
    this.floatArr[this.index * 3 + 1] = 1 - this.y / this.containerHeight;
    this.floatArr[this.index * 3 + 2] = this.z;
  }

  updateSize() {
    // resizing from natural to [object-contain] size and centring
    const {width, height, x, y} = contain(this.containerWidth, this.containerHeight, this.NATURAL_WIDTH, this.NATURAL_HEIGHT);
    this.originX = this.NATIVE_X * width + x;
    this.originY = this.NATIVE_Y * height + y;
  }

  resize(width, height) {    
    this.containerWidth = width;
    this.containerHeight = height;

    this.updateSize();
  }

  move() {
    const dx = this.mouse.x - this.x;
    const dy = this.mouse.y - this.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    const s = 100 / d;
  
    const normalX = dx / d;
    const normalY = dy / d;

    const oDistX = this.originX - this.x;
    const oDistY = this.originY - this.y;

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
    this.floatArr = props.floatArr;

    this.NATURAL_WIDTH  = props.naturalWidth;
    this.NATURAL_HEIGHT = props.naturalHeight;
    
    this.NATIVE_X = props.x;
    this.NATIVE_Y = props.y;
    this.NATIVE_Z = props.z;

    this.originX = this.NATIVE_X;
    this.originY = this.NATIVE_Y;
    this.originZ = this.NATIVE_Z;
    
    this.updateSize();    
  }
}