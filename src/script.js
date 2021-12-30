import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'

import vertShader from "./shaders/vertShader.glsl"
import fragShader from "./shaders/fragShader.glsl"

import {loadScene} from "./glbLoader.js"

import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';


function main() {

// DISABLE RIGHT CLICK

document.addEventListener('contextmenu', event => event.preventDefault(),false);


// ROLL THE SCENE			

var scene = new THREE.Scene({ antialias: true });
// scene.background = new THREE.Color( 0x1c1c1c );
scene.background = new THREE.Color( 0xDAD3FF );
// scene.background = new THREE.Color( 0xB6B0D2 );



// CAMERA SETUP

var camera = new THREE.PerspectiveCamera( 39, window.innerWidth / window.innerHeight, 0.25, 2000 );
// camera.position.set(0.,0.,8.);
var originalPosition = new THREE.Vector3(0.,6.37,18.4);
var lookTarget = new THREE.Vector3(0.,4.843,0.);
// camera.position.set(0.,6.37,18.4);
camera.position.copy(originalPosition);
camera.lookAt(lookTarget);

var mouse = {x: 0.,y: 0}
var offsetScale = 4.;
var currOffset = new THREE.Vector3(0.,0.,0.);

document.addEventListener('mousemove', onDocumentMouseMove,false);
document.addEventListener('touchmove', onTouchMove,false);

function onDocumentMouseMove(event) {
    event.preventDefault();
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouse.x *= offsetScale;
    mouse.y *= offsetScale;
    // updateCamera();
} 

function onTouchMove(event){
    event.preventDefault();
    if(event.touches.length === 1.);
    mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    mouse.x *= offsetScale;
    mouse.y *= offsetScale;
    // updateCamera();
}

function updateCamera(){
  var currPos = new THREE.Vector3();
  var currOffset = new THREE.Vector3(mouse.x,mouse.y,0.);
  currPos.addVectors(originalPosition,currOffset);
  camera.position.copy(currPos);
  camera.lookAt(lookTarget);
}

function updateCameraDampened(){
  var currPos = new THREE.Vector3();
  var newOffset = new THREE.Vector3(mouse.x,mouse.y,0.);
  var directionOffset = new THREE.Vector3();
  directionOffset.subVectors(newOffset,currOffset);
  directionOffset.multiplyScalar(0.06);
  currOffset.add(directionOffset);
  currPos.addVectors(originalPosition,currOffset);
  camera.position.copy(currPos);
  camera.lookAt(lookTarget);
}


// RENDERER SETUP

var renderer = new THREE.WebGLRenderer({powerPreference: "high-performance",antialias: true});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMapping = THREE.LinearToneMapping;
// renderer.toneMapping = THREE.ReinhardToneMapping;
// renderer.toneMapping = THREE.CineonToneMapping;
// renderer.outputEncoding = THREE.sRGBEncoding;

const container = document.createElement( 'div' );
document.body.appendChild( container );
container.appendChild( renderer.domElement );

var canvas = renderer.domElement;

// canvas.onclick = function() {
//   // canvas.requestPointerLock();
//   if (canvas.requestFullscreen) {
//         canvas.requestFullscreen();
//       } else if (canvas.mozRequestFullScreen) { /* Firefox */
//         canvas.mozRequestFullScreen();
//       } else if (canvas.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
//         canvas.webkitRequestFullscreen();
//       } else if (canvas.msRequestFullscreen) { /* IE/Edge */
//         canvas.msRequestFullscreen();
//       }
// }

//ORBIT CONTROL

// const controls = new OrbitControls( camera, renderer.domElement );
// const controls = new TrackballControls( camera, renderer.domElement );
// controls.target = new THREE.Vector3(0.,4.843,0.);
// controls.update();
// controls.dynamicDampingFactor = 0.01;
// controls.rotateSpeed = 2.;
// controls.enableDamping = true;
// controls.dampingFactor = 0.05;
// controls.maxPolarAngle = Infinity;

// RESIZE

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    var width = window.innerWidth;
    var height = window.innerHeight;

    camera.aspect = width/height;
    camera.updateProjectionMatrix();

    renderer.setSize( width,height);
}

// LOAD OBJECTS

const manager = new THREE.LoadingManager();

const loader = new GLTFLoader(manager);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( './decoder/' );
dracoLoader.preload();
loader.setDRACOLoader( dracoLoader );

var objHolder = {mesh: null};
var meshHolder = {meshes: null};
// loadModel(loader,objHolder,scene,renderer);

loadScene(loader,objHolder,scene,renderer);



// RENDER LOOP
var iter = 0;

function render(time)
{   

    var t = time*0.001;
    // if(objHolder.mesh){
    //    objHolder.mesh.material.uniforms.iTime.value = t;
    // }
    // controls.update();
    updateCameraDampened();

    renderer.render(scene,camera);
    requestAnimationFrame ( render );
}

requestAnimationFrame ( render );

}

main();




