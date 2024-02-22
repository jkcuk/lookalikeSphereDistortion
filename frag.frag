precision highp float;

varying vec2 zPlaneCoord;
uniform sampler2D uTex;

void main() {
  float f=0.1;
  if((abs(zPlaneCoord.x) < f) && (abs(zPlaneCoord.y) < f)) {
    gl_FragColor = texture2D(uTex, vec2(0.5+0.5*zPlaneCoord.x/f, 0.5-0.5*zPlaneCoord.y/f));
  } else {
    gl_FragColor = vec4(1.0);
  }
}
