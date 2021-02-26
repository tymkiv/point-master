precision highp float;
uniform sampler2D dotTexture;

void main() {
    vec2 pc = 2.0 * gl_PointCoord - 1.0;
    // vec4 color = texture2D(dotTexture, gl_PointCoord);
    // vec4 color1 = vec4(0.6, 0.6, 0.6, 1.0);
    // gl_FragColor = color1 * color;
    gl_FragColor =  vec4(0.8, 0.8, 0.8, 1.0 - dot(pc, pc));
}