attribute float size;
uniform float uPixelRatio;
uniform vec2 uResolution;
uniform vec2 uMouse;

void main() {
  // vec3 p = position;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
// gl_PointSize = max(2.0, min(10.0, aPosition.z));
  gl_PointSize =  ((700.) / -mvPosition.z) + min(size, 10.);
  gl_Position = projectionMatrix * mvPosition;
}