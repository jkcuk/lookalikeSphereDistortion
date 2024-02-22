precision highp float;

// #define PI 3.14159265358979323846

varying vec2 zPlaneCoord;
uniform sampler2D uTex;

void main() {
  let float radius=10.0;
  // float longitude = mix(-PI, PI, vTexCoord.x);
  // float latitude = mix(-PI/2.0, PI/2.0, vTexCoord.y);
  // float Yboard=atan(tan(PI/9.0)*cos(longitude));
  
  // if ((longitude >= -16.0*PI/81.0) && (longitude <= 16.0*PI/81.0)&& (latitude <= Yboard)&& (latitude >= -Yboard)) {
  if((Math.abs(zPlaneCoord.x) < 1) && (Math.abs(zPlaneCoord.y) < 1) {
    // float transfactlong=(longitude+(16.0*PI/81.0))/(32.0*PI/81.0);
    // float transfactlat=(latitude+Yboard)/(2.0*Yboard);
    // float aflong=mix(0.0,1.0,transfactlong);
    // float aflat=mix(0.0,1.0,transfactlat);
    // vec2 transjingwei=vec2(1.0-aflong,aflat);
    // gl_FragColor = texture2D(uTex, transjingwei);
    gl_FragColor = texture2D(uTex, vec2(0.5+0.5*zPlaneCoord.x/radius, 0.5+0.5*zPlaneCoord.y/radius));
  } else {
    gl_FragColor = vec4(1.0);
  }
}
