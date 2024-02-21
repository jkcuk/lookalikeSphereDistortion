let theShader;
// let speedtest=1.5;
// let headingtest=50;
let PHI1=0;
let THETA1=180; 
let cam;
let VelC;
let betax;
let betay;
let betaz;
let phi=0;
let theta=0;
let radius=10;//200; // radius of the lookalike sphere
let beta;
let gamma;
let textureImg;
// let motion = false;
let vxInput;
let vyInput;
let vzInput;
let errorLabel;

function preload() {
 theShader = loadShader('vert.vert', 'frag.frag');
  let constraints = {
  video: {
    facingMode: {
      exact: "environment"
    },
    width: { exact: 1280 },
    height: { exact: 720 }
    // height: { exact: 1280 },
    // width: { exact: 720 }
  }
};
  cam = createCapture(constraints, (stream) => {
   
  });
  cam.hide();
}


function setup() {  
 
  createCanvas(windowWidth, windowHeight, WEBGL); 

  let versionLabel = createP(`V1.27`);
  versionLabel.position(0,0);
  // versionLabel.html(`V1.26`);

  vxInput = createInput(0.0,'double');
  vxInput.position(50, 67);
  let vxLabel = createP(`<i>v</i><sub><i>x</i></sub>/<i>c</i> =`);
  vxLabel.position(10,50);
  // vxLabel.html(`<i>v</i><sub><i>x</i></sub>/<i>c</i> =`);
 
  vyInput = createInput(0.0,'double');
  vyInput.position(50, 90);
  let vyLabel = createP(`<i>v</i><sub><i>y</i></sub>/<i>c</i> =`);
  vyLabel.position(10,75);
  // vyLabel.html(`<i>v</i><sub><i>y</i></sub>/<i>c</i> =`);
 
  vzInput = createInput(0.0,'double');
  vzInput.position(50, 116);
  let vzLabel = createP(`<i>v</i><sub><i>z</i></sub>/<i>c</i> =`);
  vzLabel.position(10,100);
  // vzLabel.html(`<i>v</i><sub><i>z</i></sub>/<i>c</i> =`);

  errorLabel = createP();
  errorLabel.position(400,30);


  
      
    camera(0, 0, 0, 0, 0, -1, 0, 1, 0);
    noStroke();
  //geolocation
 
  
 perspective(9*PI/180, width/height, 0.0001,50000);
  //perspective(40*PI/180, width/height, 0.001,500);
  //device orientation
 
 
}

function draw() {
  //background(200); 
 //angleMode(DEGREES);
  betax=vxLabel.value();
  betay=vyLabel.value();
  betaz=vzLabel.value();

  let beta2 = betax*betax+betay*betay+betaz*betaz;
 if (beta2 >=1 ){
  const contentString = "Beta >= 1! Setting it to 0.99";
  errorText.html(contentString.fontcolor("red")); 
  beta = 0.99; 
 } else{
  beta=sqrt(beta2);
 }
  gamma=1/Math.sqrt(1-beta2);
  

  //transform to theta and phi
  if (beta===0){
    THETA1=0
    PH1=0;
  }else{
    THETA1=asin(-betay/beta);
   PHI1=PI+atan2(-betax,-betaz);
  }
    
    angleMode(RADIANS);


  theta=THETA1; 
  phi=PHI1;     
  
 
// distorted lookalike sphere
  rotateY(phi);
  rotateX(theta);
  scale(1/gamma, 1/gamma, 1);
  translate(0,0,radius*beta);
  rotateX(-theta);
  rotateY(-phi);
  theShader.setUniform('uTex', cam);
  resetShader();
  shader(theShader);
  sphere(radius,200);
console.log(theta,phi);
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
