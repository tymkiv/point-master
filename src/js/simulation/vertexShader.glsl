uniform float uPixelRatio;
uniform vec2 uResolution;
uniform vec2 uMouse;

void main() {
  vec3 p = position;

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
 
  gl_PointSize =  ((700.) / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}