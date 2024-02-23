precision highp float;

varying vec3 zPlaneCoord;
uniform sampler2D uTex;
uniform float aspectRatio;
uniform float fudgeFactor;

void main() {
  if(zPlaneCoord.z > 0.0) {
    // environment-facing camera
    if((abs(zPlaneCoord.x) < fudgeFactor*aspectRatio) && (abs(zPlaneCoord.y) < fudgeFactor)) {
      gl_FragColor = texture2D(uTex, vec2(0.5-0.5*zPlaneCoord.x/(fudgeFactor*aspectRatio), 0.5-0.5*zPlaneCoord.y/fudgeFactor));
    } 
  } else {
    gl_FragColor = vec4(1.0);
  }
}
