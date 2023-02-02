
import * as THREE from './js/three.module.js';
import {FlyControls} from './js/FlyControls.js';

import {solarSystem} from './solar.js';


///// Variables
let camera, scene, renderer;
let flyControls;
let greenPlanet;
let particles;
let instancedMesh, dummy;
let particlesCount = 5000;
let instancedMeshCount = 10000;
let clock = new THREE.Clock();
const matrix = new THREE.Matrix4();


init();
fly();
lights();
createGreenPlanet();
createParticles();
createInstances();
solarSystem(scene, camera, renderer);
renderer.setAnimationLoop(animate);


function init(){
     scene = new THREE.Scene();
     const cubeTextureLoader = new THREE.CubeTextureLoader();
     scene.background = cubeTextureLoader.load([
          './assets/images/space6.png',
          './assets/images/space5.png',
          './assets/images/space4.png',
          './assets/images/space1.png',
          './assets/images/space2.png',
          './assets/images/space3.png',
     ]); 

     camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          5000
     )
     camera.position.set(150, 10, 500);

     renderer = new THREE.WebGLRenderer({
          antialias: true,
          canvas: document.getElementById('canvas1')
     });
     renderer.shadowMap.enabled = true;
     renderer.setSize(window.innerWidth, window.innerHeight);
     document.body.appendChild(renderer.domElement);
};

function fly(){
     flyControls = new FlyControls(camera, renderer.domElement);
     flyControls.movementSpeed = 100;
     flyControls.rollSpeed = Math.PI / 6;
     flyControls.autoForward = false;
     flyControls.dragToLook = true;
};

function lights(){
     const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(150, 1500, 150);
scene.add(dirLight);
};

///// greenPlanet
function createGreenPlanet(){
     let textureLoader = new THREE.TextureLoader();
     const sphereGeometry = new THREE.SphereGeometry(30, 30, 30);
     const sphereMaterial = new THREE.MeshPhongMaterial({
          color: 0x04d9ff,     
          map: textureLoader.load('./assets/images/exoplanets_img1.jpg')
     })
     greenPlanet = new THREE.Mesh(sphereGeometry, sphereMaterial);
     greenPlanet.position.set(0,2,0);
     scene.add(greenPlanet);
     greenPlanet.castShadow = true;
     greenPlanet.receiveShadow = true;
};

function createParticles(){
     const particleGeometry = new THREE.BufferGeometry();
     const positions = new Float32Array(particlesCount * 3);
     for(let i = 0; i < particlesCount * 3; i++){
          positions[i] = (Math.random() - 0.5) * 1000;
     }
     particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
     const particleMaterial = new THREE.PointsMaterial();
     particleMaterial.size = 1;
     particleMaterial.sizeAttenuation = true;
     particles = new THREE.Points(particleGeometry, particleMaterial);
     scene.add(particles);
};

function createInstances(){     
     const geometry = new THREE.IcosahedronGeometry();
     const material  = new THREE.MeshPhongMaterial({
          color: 0xffea00,          
     })

     instancedMesh = new THREE.InstancedMesh(geometry, material, instancedMeshCount);
     instancedMesh.castShadow = true;
     instancedMesh.receiveShadow = true;
     scene.add(instancedMesh);

     dummy = new THREE.Object3D();
     for(let i = 0; i < instancedMeshCount; i++){
          dummy.position.x = (Math.random() * 250 - 150) + 50;
          dummy.position.y = (Math.random() * 100 - 50);
          dummy.position.z = (Math.random() * 250 - 150);

          dummy.rotation.x = Math.random() * Math.PI * 2;
          dummy.rotation.y = Math.random() * Math.PI * 2;
          dummy.rotation.z = Math.random() * Math.PI * 2;

          dummy.scale.x = dummy.scale.y = dummy.scale.z = Math.random();
          
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(i, dummy.matrix);
          instancedMesh.setColorAt(i, new THREE.Color(Math.random() * 0xffffff));
     }
};

// const orbit = new OrbitControls(camera, renderer.domElement);
// orbit.update();

// const gridHelper = new THREE.GridHelper(30);
// scene.add(gridHelper);

function animate(time){     
     const elapsedTime = clock.getElapsedTime();
     greenPlanet.rotation.y += 0.0005;
     flyControls.update(0.005);
     particles.rotation.y = elapsedTime * 0.0222;
     for(let i = 0; i < instancedMeshCount; i++){
          instancedMesh.getMatrixAt(i, matrix);
          matrix.decompose(dummy.position, dummy.rotation, dummy.scale);
          dummy.rotation.x = i/instancedMeshCount * time/1000;
          dummy.rotation.y = i/instancedMeshCount * time/500;
          dummy.rotation.z = i/instancedMeshCount * time/1200;

          dummy.updateMatrix();
          instancedMesh.setMatrixAt(i, dummy.matrix);
      } 
      instancedMesh.instanceMatrix.needsUpdate = true;
      instancedMesh.rotation.y  = time/50000;
     renderer.render(scene, camera);
};

window.addEventListener('resize', onWindowResize);
function onWindowResize(){
     renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
};
