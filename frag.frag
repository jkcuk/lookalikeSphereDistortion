precision highp float;

varying vec2 zPlaneCoord;
varying float aPositionZ;
uniform sampler2D cameraEnvironment;
uniform sampler2D cameraUser;
uniform float aspectRatioUser;
uniform float aspectRatioEnvironment;
uniform float tanHalfFovHU;
uniform float tanHalfFovVU;
uniform float tanHalfFovHE;
uniform float tanHalfFovVE;

void main() {
  if(aPositionZ < 0.0) {
    // environment-facing camera
    if((abs(zPlaneCoord.x) < tanHalfWiderFovEnvironment) && (abs(zPlaneCoord.y) < tanHalfWiderFovEnvironment/aspectRatioEnvironment)) {
      gl_FragColor = texture2D(cameraEnvironment, vec2(0.5-0.5*zPlaneCoord.x/tanHalfWiderFovEnvironment, 0.5-0.5*zPlaneCoord.y/tanHalfWiderFovEnvironment*aspectRatioEnvironment));
    } else {
      gl_FragColor = vec4(1.0);
    }
  } else {
    // user-facing camera
    if((abs(zPlaneCoord.x) < tanHalfFovHU) && (abs(zPlaneCoord.y) < tanHalfFovVU)) {
      gl_FragColor = texture2D(cameraUser, vec2(0.5+0.5*zPlaneCoord.x/tanHalfFovHU, 0.5+0.5*zPlaneCoord.y/tanHalfFovVU));
    } else {
      gl_FragColor = vec4(0.5);
    }
  }
}
