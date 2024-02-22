precision highp float;

attribute vec3 aPosition;
// attribute vec3 aNormal;
// attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 zPlaneCoord;

void main() {
  // vTexCoord = aTexCoord;
  zPlaneCoord = aPosition.xy;  // / aPosition.z;  // TODO add this back in
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
}
