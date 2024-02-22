let theShader;
let speedtest=1.5;
let headingtest=50;
let PHI1=0;
let THETA1=180; 
let cam;
let VelC;
let betax;
let betay;
let betaz;
let phi=0;
let theta=0;
let radius=10;//200;
let beta;
let gamma;
let textureImg;
let motion = false;
let rvx;
let rvy;
let rvz;
let vxSlider;
let fudgeFactorSlider;
let ff;
let ff2;
let ff3;
let ff4;
let errorText;
let aspectRatio;
let fudgeFactor;

function preload() {
 theShader = loadShader('vert.vert', 'frag.frag');
  let constraints = {
  video: {
    facingMode: {
     // exact: "user"
     exact: "environment"
    },
    width: { exact: 1280 },
    height: { exact: 720 }
  }
};
  // cam = createCapture(constraints, (stream) => {
  // 
  // });
  cam = createCapture(constraints);
  // alert(`width: ${cam.width} height: ${cam.height}`);
  cam.hide();
}


function setup() {  
 
  createCanvas(windowWidth, windowHeight, WEBGL); 

  ff = createP();
  ff.position(0,0);
  ff.html(`V1.24`);

  vxSlider = createSlider(-1, 1, 0, 0);
  vxSlider.position(50, 20);
  vxSlider.size(500);
  rvx = createInput('0.0','double');
  rvx.position(50, 67);
  ff2 = createP();
  ff2.position(10,50);
  ff2.html(`Vx/c:`);
 
  rvy = createInput('0.0','double');
  rvy.position(50, 90);
  ff3 = createP();
  ff3.position(10,75);
  ff3.html(`Vy/c:`);
 
  rvz = createInput('0.0','double');
  rvz.position(50, 116);
  ff4 = createP();
  ff4.position(10,100);
  ff4.html(`Vz/c:`);

  fudgeFactorSlider = createSlider(-3, 1, 0, 0);
  fudgeFactorSlider.position(50, windowHeight+20);
  fudgeFactorSlider.size(windowWidth-100);


  errorText = createP();
  errorText.position(400,30);


  
      
    camera(0, 0, 0, 0, 0, -1, 0, 1, 0);
    noStroke();
  //geolocation
 
  
 perspective(60*PI/180, width/height, 0.01,50000);
  //perspective(40*PI/180, width/height, 0.001,500);
  //device orientation
 
 
}

function draw() {
  //background(200); 
 angleMode(DEGREES);
  betax=vxSlider.value();
  betay=rvy.value();
  betaz=rvz.value();
 let beta2=betax*betax+betay*betay+betaz*betaz;

  angleMode(RADIANS);
  //transform to theta and phi
  beta=sqrt(beta2);
  if (beta===0){
    THETA1=0
    PH1=0;
  }else{
    THETA1=asin(-betay/beta);
   PHI1=PI+atan2(-betax,-betaz);
  }

  aspectRatio=cam.width/cam.height;
  errorText.html(`width: ${cam.width} height: ${cam.height}`);

  theta=THETA1; 
  phi=PHI1;     

 if (beta2 >=1 ){
  const contentString = "Beta is >= 1! normalising it to 0.99";
  errorText.html(contentString.fontcolor("red")); 
  
  beta = 0.99; 
 } else{
  beta=sqrt(beta2);
 }
  gamma=1/Math.sqrt(1-beta2);
  
// distorted lookalike sphere
 fudgeFactor = Math.pow(10, fudgeFactorSlider.value());
  rotateY(phi);
  rotateX(theta);
  scale(1/gamma, 1/gamma, 1);
  translate(0,0,radius*beta);
  rotateX(-theta);
  rotateY(-phi);
  theShader.setUniform('uTex', cam);
  theShader.setUniform('aspectRatio', aspectRatio);
 theShader.setUniform('fudgeFactor', fudgeFactor);
  resetShader();
  shader(theShader);
  sphere(radius,500);
console.log(theta,phi);
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
