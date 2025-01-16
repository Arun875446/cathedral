import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import GUI from "lil-gui";

// Debug GUI
const gui = new GUI();
gui.hide(); // Hide by default for production

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(512, 512); // Reduced shadow map resolution
directionalLight.position.set(5, 10, 5);
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
camera.position.set(-10, 8, 26);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true, // Enable antialiasing for smoother edges
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * GLTF Loader
 */
const gltfLoader = new GLTFLoader();

// Load models
const loadModel = (url, position, scale, rotation) => {
  gltfLoader.load(url, (gltf) => {
    const model = gltf.scene;
    model.position.set(...position);
    model.scale.set(...scale);
    model.rotation.set(...rotation);

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(model);
  });
};

// Load assets
loadModel("/models/church-two.glb", [0, 0, 0], [1, 1, 1], [0, 0, 0]);
loadModel("/models/santa.glb", [13, -0.5, -14], [1, 1, 1], [0, Math.PI, 0]);
loadModel(
  "/models/monastery-garden/scene.gltf",
  [13, -2, -12.5],
  [3, 3, 3],
  [0, 0, 0]
);
loadModel(
  "/models/tomb.glb",
  [-11, -1, -5],
  [0.2, 0.2, 0.2],
  [0, Math.PI / 2.4, 0]
);
loadModel("/models/mourn.glb", [-10.5, -0.9, -7], [10, 10, 10], [0, 0, 0]);
loadModel("/models/iron_gate.glb", [-10.5, 1.5, 8], [0.7, 0.5, 0.5], [0, 0, 0]);
loadModel("/models/pumpkin.glb", [-11, 0.1, -5], [4, 4, 4], [0, 0, 0]);

const pointLight = new THREE.PointLight("orange", 5);
pointLight.position.set(-11, 0.1, -5);
scene.add(pointLight);
/**
 * Ghost Soul
 */
const createGhostSoul = (radius, particleCount) => {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.random();

    vertices.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
  }
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  return geometry;
};

const ghostSoulMaterial = new THREE.PointsMaterial({
  color: 0x932ffb,
  size: 0.05,
  transparent: true,
  opacity: 0.7,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const ghostSoul = new THREE.Points(createGhostSoul(7, 250), ghostSoulMaterial);
ghostSoul.position.set(13, -0.5, -14);
scene.add(ghostSoul);

// Animate ghost soul
const animateGhostSoul = (time) => {
  ghostSoul.position.y = 2 + Math.sin(time * 2) * 0.2;
  ghostSoul.rotation.y += 0.01;
};

setInterval(() => {
  ghostSoulMaterial.color.set(
    `#${Math.floor(Math.random() * 16777215).toString(16)}`
  );
}, 2000); // Less frequent updates for better performance

/**
 * Animation Loop
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  animateGhostSoul(elapsedTime);
  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
