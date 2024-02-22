precision highp float;

varying vec2 zPlaneCoord;
uniform sampler2D uTex;

void main() {
  // float radius=10.0;
  if((abs(zPlaneCoord.x) < 1.0) && (abs(zPlaneCoord.y) < 1.0)) {
    gl_FragColor = texture2D(uTex, vec2(0.5+0.5*zPlaneCoord.x, 0.5+0.5*zPlaneCoord.y));
  } else {
    gl_FragColor = vec4(1.0);
  }
}
