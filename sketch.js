let theShader;

// the cameras
let cameraUser;
let cameraEnvironment;

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

let betaxSlider;
let betaySlider;
let betazSlider;
let cameraFOVSlider;
let screenFOVSlider;
let status;
let aspectRatioUser, aspectRatioEnvironment;
let fudgeFactor;
let screenFOV;
let tofOnlyCheckbox, highResolutionCheckbox;

function preload() {
 theShader = loadShader('vert.vert', 'frag.frag');
}


function setup() {  
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

  cameraFOVSlider = createSlider(10, 150, 90, 0);
  cameraFOVSlider.position(50, windowHeight-100);
  cameraFOVSlider.size(windowWidth-100);

  screenFOVSlider = createSlider(1, 150, 90, 0);
  screenFOVSlider.position(50, windowHeight-50);
  screenFOVSlider.size(windowWidth-100);

  status = createP();
  status.position(10, 0);

  let button = createButton('set user camera FOV');
  button.position(50, windowHeight-100);

  // Use the button to change the background color.
  button.mousePressed(() => {
    var fovString = prompt("User camera FOV (°):", String(cameraFOVSlider.value().toFixed(2)));
    var fov = float(fovString);
    if(!isNaN(fov)) cameraFOVSlider.value(fov);
  });

  tofOnlyCheckbox = createCheckbox();
  tofOnlyCheckbox.position(50, 200);

  highResolutionCheckbox = createCheckbox();
  highResolutionCheckbox.position(80, 200);
  
  //var checkbox = document.querySelector("input[name=checkbox]");
  //checkbox.position(110, 200);

  highResolutionCheckbox.mouseClicked(createVideoStreams);

  createVideoStreams();
 
  camera(0, 0, 0, 0, 0, -1, 0, 1, 0);
  noStroke();
  
  perspective(90*PI/180, width/height, 0.01,50000);
}

function createVideoStreams() {
  let idealWidth, idealHeight;
  if(highResolutionCheckbox.checked()) {
    idealWidth = 4096;
    idealHeight = 3072;
  } else {
    idealWidth = 1024;
    idealHeight =768;
  }
  
  // user-facing camera
  let constraintsUser = {
    video: {
      facingMode: {
      ideal: "user"
    },    
    width: { ideal: idealWidth },
    height: { ideal: idealHeight }
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
      width: { ideal: idealWidth },
      height: { ideal: idealHeight }
    }
  };
  cameraEnvironment = createCapture(constraintsEnvironment);
  cameraEnvironment.hide();
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

  if(cameraUser) aspectRatioUser=cameraUser.width/cameraUser.height;
  if(cameraEnvironment) aspectRatioEnvironment=cameraEnvironment.width/cameraEnvironment.height;
  status.html(`v1.1 environment camera: ${cameraEnvironment.width}x${cameraEnvironment.height}, user camera: ${cameraUser.width}x${cameraUser.height}, beta: (`+String(betax.toFixed(2))+`, `+String(betay.toFixed(2))+`, `+String(betaz.toFixed(2))+`)`);

  // distorted lookalike sphere
  fudgeFactor = Math.tan(0.5*Math.PI/180.0*cameraFOVSlider.value());
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
  if(highResolutionCheckbox.checked()) sphere(1, 200, 200);
  else sphere(1, 50, 50);
  // console.log(theta,phi);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
