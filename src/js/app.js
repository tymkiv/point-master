import * as THREE from 'three';

import Particle from './Particle';
import vertexShader from './simulation/vertexShader.glsl';
import fragmentShader from './simulation/fragmentShader.glsl';

import dino from './simulation/dino';
import hello from './simulation/hello';
import batman from './simulation/batman';
import superman from './simulation/superman';

const OrbitControls = require('three-orbit-controls')(THREE)

class Sketch {
  constructor(container) {
    this.container = container;

    this.config();
    this.init();
    this.updateSize();

    this.isStarted = false;
    this.mouse = {x: 0, y: 0};
    this.megaMouse = {x: 0, y: 0, z: 0}
    this.particles = [];

    this.loadImages(this.data.map(info => info.path), imgs => {
      imgs.forEach((img, index) => {
        if (!this.data[index].coords) {
          const {coords} = this.getFilledCoordsFromImg(
            img, 
            this.data[index].particleSize
          ) 
          this.data[index].img    = img;
          this.data[index].coords = coords;
        }
        
      })
      const maxSize = this.data.reduce((max, {coords}) => Math.max(max, coords.length), 0);
      this.data.forEach(data => {
        this.fillUp(data.coords, maxSize);
      })
      this.initSketch(0);
    })
  }

  config() {    
    this.minZcoord = 0;   // z coords random from [min] to [max]
    this.maxZcoord = 70;

    this.data = [
      {
        path: 'img/1.png',
        particleSize: 2,
        coords: dino
      },
      {
        path: 'img/2.png',
        particleSize: 2,
        coords: hello
      },
      {
        path: 'img/b.png',
        particleSize: 2,
        coords: batman
      },
      {
        path: 'img/super.png',
        particleSize: 2,
        coords: superman
      },
    ]
  }

  init() {
    this.scene     = new THREE.Scene();
    this.renderer  = new THREE.WebGLRenderer();
    this.camera    = new THREE.PerspectiveCamera(36.7, this.container.clientWidth / this.container.clientHeight, 1, 10000);
    this.raycaster = new THREE.Raycaster();
    // this.controls  = new OrbitControls(this.camera, this.renderer.domElement);

    this.camera.position.set(0, 0, 600);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.raycasterPlane = new THREE.Mesh(new THREE.PlaneGeometry(20000, 20000), new THREE.MeshBasicMaterial())

    window.addEventListener('resize', this.onWindowResize.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('touchstart', (e) => {this.onMouseMove(e, true)});
    document.addEventListener('touchmove', (e) => {this.onMouseMove(e, true)});
  }

  initSketch(indexOfData) {
    if (!this.isStarted) {
      this.isStarted = true;
      this.positionArr = new Float32Array(this.data[indexOfData].coords.length * 3);
      this.sizeArr = new Float32Array(this.data[indexOfData].coords.length * 3);

      for (let i = 0; i < this.data[indexOfData].coords.length; i += 1) {
        this.particles.push(new Particle({
          index: i,
          mouse: this.megaMouse,

          x: this.data[indexOfData].coords[i].x,
          y: this.data[indexOfData].coords[i].y,
          z: Math.random() * (this.maxZcoord - this.minZcoord) + this.minZcoord,

          containerWidth: this.width,
          containerHeight: this.height,
          
          positionArr: this.positionArr,          
          sizeArr: this.sizeArr,          
        }));
      }

      this.geometry     = new THREE.BufferGeometry();
      this.positionAttribute = new THREE.BufferAttribute(this.positionArr, 3);
      this.sizeAttribute = new THREE.BufferAttribute(this.sizeArr, 1);
      this.geometry.setAttribute('position', this.positionAttribute);
      this.geometry.setAttribute('size', this.sizeAttribute);

      this.material = new THREE.ShaderMaterial({
        uniforms: {
          uResolution: { type: 'v2', value: new THREE.Vector2(this.resolutionWidth, this.resolutionHeight) },
          uPixelRatio: { type: 'f',  value: window.devicePixelRatio },
          uMouse:      { type: 'v2', value: this.megaMouse },
        },
        vertexShader,
        fragmentShader,
        alphaTest: 0.5,
        transparent: true,
      });

      this.points = new THREE.Points(this.geometry, this.material);
      this.points.frustumCulled = false;
      this.scene.add(this.points);

      this.animate();
    }
  }

  updateSketch(indexOfData) {    
    for (let i = 0; i < this.data[indexOfData].coords.length; i += 1) {
      this.particles[i].changeImage({
        x: this.data[indexOfData].coords[i].x,
        y: this.data[indexOfData].coords[i].y,
        z: Math.random() * (this.maxZcoord - this.minZcoord) + this.minZcoord,
      })  
    }
  }  

  getFilledCoordsFromImg(img, particleSize) {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');

    const width = img.naturalWidth;
    const height = img.naturalHeight;

    const coords = [];

    canvas.width = width;
    canvas.height = height;
    // document.body.appendChild(canvas);
    ctx.drawImage(img, 0, 0, width, height);
    for (let j = 0; j < Math.floor(height / particleSize); j += 1) {
      for (let i = 0; i < Math.floor(width / particleSize); i += 1) {
        if (this.hasFill(i * particleSize, j * particleSize, ctx, particleSize)) {
          coords.push({
            x: i * particleSize - width / 2, 
            y: height / 2 - j * particleSize 
          })
        }
      }
    }
    return {coords, width, height};
  }

  fillUp(array, fillUpToSize) {
    while (array.length < fillUpToSize) {
      array.push(array[Math.floor(Math.random() * array.length)])
    }
    return this;
  }

  hasFill(x, y, ctx, particleSize) {
    for(let i = 0; i < particleSize; i++) {
      for(let j = 0; j < particleSize; j++) {
        if( 
          ctx.getImageData(x, y, 1, 1).data[0] !== 255 &&
          ctx.getImageData(x, y, 1, 1).data[3] !== 0
          ) {
          return this; // true
        }
      }
    }
    return false
  }

  loadImages(paths, onLoad) {
    const imgs = [];
    let counter = 0;
    paths.forEach((path, i) => {
      const img = new Image;
      img.onload = () => {
        imgs[i] = img;
        counter += 1;
        if (counter === paths.length) {onLoad(imgs)}
      }
      img.src = path;
    })
    return this;
  }

  onMouseMove(e, touch) {
    if (touch) {
      e.preventDefault();
      this.mouse.x = ( e.targetTouches[0].clientX / this.width ) * 2 - 1;
	    this.mouse.y = - ( e.targetTouches[0].clientY / this.height ) * 2 + 1;
    } else {
      this.mouse.x = ( e.clientX / this.width ) * 2 - 1;
	    this.mouse.y = - ( e.clientY / this.height ) * 2 + 1;
    }
  }

  onWindowResize() {
    this.updateSize();
    
    this.material.uniforms.uResolution.value.x = this.resolutionWidth;
    this.material.uniforms.uResolution.value.y = this.resolutionHeight;
  }

  updateSize() {
    this.width  = this.container.clientWidth;
    this.height = this.container.clientHeight;
    
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    const tempAspect = this.camera.aspect < 1 ? this.camera.aspect : 1;
    const maxWidth = 620;
    const height = maxWidth / tempAspect;
    const angle = Math.atan(height/2 / this.camera.position.z);
    this.camera.fov = (angle * 180) / Math.PI * 2; // to deg
    
    this.camera.updateProjectionMatrix();
    
    this.resolutionWidth  = this.renderer.domElement.width;
    this.resolutionHeight = this.renderer.domElement.height;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.update();
  }

  update() {
    const minMaxX = Math.min(Math.max((this.mouse.x  / this.width  * 500), -0.4), 0.4);
    const minMaxY = Math.min(Math.max((-this.mouse.y / this.height * 200), -0.35), 0.35);
    
    this.scene.rotation.y += 0.05 * (minMaxX - this.scene.rotation.y);
    this.scene.rotation.x += 0.05 * (minMaxY - this.scene.rotation.x);

    this.raycaster.setFromCamera( this.mouse, this.camera );

    this.intersects = this.raycaster.intersectObjects( [this.raycasterPlane] );
    if (this.intersects[0]) {
      this.megaMouse.x = this.intersects[0].point.x;
      this.megaMouse.y = this.intersects[0].point.y;
      this.megaMouse.z = this.intersects[0].point.z;
    }
      
    this.renderer.render(this.scene, this.camera);

    this.particles.forEach(particle => {
      particle.move();
    })

    this.positionAttribute = new THREE.BufferAttribute( this.positionArr, 3 );
    this.geometry.setAttribute('position', this.positionAttribute);
    this.sizeAttribute = new THREE.BufferAttribute(this.sizeArr, 1);
    this.geometry.setAttribute('size', this.sizeAttribute);
  }
}

const sketch = new Sketch(document.getElementById('root'));
document.querySelector('.js-0').addEventListener('click', () => {sketch.updateSketch(0)})
document.querySelector('.js-1').addEventListener('click', () => {sketch.updateSketch(1)})
document.querySelector('.js-2').addEventListener('click', () => {sketch.updateSketch(2)})
document.querySelector('.js-3').addEventListener('click', () => {sketch.updateSketch(3)})