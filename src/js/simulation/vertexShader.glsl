attribute float size;
uniform float uPixelRatio;
uniform vec2 uResolution;
uniform vec2 uMouse;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_PointSize =  ((800. * uPixelRatio) / -mvPosition.z) + min(size, 10.);
  gl_Position = projectionMatrix * mvPosition;					
}