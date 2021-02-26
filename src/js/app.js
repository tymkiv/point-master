import * as THREE from 'three';

import Particle from './Particle';
import vertexShader from './simulation/vertexShader.glsl';
import fragmentShader from './simulation/fragmentShader.glsl';

const OrbitControls = require('three-orbit-controls')(THREE)

class Sketch {
  constructor(container) {
    this.container = container;

    this.config();
    this.init();
    this.updateSize();

    this.isStarted = false;
    this.mouse = {x: 0, y: 0};
    this.megaMouse = {x: -1000, y: -1000, z: 0}
    this.particles = [];
    
    this.data = []; // main data 

    this.loadImages(this.imageInfo.map(info => info.path), (imgs) => {
      imgs.forEach((img, index) => {
        const {coords, width, height} = this.getFilledCoordsFromImg(
          img, 
          this.imageInfo[index].particleSize
        ) 
        this.data.push({img, coords, width, height})
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
    this.maxZcoord = 150;

    this.imageInfo = [
      {
        path: 'img/1.png',
        particleSize: 2,
      },
      {
        path: 'img/2.png',
        particleSize: 2,
      },
      {
        path: 'img/b.png',
        particleSize: 2,
      },
      {
        path: 'img/super.png',
        particleSize: 2,
      },
    ]
  }

  init() {
    this.scene     = new THREE.Scene();
    this.renderer  = new THREE.WebGLRenderer();
    this.camera    = new THREE.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.001, 10000);
    this.raycaster = new THREE.Raycaster();
    // this.controls  = new OrbitControls(this.camera, this.renderer.domElement);
    
    this.camera.position.set(0, 0, 600);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.raycasterPlane = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000), new THREE.MeshBasicMaterial({color: new THREE.Color(1,1,1), opacity: 0, transparent: true, side: THREE.DoubleSide }))
    this.scene.add(this.raycasterPlane);

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

          naturalWidth:  this.data[indexOfData].width,
          naturalHeight: this.data[indexOfData].height,
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
        naturalWidth:  this.data[indexOfData].width,
        naturalHeight: this.data[indexOfData].height,
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
            x: i * particleSize / width, 
            y: j * particleSize / height 
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

    this.particles.forEach(particle => {
      particle.resize(this.width, this.height);
    })
    
    this.material.uniforms.uResolution.value.x = this.resolutionWidth;
    this.material.uniforms.uResolution.value.y = this.resolutionHeight;
  }

  updateSize() {
    this.width  = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
    this.resolutionWidth  = this.renderer.domElement.width;
    this.resolutionHeight = this.renderer.domElement.height;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.update();
  }

  update() {
    this.camera.position.x += 0.05 * (this.mouse.x*this.width/20 - this.camera.position.x);
    this.camera.position.y += 0.05 * (this.mouse.y*this.height/20 - this.camera.position.y);

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