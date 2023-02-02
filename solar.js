import * as THREE from './js/three.module.js'; 
 
export function solarSystem(scene, camera, renderer){
     const solarGroup = new THREE.Object3D();
     solarGroup.position.set(1500, 100, -1000);
     solarGroup.rotation.z = Math.PI / 8;
     scene.add(solarGroup);
     const textureLoader = new THREE.TextureLoader();

     const sunGeometry = new THREE.SphereGeometry(50, 30, 30);
     const sunMaterial = new THREE.MeshBasicMaterial({
          map:textureLoader.load('./assets/images/2k_sun.jpg'),
     }) 

     const sun = new THREE.Mesh(sunGeometry, sunMaterial);
     solarGroup.add(sun);
     sun.position.set(0, 0, 0);

     function createPlanet(size, texture, position, ring){
          const geometry = new THREE.SphereGeometry(size * 2, 30, 30);
          const material = new THREE.MeshPhongMaterial({
               map: textureLoader.load(texture),
          })
          const mesh = new THREE.Mesh(geometry, material);
          const obj = new THREE.Object3D();
          obj.add(mesh);
          if(ring){
               const ringGeometry = new THREE.RingGeometry(
                    ring.innerRadius,
                    ring.outerRadius,
                    32
               )
               const ringMaterial = new THREE.MeshBasicMaterial({
                    map: textureLoader.load(texture),
                    side: THREE.DoubleSide,
               })
               const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
               obj.add(ringMesh);
               ringMesh.position.x = position * 3;
               ringMesh.rotation.x = - Math.PI / 3;
          }
          sun.add(obj);
          mesh.position.x = position * 3;
          return{mesh, obj};     
     }

     const earthGeometry = new THREE.SphereGeometry(10, 30, 30);
     const earthMaterial = new THREE.MeshPhongMaterial({
          map:textureLoader.load('./assets/images/2k_earth_daymap.jpg'),
     })
     const earth = new THREE.Mesh(earthGeometry, earthMaterial);
     const earthObj = new THREE.Object3D();
     earthObj.add(earth);
     sun.add(earthObj);
     earth.castShadow = true;
     earth.position.x = 322;

     const moonGeometry = new THREE.SphereGeometry(3, 30, 30);
     const moonMaterial = new THREE.MeshPhongMaterial({
          map:textureLoader.load('./assets/images/2k_moon.jpg'),
     })
     const moon = new THREE.Mesh(moonGeometry, moonMaterial);
     const moonObj = new THREE.Object3D();
     moonObj.add(moon);
     earth.add(moonObj);
     moon.castShadow = true;
     moon.position.x = 50;

     // function createPlanet
     const mercury = createPlanet(3.2, './assets/images/2k_mercury.jpg', 40);
     const venus = createPlanet(6.4, './assets/images/2k_venus_surface.jpg', 78);
     const mars = createPlanet(5, './assets/images/2k_mars.jpg', 100);
     const jupiter = createPlanet(12, './assets/images/2k_jupiter.jpg', 125);
     const neptune = createPlanet(7.5, './assets/images/2k_neptune.jpg', 255);
     const pluto = createPlanet(2.8, './assets/images/2k_venus_atmosphere.jpg', 290);
     const saturn = createPlanet(11, './assets/images/2k_saturn.jpg', 220, {
          innerRadius: 34,
          outerRadius: 60,
          texture: './assets/images/2k_saturn_ring.jpg'
     });
     const uranus = createPlanet(7, './assets/images/2k_uranus.jpg', 186, {
          innerRadius: 25,
          outerRadius: 46,
          texture: './assets/images/2k_uranus.jpg' 
     })

     const pointLight = new THREE.PointLight(0xffffff, 2, 300);
     sun.add(pointLight);

     ///// Audios
const listener = new THREE.AudioListener(); 
camera.add(listener);
const solarSound = new THREE.PositionalAudio(listener);
const audioLoader = new THREE.AudioLoader();

     audioLoader.load('./assets/audios/audios_bulbwhale.mp3', function(buffer){
     solarSound.setBuffer(buffer);
     solarSound.setLoop(true);
     solarSound.setRefDistance(300);
     solarSound.setVolume(0.5);
     solarSound.play();
     sun.add(solarSound);
})


     function animate(){
     sun.rotateY(0.000284);
     earth.rotateY(0.048);
     moon.rotateY(0.0015);
     saturn.mesh.rotateY(0.038);
     mercury.mesh.rotateY(0.004);
     mars.mesh.rotateY(0.018);
     venus.mesh.rotateY(0.0002);
     pluto.mesh.rotateY(0.008);
     uranus.mesh.rotateY(0.003);
     neptune.mesh.rotateY(0.0124);
     jupiter.mesh.rotateY(0.004);
     
     moonObj.rotateY(0.0000016)
     earthObj.rotateY(0.001)
     mars.obj.rotateY(0.006)
     mercury.obj.rotateY(0.0084)
     venus.obj.rotateY(0.0015)
     saturn.obj.rotateY(0.0009)
     uranus.obj.rotateY(0.0004)
     pluto.obj.rotateY(0.00007)
     neptune.obj.rotateY(0.0001)
     venus.obj.rotateY(0.0026)
     jupiter.obj.rotateY(0.002)
     
     renderer.render(scene, camera);
     requestAnimationFrame(animate);
     }
     animate();    
}


