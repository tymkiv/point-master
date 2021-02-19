export default class Particle {
  constructor(
    k,
    i,
    j,
    particlePositions_,
    particleNum_,
    particleSpeed_,
    particleIndex_,
  ) {
    this.i = i; // номер по х
    this.j = j; // номер по y
    this.init();
    this.x = this.x0;
    this.y = this.y0;
    this.pos = posArray.subarray(k * 3, k * 3 + 3);
    this.pointer = pointer;
    this.runned = 0;
    this.particlePositions = particlePositions_;
    this.particleNum = particleNum_;
    this.speed = particleSpeed_;
    this.particleIndex = particleIndex_;
  }
  init() {
    this.x0 = canvas.width * 0.5 + (this.i * canvas.width) / partcileNumX;
    this.y0 = canvas.height * 0.5 + (this.j * canvas.height) / partcileNumY;
  }
  move(particlePositions_) {
    this.particlePositions = particlePositions_;
    // const r = Math.floor(Math.random() * 100);
    // if (r == 1) {
    //   console.log("element");
    // }
    if (this.runned == 0) {
      this.runned = 1;
      // this.x = vw / 2; // ortada baslamalari icin
      // this.y = vh / 2; // ortada baslamalari icin
      const dx = this.pointer.x;
      const dy = this.pointer.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const s = 1000 / d;
      this.x = vars.vw - Math.floor(Math.random() * vars.vw); // in 3
      this.y = vars.vh + Math.floor(Math.random() * vars.vh * 2); // in 3
    } else {
      for (let i = 0; i < this.particleIndex.length; i++) {
        const e = this.particleIndex[i];
        if (e[0] === this.particlePositions) {
          e[1](this, vars.vw, vars.vh);
          break;
        }
      }
      (this, vars.vw, vars.vh)
      function(tt, ww, hh) {
        let e = 0;
        let currentNum = 0;
        for (let i = 0; i < 100; i++) {
          if (wslogo[tt.particleNum - wslogolength * e]) {
            currentNum = tt.particleNum - wslogolength * e;
            break;
          } else {
            e++;
          }
        }
        if (wslogo[currentNum]) {
          const dx = tt.pointer.x - tt.x;
          const dy = tt.pointer.y - tt.y;
          const wslogox =
            (wslogo[currentNum][0] * ww) / 1.5 +
            ww / 2 +
            Math.round(Math.random() * 20);
          const wslogoy =
            (wslogo[currentNum][1] * ww) / -1.5 +
            hh / 2 +
            Math.round(Math.random() * 20);
          // const dy = moustache[tt.particleNum][1] * 1000 - tt.y + 500;
          const d = Math.sqrt(dx * dx + dy * dy);
          const s = 100 / d;
          tt.x += -s * (dx / d) + ((wslogox - tt.x) * tt.speed) / 1000; // weird results with 2
          tt.y += -s * (dy / d) + ((wslogoy - tt.y) * tt.speed) / 1000;
          // update buffer position
          tt.pos[0] = tt.x;
          tt.pos[1] = tt.y;
          tt.pos[2] = (tt.speed / 40) * s * s;
        }
        // const r = Math.floor(Math.random() * 1000);
        // if (r == 1) {
        //   console.log(moustache[tt.particleNum][0]);
        // }
      };
    }
  }
}