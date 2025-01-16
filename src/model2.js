import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { Timer } from "three/addons/misc/Timer.js";

import GUI from "lil-gui";

// Debug
const gui = new GUI();
// gui.hide();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const timer = new Timer();

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
camera.position.set(-8, 5, 15);
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

// // Load City Model
// let city = null;
// gltfLoader.load("/models/cathedral/scene.gltf", (gltf) => {
//   city = gltf.scene;
//   city.traverse((child) => {
//     if (child.isMesh) {
//       child.castShadow = true;
//       child.receiveShadow = true;
//     }
//   });
//   scene.add(city);
// });

let city = null;
gltfLoader.load("/models/church-two.glb", (gltf) => {
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
  gltf.scene.scale.set(1, 1, 1);
  gltf.scene.position.set(13, -0.5, -14);
  gltf.scene.rotation.set(0, Math.PI, 0);
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(gltf.scene);
});

gltfLoader.load("/models/monastery-garden/scene.gltf", (gltf) => {
  gltf.scene.scale.set(3, 3, 3);
  gltf.scene.position.set(13, -2, -12.5);
  gltf.scene.rotation.set(0, 0, 0);
  // shadow
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(gltf.scene);
});

gltfLoader.load("/models/tomb.glb", (gltf) => {
  gltf.scene.scale.set(0.2, 0.2, 0.2);
  gltf.scene.position.set(-11, -1, -5);
  gltf.scene.rotation.set(0, Math.PI / 2.4, 0);

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(gltf.scene);
});

gltfLoader.load("/models/mourn.glb", (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  // gltf.scene.position.set(0, 0, 22);
  gltf.scene.position.set(-10.5, -0.9, -7);

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(gltf.scene);
  console.log(gltf.scene);
});

const cameraFolder = gui.addFolder("Camera Controls");

const swiper = cameraFolder.addFolder("Swiper");
swiper.add(directionalLight.position, "x").min(-10).max(1).step(0.1).name("X Axis");

const elevate = cameraFolder.addFolder("Elevate");
elevate.add(directionalLight.position, "y").min(-10).max(30).step(0.1).name("Y Axis");

const zoomer = cameraFolder.addFolder("Zoomer");
zoomer.add(directionalLight.position, "z").min(-10).max(51.8).step(0.1).name("Z Axis");

// Close folders by default
swiper.close();
elevate.close();
zoomer.close();

cameraFolder.open();
// scene.fog = new THREE.FogExp2("lightBlue", 0.02);

// const rgbeLoader = new RGBELoader()

// rgbeLoader.load('./static/night.exr', (environmentMap) =>
//   {
//       environmentMap.mapping = THREE.EquirectangularReflectionMapping

//       scene.background = environmentMap
//       scene.environment = environmentMap
//   })

// Function to create a ghost soul geometry
function createGhostSoul(radius, particleCount) {
  const geometry = new THREE.BufferGeometry();

  // Create vertices for the ghostly shape
  const vertices = [];
  for (let i = 0; i < particleCount; i++) {
    // Randomize the position of particles within a spherical shape
    const theta = Math.random() * Math.PI * 2; // Random angle
    const phi = Math.acos(2 * Math.random() - 1); // Random inclination
    const r = radius * Math.random(); // Random distance from center

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    vertices.push(x, y, z);
  }

  // Convert vertices to Float32Array and set it as position attribute
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  return geometry;
}

// Function to generate a random hex color
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

// Create the ghost soul material with initial color
const ghostSoulMaterial = new THREE.PointsMaterial({
  color: 0x932ffb, // Initial color (light purple)
  size: 0.05, // Particle size
  transparent: true,
  opacity: 0.7, // Semi-transparent
  depthWrite: false, // Avoid writing to the depth buffer
  blending: THREE.AdditiveBlending, // Additive blending for a glowing effect
});

// Create the ghost soul geometry and points mesh
const ghostSoulGeometry = createGhostSoul(7, 250); // Radius 1.5, 500 particles
const ghostSoul = new THREE.Points(ghostSoulGeometry, ghostSoulMaterial);
ghostSoul.position.set(13, -0.5, -14); // Position near the cross
scene.add(ghostSoul);

// Function to animate the ghost soul
function animateGhostSoul() {
  const time = timer.getElapsed();

  // Make the ghost hover and pulse
  ghostSoul.position.y = 2 + Math.sin(time * 2) * 0.2; // Hover up and down
  ghostSoul.rotation.y += 0.01; // Slow rotation
}

// Function to update the color of the ghost soul every second
setInterval(() => {
  const newColor = getRandomHexColor(); // Get a new random hex color
  ghostSoulMaterial.color.set(newColor); // Update the ghost soul material's color
}, 1000); // Update every 1000 milliseconds (1 second)

const clock = new THREE.Clock();

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();
  timer.update();
  const elapsedTime = timer.getElapsed();
  animateGhostSoul();
  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
