let theShader;
//let speedtest=1.5;
//let headingtest=50;
let PHI1=0;
let THETA1=180; 
let cameraUser;
let cameraEnvironment;
let videoStreams = [];
//let VelC;
let betax;
let betay;
let betaz;
let phi=0;
let theta=0;
// let radius=10;//200;
let beta;
let gamma;
//let textureImg;
//let motion = false;
let vxSlider;
let vySlider;
let vzSlider;
let fudgeFactorSlider;
let screenFOVSlider;
//let ff;
//let ff2;
//let ff3;
//let ff4;
let errorText;
let aspectRatioUser, aspectRatioEnvironment;
let fudgeFactor;
let screenFOV;
let tofOnlyCheckbox;

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
 
  vzSlider = createSlider(-1, 1, 0.25, 0);
  vzSlider.position(50, 150);
  vzSlider.size(500);
  ff4 = createP();
  ff4.position(10,150-17);
  ff4.html(`&#946;<sub><i>z</i></sub> =`);

  fudgeFactorSlider = createSlider(-2, 1, 1, 0);
  fudgeFactorSlider.position(50, windowHeight-100);
  fudgeFactorSlider.size(windowWidth-100);

  screenFOVSlider = createSlider(1, 150, 150, 0);
  screenFOVSlider.position(50, windowHeight-50);
  screenFOVSlider.size(windowWidth-100);

  errorText = createP();
  errorText.position(10, 0);

 let button = createButton('set user camera FOV');
  button.position(50, windowHeight-100);

  // Use the button to change the background color.
  button.mousePressed(() => {
    var fovString = prompt("User camera FOV (°):", "10");
    var fov = float(fovString);
    if(!isNaN(fov)) fudgeFactorSlider.setValue(0);
  });

 tofOnlyCheckbox = createCheckbox();
  tofOnlyCheckbox.position(50, 200);
 
 // user-facing camera
 let constraintsUser = {
  video: {
   facingMode: {
    ideal: "user"
  },    
   width: { ideal: 4096 },
   height: { ideal: 3072 }
  }
 };
 cameraUser = createCapture(constraintsUser);
 cameraUser.hide();

  // environment-facing camera
 let constraintsEnvironment = {
  video: {
   facingMode: {
    // exact: "environment"
    ideal: "environment"
   },    
   width: { ideal: 4096 },
   height: { ideal: 3072 }
  }
 };
 cameraEnvironment = createCapture(constraintsEnvironment, done);
 cameraEnvironment.hide();


 // console.log(cam.getTracks[0].getCapabilities());

 /*
  // Enumerate and create video capture for all available cameras
  let devices = navigator.mediaDevices.enumerateDevices();
  devices.then(gotDevices);
 */
      
    camera(0, 0, 0, 0, 0, -1, 0, 1, 0);
    noStroke();
  //geolocation
 
  
 perspective(90*PI/180, width/height, 0.01,50000);
  //perspective(40*PI/180, width/height, 0.001,500);
  //device orientation
 
 
}

function gotDevices(deviceInfos) {
  for (let deviceInfo of deviceInfos) {
    if (deviceInfo.kind === 'videoinput') {
      let constraints = {
        video: {
          deviceId: deviceInfo.deviceId,
          width: { ideal: 6400 }, // full resolution
          height: { ideal: 4800 } // full resolution
        }
      };
      let videoStream = createCapture(constraints);
      videoStream.hide();
      videoStreams.push(videoStream);
    }
  }

 // we can deal with a user-facing camera and an environment-facing camera

 alert('video streams: '+videoStreams.length);
 
 // do we have more than one camera?
 if(videoStreams.length == 1)
 {
  // there is only one camera; assume it's user-facing
  cameraUser = videoStreams[0];
  cameraEnvironment = videoStreams[0]; // TODO for the moment, set it to the user camera
 } else {
  // assume the camera with the higher resolution is the environment-facing camera
  if(videoStreams[0].width*videoStreams[0].height > videoStreams[1].width*videoStreams[1].height)
  {
   // videoStreams[0] is from the environment-facing camera
   cameraEnvironment = videoStreams[0];
   cameraUser = videoStreams[1];
  } else {
   // videoStreams[1] is from the environment-facing camera
   cameraEnvironment = videoStreams[1];
   cameraUser = videoStreams[0];
  }
 }
}

function done(ms) {
  console.log('MediaStream: '+ms);
  console.log('tracks[0]: '+ms.getVideoTracks()[0]);
 console.log('capabilities: '+ms.getVideoTracks()[0].getCapabilities());

 console.log('facing mode: '+ms.getVideoTracks()[0].getCapabilities().facingMode);
//             facing mode: ${cameraEnvironment.getUserMedia().getTracks[0].getCapabilities().facingMode}
}

function draw() {
   background(0);

  //background(200); 
 angleMode(DEGREES);
  betax=vxSlider.value();
  betay=vySlider.value();
  betaz=vzSlider.value();
 let beta2=betax*betax+betay*betay+betaz*betaz;

  if (beta2 >=1 ){
  const contentString = "Beta >= 1, setting it to 0.99";
  errorText.html(contentString.fontcolor("red")); 
  
  beta = 0.99; 
 } else{
  beta=sqrt(beta2);
 }
  gamma=1/Math.sqrt(1-beta2);
  

  angleMode(RADIANS);
  //transform to theta and phi
  if (beta===0){
    THETA1=0
    PH1=0;
  }else{
    THETA1=asin(-betay/beta);
   PHI1=PI+atan2(-betax,betaz);
  }

  if(cameraUser) aspectRatioUser=cameraUser.width/cameraUser.height;
  if(cameraEnvironment) aspectRatioEnvironment=cameraEnvironment.width/cameraEnvironment.height;
  errorText.html(`environment camera: ${cameraEnvironment.width} x ${cameraEnvironment.height}, user camera: ${cameraUser.width} x ${cameraUser.height}`);

  theta=THETA1; 
  phi=PHI1;     

// distorted lookalike sphere
 fudgeFactor = Math.pow(10, fudgeFactorSlider.value());
 screenFOV = screenFOVSlider.value();
  rotateY(phi);
  rotateX(theta);
  if(tofOnlyCheckbox.checked()) scale(1/gamma, 1/gamma, 1);
  translate(0,0,beta); // radius*beta);
  rotateX(-theta);
  rotateY(-phi);
  theShader.setUniform('cameraEnvironment', cameraEnvironment);
  theShader.setUniform('cameraUser', cameraUser);
  theShader.setUniform('aspectRatioUser', aspectRatioUser);
  theShader.setUniform('aspectRatioEnvironment', aspectRatioEnvironment);
 theShader.setUniform('fudgeFactor', fudgeFactor);
  perspective(screenFOV*PI/180, width/height, 0.01,50000);

  resetShader();
  shader(theShader);
  sphere(1 /* radius */, 200, 200);
// console.log(theta,phi);
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
