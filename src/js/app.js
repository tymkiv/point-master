import * as THREE from 'three';
import gsap from 'gsap';

import Particle from './Particle';
import vertexShader from './simulation/vertexShader.glsl';
import fragmentShader from './simulation/fragmentShader.glsl';

const OrbitControls = require('three-orbit-controls')(THREE)

function loadImages(paths, onLoad) {
  const imgs = [];
  let counter = 0;
  paths.forEach((path, i) => {
    const img = new Image;
    img.onload = () => {
      imgs[i] = img;
      counter += 1;
      if (counter === paths.length) onLoad(imgs);
    }
    img.src = path;
  });
}

class Sketch {
  constructor(container) {
    this.container = container;

    this.init();

    // Do something

    this.isPlaing = false;
    this.mouse = {x: 0, y: 0};
    this.particles = [];
    this.particleSize = 2;
    this.data = [];

    loadImages(['img/1.png', 'img/2.png'], imgs => {
      imgs.forEach(img => {
        this.data.push({
          img,
          points: this.getResultFromImg(img)
        })
      })
      this.initSketch(0);
      
      document.querySelector('.js-0').addEventListener('click', () => {this.updateSketch(0)});
      document.querySelector('.js-1').addEventListener('click', () => {this.updateSketch(1)});

      
      
    })    
    
    // End of something
  }

  initSketch(indexOfData) {
    if (!this.isPlaing) {
      this.isPlaing = true;
      this.floatArr = new Float32Array(this.data[indexOfData].points.length * 3);

      for (let i = 0; i < this.data[indexOfData].points.length; i += 1) {
        this.particles.push(new Particle({
          index: i,
          x: this.data[indexOfData].points[i].x,
          y: this.data[indexOfData].points[i].y,
          z: Math.random() * (0.2 - 0.1) + 0.2,
          floatArr: this.floatArr,
          mouse: this.mouse,
          containerWidth: this.container.clientWidth,
          containerHeight: this.container.clientHeight,
          naturalWidth: this.data[indexOfData].img.naturalWidth,
          naturalHeight: this.data[indexOfData].img.naturalHeight,
        }));
      }

      this.geometry     = new THREE.BufferGeometry();
      this.positionAttr = new THREE.BufferAttribute( this.floatArr, 3 );
    
      this.geometry.setAttribute('position', this.positionAttr);

      this.material = new THREE.ShaderMaterial({
          uniforms: {
            uResolution: { type: "v2", value: new THREE.Vector2() },
            uPixelRatio: { type: 'f', value: window.devicePixelRatio },
          },
          vertexShader,
          fragmentShader,
      });

      this.points = new THREE.Points(this.geometry, this.material);
      this.scene.add(this.points);

      this.onWindowResize();
      this.animate();
    }
    
  }

  updateSketch(indexOfData) {
    if (this.particles.length < this.data[indexOfData].points.length) {
      this.floatArr = new Float32Array(this.data[indexOfData].points.length * 3);
    }
    
    for (let i = 0; i < this.data[indexOfData].points.length; i += 1) {
      if (this.particles[i]) {
        this.particles[i].changeImage({
          x: this.data[indexOfData].points[i].x,
          y: this.data[indexOfData].points[i].y,
          z: Math.random() * (0.2 - 0.1) + 0.2,
          naturalWidth: this.data[indexOfData].img.naturalWidth,
          naturalHeight: this.data[indexOfData].img.naturalHeight,
          floatArr: this.floatArr,
        })
      } else {
        this.particles.push(new Particle({
          index: i,
          x: this.data[indexOfData].points[i].x,
          y: this.data[indexOfData].points[i].y,
          z: Math.random() * (0.2 - 0.1) + 0.2,
          floatArr: this.floatArr,
          mouse: this.mouse,
          containerWidth: this.container.clientWidth,
          containerHeight: this.container.clientHeight,
          naturalWidth: this.data[indexOfData].img.naturalWidth,
          naturalHeight: this.data[indexOfData].img.naturalHeight,
        }));
      }
      
    }

    this.positionAttr = new THREE.BufferAttribute( this.floatArr, 3 );
    this.geometry.setAttribute('position', this.positionAttr);
  }

  

  getResultFromImg(img) {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');

    const width  = img.naturalWidth;
    const height = img.naturalHeight;

    const result = [];

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    
    for (let j = 0; j < Math.floor(height / this.particleSize); j += 1) {
      for (let i = 0; i < Math.floor(width/this.particleSize); i += 1) {
        if (this.hasFill(i*this.particleSize, j*this.particleSize, ctx)) {
          result.push({
            x: i * this.particleSize /width, 
            y: j * this.particleSize /height
          })
        }
      }
    }
    // return {result, width, height};
    return result;
  }

  hasFill(x, y, ctx) {
    for(let i = 0; i < this.particleSize; i++) {
      for(let j = 0; j < this.particleSize; j++) {
        if( ctx.getImageData(x, y, 1, 1).data[3] !== 0 ) {
          return true;
        }
      }
    }
    return false
  }

  init() {
    this.scene    = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.camera   = new THREE.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.001, 100);
    
    this.camera.position.set(0, 0, 1);
    this.renderer.setPixelRatio( window.devicePixelRatio );

    this.container.appendChild( this.renderer.domElement );

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener('resize', this.onWindowResize.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('touchstart', (e) => {this.onMouseMove(e, true)});
    document.addEventListener('touchmove', (e) => {this.onMouseMove(e, true)});
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.move();
  }

  move() {
    this.renderer.render(this.scene, this.camera);

    this.particles.forEach(particle => {
      particle.move();
    })

    this.positionAttr = new THREE.BufferAttribute( this.floatArr, 3 );
    this.geometry.setAttribute('position', this.positionAttr);
  }

  onMouseMove(e, touch) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    if (touch) {
      e.preventDefault();
      this.mouse.x = e.targetTouches[0].clientX;
      this.mouse.y = e.targetTouches[0].clientY;
    }
  }

  onWindowResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.particles.forEach(particle => {
      particle.resize(this.width, this.height);
    })

    this.renderer.setSize(this.width, this.height);

    this.resolutionWidth = this.renderer.domElement.width;
    this.resolutionHeight = this.renderer.domElement.height;
    
    // this.material.uniforms.uResolution.value.x = this.width;
    // this.material.uniforms.uResolution.value.y = this.height;
    this.material.uniforms.uResolution.value.x = this.resolutionWidth;
    this.material.uniforms.uResolution.value.y = this.resolutionHeight;
  }
}

const sketch = new Sketch(document.getElementById('root'));