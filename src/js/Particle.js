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

    // this.radius = 50;
    this.radius = Math.random() * (200 - 50) + 50;

    // this.friction = 0.9;
    this.friction = Math.random() * (0.9 - 0.6) + 0.6;
    this.gravity = 0.01;

    this.maxGravity = 0.01 + Math.random() * 0.03;

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

  update() {
    const distanceX = (this.mouse.x - this.x);
    const distanceY = (this.mouse.y - this.y);

    const distance = Math.sqrt(distanceX**2 + distanceY**2);

    const normalX = distanceX / distance;
    const normalY = distanceY / distance;

    if (distance < this.radius){
      this.gravity *= 0.9;
      this.speedX -= normalX;
      this.speedY -= normalY;
    } else {
      this.gravity += 0.1 * (this.maxGravity - this.gravity);
      // this.gravity += 0.1;
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

    const normalized = this.normalize(this.x, this.y, this.z);

    this.floatArr[this.index * 3 + 0] = normalized.x;
    this.floatArr[this.index * 3 + 1] = normalized.y;
    this.floatArr[this.index * 3 + 2] = normalized.z;
  }
}