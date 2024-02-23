let theShader;
let speedtest=1.5;
let headingtest=50;
let PHI1=0;
let THETA1=180; 
// let cameraUser;
let cameraEnvironment;
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
let vxSlider;
let vySlider;
let vzSlider;
let fudgeFactorSlider;
let screenFOVSlider;
let ff;
let ff2;
let ff3;
let ff4;
let errorText;
let aspectRatio;
let fudgeFactor;
let screenFOV;

function preload() {
 theShader = loadShader('vert.vert', 'frag.frag');
}


function setup() {  
 
  createCanvas(windowWidth, windowHeight, WEBGL); 

  // ff = createP();
  // ff.position(10, 0);
  // ff.html(`V1.24`);

  vxSlider = createSlider(-1, 1, 0, 0);
  vxSlider.position(50, 50);
  vxSlider.size(500);
  ff2 = createP();
  ff2.position(10, 50-17);
  ff2.html(`&#946;<sub><i>x</i></sub> =`);
 
  vySlider = createSlider(-1, 1, 0, 0);
  vySlider.position(50, 100);
  vySlider.size(500);
  ff3 = createP();
  ff3.position(10,100-17);
  ff3.html(`&#946;<sub><i>y</i></sub> =`);
 
  vzSlider = createSlider(-1, 1, 0, 0);
  vzSlider.position(50, 150);
  vzSlider.size(500);
  ff4 = createP();
  ff4.position(10,150-17);
  ff4.html(`&#946;<sub><i>z</i></sub> =`);

  fudgeFactorSlider = createSlider(-2, 1, 0, 0);
  fudgeFactorSlider.position(50, windowHeight-100);
  fudgeFactorSlider.size(windowWidth-100);

  screenFOVSlider = createSlider(1, 150, 90, 0);
  screenFOVSlider.position(50, windowHeight-50);
  screenFOVSlider.size(windowWidth-100);

  errorText = createP();
  errorText.position(10, 0);


 
 // environment-facing camera
 let constraintsEnvironment = {
  video: {
   facingMode: {
    // exact: "user"
    ideal: "environment"
   },    
   width: { ideal: 8192 },
   height: { ideal: 8192 }
  }
 };
 cameraEnvironment = createCapture(constraintsEnvironment, done);
 cameraEnvironment.hide();

 // user-facing camera
 //let constraintsUser = {
 // video: {
 //  facingMode: {
 //   exact: "user"
 // },    
 //  width: { ideal: 8192 },
 //  height: { ideal: 8192 }
 // }
 //};
 //cameraUser = createCapture(constraintsUser);
 //cameraUser.hide();

 // console.log(cam.getTracks[0].getCapabilities());

  
      
    camera(0, 0, 0, 0, 0, -1, 0, 1, 0);
    noStroke();
  //geolocation
 
  
 perspective(90*PI/180, width/height, 0.01,50000);
  //perspective(40*PI/180, width/height, 0.001,500);
  //device orientation
 
 
}

function done(ms) {
  console.log('MediaStream: '+ms);
  console.log('tracks[0]: '+ms.getVideoTracks()[0]);
 console.log('capabilities: '+ms.getVideoTracks()[0].getCapabilities());

 console.log('facing mode: '+ms.getVideoTracks()[0].getCapabilities().facingMode);
//             facing mode: ${cameraEnvironment.getUserMedia().getTracks[0].getCapabilities().facingMode}
}

function draw() {
  //background(200); 
 angleMode(DEGREES);
  betax=vxSlider.value();
  betay=vySlider.value();
  betaz=vzSlider.value();
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

  aspectRatio=cameraEnvironment.width/cameraEnvironment.height;
  errorText.html(`width: ${cameraEnvironment.width} height: ${cameraEnvironment.height}`);

  theta=THETA1; 
  phi=PHI1;     

 if (beta2 >=1 ){
  const contentString = "Beta >= 1, setting it to 0.99";
  errorText.html(contentString.fontcolor("red")); 
  
  beta = 0.99; 
 } else{
  beta=sqrt(beta2);
 }
  gamma=1/Math.sqrt(1-beta2);
  
// distorted lookalike sphere
 fudgeFactor = Math.pow(10, fudgeFactorSlider.value());
 screenFOV = screenFOVSlider.value();
  rotateY(phi);
  rotateX(theta);
  scale(1/gamma, 1/gamma, 1);
  translate(0,0,radius*beta);
  rotateX(-theta);
  rotateY(-phi);
  theShader.setUniform('cameraEnvironment', cameraEnvironment);
  // theShader.setUniform('cameraUser', cameraUser);
  theShader.setUniform('aspectRatio', aspectRatio);
 theShader.setUniform('fudgeFactor', fudgeFactor);
  perspective(screenFOV*PI/180, width/height, 0.01,50000);

  resetShader();
  shader(theShader);
  sphere(radius, 200, 200);
// console.log(theta,phi);
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
