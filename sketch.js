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
let ff;
let ff2;
let ff3;
let ff4;
let errorText;

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

  ff = createP();
  ff.position(0,0);
  ff.html(`V1.24`);

  rvx = createInput(0.0,'double');
  rvx.position(50, 67);
  ff2 = createP();
  ff2.position(10,50);
  ff2.html(`Vx/c:`);
 
  rvy = createInput(0.0,'double');
  rvy.position(50, 90);
  ff3 = createP();
  ff3.position(10,75);
  ff3.html(`Vy/c:`);
 
  rvz = createInput(0.0,'double');
  rvz.position(50, 116);
  ff4 = createP();
  ff4.position(10,100);
  ff4.html(`Vz/c:`);

  errorText = createP();
  errorText.position(400,30);


  
      
    camera(0, 0, 0, 0, 0, -1, 0, 1, 0);
    noStroke();
  //geolocation
 
  
 perspective(9*PI/180, width/height, 0.0001,50000);
  //perspective(40*PI/180, width/height, 0.001,500);
  //device orientation
 
 
}

function draw() {
  //background(200); 
 angleMode(DEGREES);
  betax=rvx.value();
  betay=rvy.value();
  betaz=rvz.value();

  angleMode(RADIANS);
  //transform to theta and phi
  let r=sqrt(betax*betax+betay*betay+betaz*betaz);
  if (r===0){
    THETA1=0
    PH1=0;
  }else{
    THETA1=asin(-betay/r);
   PHI1=PI+atan2(-betax,-betaz);
  }
    
  

  theta=THETA1; 
  phi=PHI1;     
  
 let beta2 = rvx.value()*rvx.value()+rvy.value()*rvy.value()+rvz.value()*rvz.value();
 
 if (beta2 >=1 ){
  const contentString = "Beta is >= 1! normalising it to 0.99";
  errorText.html(contentString.fontcolor("red")); 
  
  beta = 0.99; 
 } else{
  beta=sqrt(beta2);
 }
  gamma=1/Math.sqrt(1-beta*beta);
  
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
