precision highp float;

varying vec2 zPlaneCoord;
varying float aPositionZ;
uniform sampler2D cameraEnvironment;
uniform sampler2D cameraUser;
uniform float aspectRatioUser;
uniform float aspectRatioEnvironment;
uniform float horizontalFovUser;
uniform float horizontalFovEnvironment;

void main() {
  if(aPositionZ < 0.0) {
    // environment-facing camera
    if((abs(zPlaneCoord.x) < horizontalFovEnvironment) && (abs(zPlaneCoord.y) < horizontalFovEnvironment/aspectRatioEnvironment)) {
      gl_FragColor = texture2D(cameraEnvironment, vec2(0.5-0.5*zPlaneCoord.x/horizontalFovEnvironment, 0.5-0.5*zPlaneCoord.y/horizontalFovEnvironment*aspectRatioEnvironment));
    } else {
      gl_FragColor = vec4(1.0);
    }
  } else {
    // user-facing camera
    if((abs(zPlaneCoord.x) < fudgeFactor*aspectRatioUser) && (abs(zPlaneCoord.y) < fudgeFactor)) {
      gl_FragColor = texture2D(cameraUser, vec2(0.5+0.5*zPlaneCoord.x/(fudgeFactor*aspectRatioUser), 0.5+0.5*zPlaneCoord.y/fudgeFactor));
    } else {
      gl_FragColor = vec4(0.5);
    }
  }
}
