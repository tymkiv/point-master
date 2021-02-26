precision highp float;
void main() {
    vec2 pc = 2.0 * gl_PointCoord - 1.0;
    gl_FragColor = vec4(0.6, 0.6, 0.6, 1.0 - dot(pc, pc));
}