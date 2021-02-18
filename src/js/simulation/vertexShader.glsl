uniform float uPixelRatio;
uniform vec2 uResolution;

void main() {
  // vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  // gl_PointSize = uPixelRatio * (1.0 / - mvPosition.z);
  // gl_Position = projectionMatrix * mvPosition;
  vec3 p = position;
  p -= 0.5;
  p *= 2.;
   gl_Position = vec4( p, 1.0 );
}