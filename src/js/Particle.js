export default class Particle {
  constructor(props = {}) {
    this.width = props.width;
    this.height = props.height;

    this.originX = props.x || 0;
    this.originY = props.y || 0;
    this.originZ = props.z || 0;

    this.originX = Math.random();
    this.originY = Math.random();
    this.originZ = Math.random();

    this.x = this.originX;
    this.y = this.originY;
    this.z = this.originZ;

    this.x = this.width - Math.floor(Math.random() * this.width); // in 3
    this.y = this.height + Math.floor(Math.random() * this.height * 2);

    this.floatArr = props.floatArr;

    this.index = props.index;

    this.mouse = props.mouse;

    this.speed = Math.round((Math.random() * 400) / 10) + 1;
    

    this.speedX = 0;
    this.speedY = 0;
    this.speedZ = 0;

    // this.radius = 50;
    this.radius = Math.random() * (50 - 30) + 30;

    this.friction = 0.9;
    // this.friction = Math.random() * (0.9 - 0.6) + 0.6;
    this.gravity = 0.001;

    

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
    this.originX *= width / this.width;
    this.originY *= height / this.height;
    this.width = width;
    this.height = height;
  }

  updateMy() {
    // this.radius = Math.random() * (150 - 1) + 1;
    // this.maxGravity = 0.01 + Math.random() * 0.03;
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
      // this.gravity += 0.1 * (this.maxGravity - this.gravity);
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

    this.z += Math.sqrt(this.speedX**2 + this.speedY**2) / 10;
    this.z *= 0.95;
    // const d = Math.sqrt(oDistX * oDistX + oDistY * oDistY);
    // if (d) {
    //   const s = 100 / d;
    //   this.z = ((Math.round((Math.random() * 400) / 10) + 1) / 40) * s * s
    //   if (this.index === 500) {
    //     console.log(this.z);
    //   }
    // }
    
    
    const normalized = this.normalize(this.x, this.y, this.z);
    
    this.floatArr[this.index * 3 + 0] = normalized.x;
    this.floatArr[this.index * 3 + 1] = normalized.y;
    this.floatArr[this.index * 3 + 2] = normalized.z;
  }

  update() {
    const dx = this.mouse.x - this.x;
    const dy = this.mouse.y - this.y;

    const wslogox = this.originX*this.width / 1.5 + 
      this.width / 2 +
      Math.round(Math.random() * 20);

    const wslogoy =
      this.originY*this.height / -1.5 +
      this.height / 2 +
      Math.round(Math.random() * 20);
    
    const d = Math.sqrt(dx * dx + dy * dy);

    const s = 100 / d;

    this.x += -s * (dx / d) + ((wslogox - this.x) * this.speed) / 1000; // weird results with 2
    this.y += -s * (dy / d) + ((wslogoy - this.y) * this.speed) / 1000;

    
    // tt.pos[0] = tt.x;
    // tt.pos[1] = tt.y;
    // tt.pos[2] = (tt.speed / 40) * s * s;

    const normalized = this.normalize(this.x, this.y, this.z);
    this.floatArr[this.index * 3 + 0] = normalized.x;
    this.floatArr[this.index * 3 + 1] = normalized.y;
    this.floatArr[this.index * 3 + 2] = normalized.z;
  }
}