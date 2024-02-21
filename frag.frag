precision highp float;

#define PI 3.14159265358979323846

varying vec2 vTexCoord;
uniform sampler2D uTex;

void main() {
  float longitude = mix(-PI, PI, vTexCoord.x);
  float latitude = mix(-PI/2.0, PI/2.0, vTexCoord.y);
  float Yboard=atan(tan(PI/9.0)*cos(longitude));
  
if ((longitude >= -16.0*PI/81.0) && (longitude <= 16.0*PI/81.0)&& (latitude <= Yboard)&& (latitude >= -Yboard)) {

  float transfactlong=(longitude+(16.0*PI/81.0))/(32.0*PI/81.0);
  float transfactlat=(latitude+Yboard)/(2.0*Yboard);
  float aflong=mix(0.0,1.0,transfactlong);
  float aflat=mix(0.0,1.0,transfactlat);
  vec2 transjingwei=vec2(1.0-aflong,aflat);
  gl_FragColor = texture2D(uTex, transjingwei);
} else{
  gl_FragColor = vec4(1.0);
}

 
}