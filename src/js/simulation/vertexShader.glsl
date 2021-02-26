attribute float size;
uniform float uPixelRatio;
uniform vec2 uResolution;
uniform vec2 uMouse;

void main() {
  // vec3 p = position;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
// gl_PointSize = max(2.0, min(10.0, aPosition.z));
  // gl_PointSize =  (1000. / -mvPosition.z) + min(size, 15.);
  gl_PointSize =  1000. * (1. / -mvPosition.z) + min(size, 15.);
  // gl_PointSize = max(2.0, min(10.0, size));
  // gl_PointSize = 2.;
  // gl_PointSize =  ((400. * uPixelRatio) / -mvPosition.z) + min(size, 15.);
  gl_Position = projectionMatrix * mvPosition;

  // gl_PointSize = max(2.0, min(10.0, size)) + 100. * (1. / -mvPosition.z);
					
}