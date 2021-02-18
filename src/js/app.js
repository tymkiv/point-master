import * as THREE from 'three';
import gsap from 'gsap';

import Particle from './Particle';
import vertexShader from './simulation/vertexShader.glsl';
import fragmentShader from './simulation/fragmentShader.glsl';

const OrbitControls = require('three-orbit-controls')(THREE)

class Sketch {
  constructor(container) {
    this.container = container;

    this.init();

    // Do something
    this.raycaster = new THREE.Raycaster();
    this.mMouse = new THREE.Vector2();  
    this.countX = 100; // width
    this.countY = 100; // height
    this.mouse = {};
    this.particles = [];
    this.geometry = new THREE.BufferGeometry();

    this.cubeArr = new Float32Array(this.countX * this.countY * 3);

    for (let i = 0; i < this.countX * this.countY; i += 1) {
      this.particles.push(new Particle({
        x: Math.random() * this.container.clientWidth,
        y: Math.random() * this.container.clientHeight,
        z: 0,
        floatArr: this.cubeArr,
        index: i,
        mouse: this.mouse,
        width: this.container.clientWidth,
        height: this.container.clientHeight,
      }));
    }

    this.cubeAttr = new THREE.BufferAttribute( this.cubeArr, 3 );

    this.geometry.setAttribute('position', this.cubeAttr);

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

    // this.points.position.x -= 3;
    // this.points.position.y -= 2;
    
    // End of something
    
    this.onWindowResize();
    this.animate();
  }

  init() {
    this.camera = new THREE.PerspectiveCamera(
    70,
    this.container.clientWidth / this.container.clientHeight,
    0.001, 100
    );
    // this.camera = new THREE.OrthographicCamera( 100 / - 2, 100 / 2, 100 / 2, 100 / - 2, 1, 1000 )
    this.camera.position.set(0, 0, 1);

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );

    this.container.appendChild( this.renderer.domElement );

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener('resize', this.onWindowResize.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.update();
  }

  update() {
    this.renderer.render(this.scene, this.camera);

    this.particles.forEach(particle => {
      particle.update();
    })

    this.cubeAttr = new THREE.BufferAttribute( this.cubeArr, 3 );

    this.geometry.setAttribute('position', this.cubeAttr);
  }

  onMouseMove(e) {
    this.mouse.x = e.pageX;
    this.mouse.y = e.pageY;
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