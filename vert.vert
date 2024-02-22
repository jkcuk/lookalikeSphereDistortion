precision highp float;

attribute vec3 aPosition;
attribute vec3 aNormal;  // not needed
attribute vec2 aTexCoord;  // not needed

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 zPlaneCoord;

void main() {
  zPlaneCoord = aPosition.xy / aPosition.z;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
}
