uniform float uPixelRatio;
uniform vec2 uResolution;

void main() {
  // vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  // gl_PointSize = uPixelRatio * (1.0 / - mvPosition.z);
  // gl_Position = projectionMatrix * mvPosition;
  vec3 p = position;
  p -= 0.5;
  p *= 2.;
  gl_PointSize = min(5.0, p.z);
  // gl_PointSize = max(2.0, min(10.0, p.z));
   gl_Position = vec4( p.x, p.y, 0.0, 1.0 );
}