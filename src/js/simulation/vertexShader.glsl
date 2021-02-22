uniform float uPixelRatio;
uniform vec2 uResolution;

void main() {
  vec3 p = position;
  p -= 0.5;
  p *= 2.;

  // vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  // gl_PointSize = uPixelRatio * (1.0 / - mvPosition.z);
  // gl_Position = projectionMatrix * mvPosition;
  
  gl_PointSize = 2.;
  // gl_PointSize = max(2.0, min(10.0, p.z));
   gl_Position = vec4( p.x, p.y, p.z, 1.0 );
}