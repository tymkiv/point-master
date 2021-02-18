export default class Particle {
  constructor(props = {}) {
    this.originX = props.x || 0;
    this.originY = props.y || 0;
    this.originZ = props.z || 0;

    this.x = this.originX;
    this.y = this.originY;
    this.z = this.originZ;

    this.floatArr = props.floatArr;

    this.index = props.index;

    this.mouse = props.mouse;

    this.width = props.width;
    this.height = props.height;

    this.speedX = 0;
    this.speedY = 0;
    this.speedZ = 0;

    // this.radius = 50;
    this.radius = Math.random() * (150 - 50) + 50;

    this.friction = 0.9;
    // this.friction = Math.random() * (0.9 - 0.6) + 0.6;
    this.gravity = 0.01;

    

    const normalized = this.normalize(this.x, this.y, this.z);

    this.floatArr[this.index * 3 + 0] = normalized.x;
    this.floatArr[this.index * 3 + 1] = normalized.y;
    this.floatArr[this.index * 3 + 2] = normalized.z;
  }

  normalize(x = 0, y = 0, z = 0) {
    return {
      x: x / this.width,
      y: 1 - y / this.height,
      z,
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  update() {
    this.radius = Math.random() * (150 - 1) + 1;
    this.maxGravity = 0.01 + Math.random() * 0.03;
    const distanceX = (this.mouse.x - this.x);
    const distanceY = (this.mouse.y - this.y);

    const distance = Math.sqrt(distanceX**2 + distanceY**2);

    const normalX = distanceX / distance;
    const normalY = distanceY / distance;

    if (distance < this.radius){
      // this.gravity *= 0.9;
      this.speedX -= normalX;
      this.speedY -= normalY;
      
    } else {
      // this.speedZ /= 10;
      this.gravity += 0.1 * (this.maxGravity - this.gravity);
    }
    
    // back home
    const oDistX = this.originX - this.x;
    const oDistY = this.originY - this.y;

    this.speedX += oDistX * this.gravity;
    this.speedY += oDistY * this.gravity;

    this.speedX *= this.friction;
    this.speedY *= this.friction;

    this.x += this.speedX;
    this.y += this.speedY;

    this.z += Math.sqrt(this.speedX**2 + this.speedY**2) / 1000;
    this.z *= 0.9;

    const normalized = this.normalize(this.x, this.y, this.z);
    
    this.floatArr[this.index * 3 + 0] = normalized.x;
    this.floatArr[this.index * 3 + 1] = normalized.y;
    this.floatArr[this.index * 3 + 2] = normalized.z;
  }
}