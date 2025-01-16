import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import GUI from "lil-gui";

// Debug
const gui = new GUI();
gui.hide();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Floor
 */
// const floor = new THREE.Mesh(
//   new THREE.PlaneGeometry(30, 30),
//   new THREE.MeshStandardMaterial({
//     color: "pink",
//     metalness: 0,
//     roughness: 0.5,
//   })
// );
// floor.receiveShadow = true;
// floor.rotation.x = -Math.PI * 0.5;
// floor.position.y = -0.5;
// scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("white", 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(0, 5, 3);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const resizeHandler = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

window.addEventListener("resize", resizeHandler);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 7, 51.8);
scene.add(camera);

// Controls;
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * GLTF Loader
 */
const gltfLoader = new GLTFLoader();

// Load City Model
let city = null;
gltfLoader.load("/models/cathedral/scene.gltf", (gltf) => {
  city = gltf.scene;
  city.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(city);
});

// load slayer
// let slayer = null;
// gltfLoader.load("/models/slayer/scene.gltf", (gltf) => {
//   slayer = gltf.scene;
//   slayer.traverse((child) => {
//     if (child.isMesh) {
//       child.castShadow = true;
//       child.receiveShadow = true;
//     }
//   });
//   // scale
//   slayer.position.set(0, 0, 0);
//   slayer.scale.set(4, 4, 4);
//   slayer.rotation.set(0, Math.PI, 0);

//   scene.add(slayer);
// });

gltfLoader.load("/models/santa.glb", (gltf) => {
  gltf.scene.scale.set(4, 4, 4);
  gltf.scene.position.set(0, 0, -22);
  gltf.scene.rotation.set(0, Math.PI, 0);
  scene.add(gltf.scene);
});

gltfLoader.load("/models/tomb.glb", (gltf) => {
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(0, 0, 19);
  scene.add(gltf.scene);
});

gltfLoader.load("/models/mourn.glb", (gltf) => {
  gltf.scene.scale.set(10,10,10);
  gltf.scene.position.set(0, 0, 22);
  scene.add(gltf.scene);
  console.log(gltf.scene);
});

const cameraFolder = gui.addFolder("Camera Controls");

const swiper = cameraFolder.addFolder("Swiper");
swiper.add(camera.position, "x").min(-10).max(1).step(0.1).name("X Axis");

const elevate = cameraFolder.addFolder("Elevate");
elevate.add(camera.position, "y").min(-10).max(30).step(0.1).name("Y Axis");

const zoomer = cameraFolder.addFolder("Zoomer");
zoomer.add(camera.position, "z").min(-10).max(51.8).step(0.1).name("Z Axis");

// Close folders by default
swiper.close();
elevate.close();
zoomer.close();


cameraFolder.open();
// scene.fog = new THREE.FogExp2("lightBlue", 0.02);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
