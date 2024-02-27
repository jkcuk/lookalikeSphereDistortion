let theShader;

// the cameras
let cameraU, cameraE; // user-facing / environment-facing camera

// components of beta...
let betax;
let betay;
let betaz;
// ... and beta and gamma, calculated from them
let beta;
let gamma;

// direction of beta
let phi=0;
let theta=0;

// (Euler) rotation of the view
let alphaE = 0.0, betaE = 0.0, gammaE = 0.0;
// let thetaView = 0.0, phiView = 0.0, thetaView0, phiView0;


let betaxSlider;
let betaySlider;
let betazSlider;
let status;
let aspectRatioU, aspectRatioE; // aspect ratio (= width / height) for user-facing / environment-facing camera
let tanHalfFovHU, tanHalfFovVU; // tan(0.5*FOV_horizontal), tan(0.5*FOV_vertical) for user-facing camera
let tanHalfFovHE, tanHalfFovVE; // tan(0.5*FOV_horizontal), tan(0.5*FOV_vertical) for environment-facing camera
let tofOnlyCheckbox, highResolutionCheckbox, outsideViewCheckbox;

// FOV of cameras / screen
let fovU = 66; // FOV (larger angle) of user-facing camera
let fovE = 90; // FOV of environment-facing camera
let fovS = 90; // FOV of screen

// UI
let viewSelect; // dropdown menu for view (inside lookalike sphere / outside lookalike sphere)

function preload() {
 theShader = loadShader('vert.vert', 'frag.frag');
}


function setup() {  
  screen.addEventListener("orientationchange", createVideoStreams);
  /*
  screen.addEventListener("orientationchange", () => {
    console.log(`The orientation of the screen is: ${screen.orientation}`);
  });
  */

  createCanvas(windowWidth, windowHeight, WEBGL); 

  betaxSlider = createSlider(-1, 1, 0, 0);
  betaxSlider.position(50, 50);
  betaxSlider.size(500);
  ff2 = createP();
  ff2.position(10, 50-17);
  ff2.html(`&#946;<sub><i>x</i></sub> =`);
 
  betaySlider = createSlider(-1, 1, 0, 0);
  betaySlider.position(50, 100);
  betaySlider.size(500);
  ff3 = createP();
  ff3.position(10,100-17);
  ff3.html(`&#946;<sub><i>y</i></sub> =`);
 
  betazSlider = createSlider(-1, 1, 0.25, 0);
  betazSlider.position(50, 150);
  betazSlider.size(500);
  ff4 = createP();
  ff4.position(10,150-17);
  ff4.html(`&#946;<sub><i>z</i></sub> =`);

  viewSelect = createSelect();
  viewSelect.position(0, 100);
  viewSelect.option('inside (distorted) lookalike sphere', 'inside');
  viewSelect.option('outside (distorted) lookalike sphere', 'outside');
  viewSelect.selected('inside (distorted) lookalike sphere');


  let x=10;
  let y=windowHeight-40;

  let fovUButton = createButton(`User-facing camera FOV 000.00°`);
  fovUButton.position(x, y);
  fovUButton.mousePressed(() => {
    var fovString = prompt("User-facing camera FOV (°):", String(fovU.toFixed(2)));
    var fov = float(fovString);
    if(!isNaN(fov)) 
    {
      fovU = fov;
      fovUButton.html(`User-facing camera FOV `+String(fovU.toFixed(2))+`°`);  // set to actual string
    }
  });
  x += fovUButton.size().width;
  fovUButton.html(`User-facing camera FOV `+String(fovU.toFixed(2))+`°`);

  let fovEButton = createButton(`Environment-facing camera FOV 000.00°`);
  fovEButton.position(x, y);
  fovEButton.mousePressed(() => {
    var fovString = prompt("Environment-facing camera FOV (°):", String(fovE.toFixed(2)));
    var fov = float(fovString);
    if(!isNaN(fov)) 
    {
      fovE = fov;
      fovEButton.html(`Environment-facing camera FOV `+String(fovE.toFixed(2))+`°`);  // set to actual string
    }
  });
  x += fovEButton.size().width;
  fovEButton.html(`Environment-facing camera FOV `+String(fovE.toFixed(2))+`°`);

  let fovSButton = createButton(`Screen FOV 000.00°`);
  fovSButton.position(x, y);
  fovSButton.mousePressed(() => {
    var fovString = prompt("Screen FOV (°):", String(fovS.toFixed(2)));
    var fov = float(fovString);
    if(!isNaN(fov)) 
    {
      fovS = fov;
      fovSButton.html(`Screen FOV `+String(fovS.toFixed(2))+`°`);  // set to actual string
    }
  });
  x += fovSButton.size().width;
  fovSButton.html(`Screen FOV `+String(fovS.toFixed(2))+`°`);


  status = createP();
  status.position(10, 0);

  tofOnlyCheckbox = createCheckbox();
  tofOnlyCheckbox.position(50, 200);

  highResolutionCheckbox = createCheckbox();
  highResolutionCheckbox.position(80, 200);

  outsideViewCheckbox = createCheckbox();
  outsideViewCheckbox.position(110, 200);

  //var checkbox = document.querySelector("input[name=checkbox]");
  //checkbox.position(110, 200);

  highResolutionCheckbox.mouseClicked(createVideoStreams);

  createVideoStreams();
 
  camera(0, 0, 0, 0, 0, -1, 0, 1, 0);
  noStroke();
  
  perspective(90*PI/180, width/height, 0.01,50000);
}

/** run this whenever the resolution or screen orientation changes */
function createVideoStreams() {
  console.log("createVideoStreams()");
  let idealWidth, idealHeight;
  if(highResolutionCheckbox.checked()) {
    idealWidth = 4096;
    // idealHeight = 4096; // 3072;
  } else {
    idealWidth = 1024;
    // idealHeight = 1024; // 768;
  }
  
  // user-facing camera
  let constraintsU = {
    video: {
      facingMode: {
      ideal: "user"
    },    
    width: { ideal: idealWidth },
    height: { ideal: idealHeight }
  }
 };
 cameraU = createCapture(constraintsU);
 cameraU.hide();

  // environment-facing camera
  let constraintsE = {
    video: {
      facingMode: {
        // exact: "environment"
        ideal: "environment"
      },    
      width: { ideal: idealWidth },
      height: { ideal: idealHeight }
    }
  };
  cameraE = createCapture(constraintsE);
  cameraE.hide();
}

function draw() {
   background(0);

  // angleMode(DEGREES);
  betax=betaxSlider.value();
  betay=betaySlider.value();
  betaz=betazSlider.value();
  let beta2=betax*betax+betay*betay+betaz*betaz;

  if (beta2 >=1 ){
    beta0 = sqrt(beta2);
    beta = 0.99; 
    betax *= beta/beta0;
    betay *= beta/beta0;
    betaz *= beta/beta0;

    console.log(`Beta >= 1, scaling it to 0.99 (beta = (${betax}, ${betay}, ${betaz}))`);
    // const contentString = "Beta >= 1, scaling it to 0.99 (beta = (${betax}, ${betay}, ${betaz}))";
    // status.html(contentString.fontcolor("red")); 
  } else{
    beta=sqrt(beta2);
  }
  gamma=1/Math.sqrt(1-beta2);
  
  angleMode(RADIANS);
  //transform to theta and phi
  if (beta===0){
    theta=0
    phi=0;
  } else {
    theta=asin(-betay/beta);
    phi=PI+atan2(-betax,betaz);
  }

  aspectRatioU = cameraU.width/cameraU.height;
  aspectRatioE = cameraE.width/cameraE.height;
  status.html(`v1.3 environment camera: ${cameraE.width}x${cameraE.height}, user camera: ${cameraU.width}x${cameraU.height}, beta: (`+String(betax.toFixed(2))+`, `+String(betay.toFixed(2))+`, `+String(betaz.toFixed(2))+`)`);

  let tanHalfWiderFovU = Math.tan(0.5*Math.PI/180.0*fovU);
  if(aspectRatioU > 1.0) {
    // the horizontal FOV is wider
    tanHalfFovHU = tanHalfWiderFovU;
    tanHalfFovVU = tanHalfWiderFovU / aspectRatioU;
  } else {
    // the vertical FOV is wider
    tanHalfFovVU = tanHalfWiderFovU;
    tanHalfFovHU = tanHalfWiderFovU * aspectRatioU;
  }
  
  let tanHalfWiderFovE = Math.tan(0.5*Math.PI/180.0*fovE);
  if(aspectRatioE > 1.0) {
    // the horizontal FOV is wider
    tanHalfFovHE = tanHalfWiderFovE;
    tanHalfFovVE = tanHalfWiderFovE / aspectRatioE;
  } else {
    // the vertical FOV is wider
    tanHalfFovVE = tanHalfWiderFovE;
    tanHalfFovHE = tanHalfWiderFovE * aspectRatioE;
  }
  
  // distorted lookalike sphere
  // if(outsideViewCheckbox.checked()) {
  // if(outsideViewCheckbox.checked()) 
  if(viewSelect.selected() === `outside`) translate(0, 0, -2);
    // rotateY(mouseX/100);
    // rotateX(mouseY/100);
    rotateX(gammaE);
    rotateY(betaE);
    rotateX(alphaE);
    // rotateY(phiView);
    // rotateX(thetaView);  
  // } else {
  // }
 
  rotateY(phi);
  rotateX(theta);
  if(tofOnlyCheckbox.checked()) scale(1/gamma, 1/gamma, 1);
  translate(0,0,beta); // radius*beta);
  rotateX(-theta);
  rotateY(-phi);
  theShader.setUniform('cameraE', cameraE);
  theShader.setUniform('cameraU', cameraU);
  theShader.setUniform('tanHalfFovHU', tanHalfFovHU);
  theShader.setUniform('tanHalfFovVU', tanHalfFovVU);
  theShader.setUniform('tanHalfFovHE', tanHalfFovHE);
  theShader.setUniform('tanHalfFovVE', tanHalfFovVE);
  perspective(fovS*PI/180.0, width/height, 0.01, 10);

  resetShader();
  shader(theShader);
  if(highResolutionCheckbox.checked()) sphere(1, 200, 200);
  else sphere(1, 50, 50);
  // console.log(theta,phi);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let touchX, touchY;
let touch;
let alphaE0, betaE0, gammaE0;
// let xHat, yHat;
function touchStarted() {
  touch = true;
  touchX = mouseX;
  touchY = mouseY;
  // thetaView0 = thetaView;
  // phiView0 = phiView;
  alphaE0 = alphaE;
  betaE0 = betaE;
  gammaE0 = gammaE;
  // let s = sin(thetaView0);
  // xHat = createVector(s*cos(phiView0), s*sin(phiView0),cos(thetaView0));
}
function touchEnded() {
  touch = false;
}
function touchMoved() {
  if(touch) {
    let dx = mouseX - touchX;
    let dy = mouseY - touchY;
    
    alphaE = alphaE0 - dy*Math.PI/180.0;
    betaE = betaE0 + dx*Math.PI/180.0;
    // console.log("thetaView, phiView = "+thetaView+", "+phiView);
  }
}