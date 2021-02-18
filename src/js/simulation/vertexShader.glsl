uniform float uPixelRatio;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_PointSize = uPixelRatio * (1.0 / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}