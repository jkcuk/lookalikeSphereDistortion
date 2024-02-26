precision highp float;

varying vec2 zPlaneCoord;
varying float aPositionZ;
uniform sampler2D cameraE;
uniform sampler2D cameraU;
uniform float tanHalfFovHU;
uniform float tanHalfFovVU;
uniform float tanHalfFovHE;
uniform float tanHalfFovVE;

void main() {
  if(aPositionZ < 0.0) {
    // environment-facing camera
    if((abs(zPlaneCoord.x) < tanHalfFovHE) && (abs(zPlaneCoord.y) < tanHalfFovVE)) {
      gl_FragColor = texture2D(cameraE, vec2(0.5-0.5*zPlaneCoord.x/tanHalfFovHE, 0.5-0.5*zPlaneCoord.y/tanHalfFovVE));
    } else {
      gl_FragColor = vec4(1.0);
    }
  } else {
    // user-facing camera
    if((abs(zPlaneCoord.x) < tanHalfFovHU) && (abs(zPlaneCoord.y) < tanHalfFovVU)) {
      gl_FragColor = texture2D(cameraU, vec2(0.5+0.5*zPlaneCoord.x/tanHalfFovHU, 0.5+0.5*zPlaneCoord.y/tanHalfFovVU));
    } else {
      gl_FragColor = vec4(0.5);
    }
  }
}
