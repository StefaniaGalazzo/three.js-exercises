import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Cursor
const cursor = {
  x: 0,
  y: 0,
};

// ** Canvas
const canvas = document.querySelector("canvas.webgl");

// **Debug
const gui = new GUI({
  closeFolders: true,
});

// **Scene
const scene = new THREE.Scene();

// **Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Textures
const textureLoader = new THREE.TextureLoader();
const desertColorTexture = textureLoader.load("./textures/desert/color-2.jpg");
// const desertAlphaTexture = textureLoader.load("./textures/desert/alpha.png");
const desertAmbientOcclusionTexture = textureLoader.load(
  "./textures/desert/ambientocclusion-2.jpg"
);
const desertHeightTexture = textureLoader.load(
  "./textures/desert/height-3.png"
);
const desertNormalTexture = textureLoader.load(
  "./textures/desert/normal-2.jpg"
);
const desertRoughnessTexture = textureLoader.load(
  "./textures/desert/normal-2.jpg"
);
// const desertMatCapTexture = textureLoader.load("./textures/matcaps/1.png");
// const desertGradientTexture = textureLoader.load("./textures/gradients/3.jpg");
desertColorTexture.colorSpace = THREE.SRGBColorSpace;

desertColorTexture.repeat.x = 6;
desertColorTexture.repeat.y = 6;
desertColorTexture.wrapS = THREE.MirroredRepeatWrapping;
desertColorTexture.wrapT = THREE.MirroredRepeatWrapping;

//** Environment map
// const rgbeLoader = new RGBELoader();
// rgbeLoader.load("/textures/environmentMap/goegap_4k.hdr", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;

//   scene.background = new THREE.Color("#149EFA");
//   scene.environment = environmentMap;
// });

//
//** Objects
// sphere material
const sphereMaterial = new THREE.MeshPhysicalMaterial();

// *sphereMaterial.metalness = 0.05;
sphereMaterial.roughness = 0.2;

sphereMaterial.iridescence = 0.79;
sphereMaterial.iridescenceIOR = 1.94;
sphereMaterial.iridescenceThicknessRange = [492, 403];

sphereMaterial.transmission = 0.98;
sphereMaterial.ior = 4;
sphereMaterial.thickness = 0.02;

// *sphere object
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 80, 80),
  sphereMaterial
);
sphere.castShadow = true;

// *sphere gui
const sphereTweaks = gui.addFolder("Sphere");
sphereTweaks.add(sphere.position, "y").min(-2).max(2).step(0.01);
sphereTweaks.add(sphereMaterial, "metalness").min(0).max(1).step(0.001);
sphereTweaks.add(sphereMaterial, "roughness").min(0).max(1).step(0.001);
sphereTweaks.add(sphereMaterial, "opacity").min(0).max(3).step(0.01);
sphereTweaks.add(sphereMaterial, "iridescence").min(0).max(1).step(0.001);
sphereTweaks
  .add(sphereMaterial, "iridescenceIOR")
  .min(1)
  .max(2.333)
  .step(0.0001);
sphereTweaks
  .add(sphereMaterial.iridescenceThicknessRange, "0")
  .min(1)
  .max(1000)
  .step(1);
sphereTweaks
  .add(sphereMaterial.iridescenceThicknessRange, "1")
  .min(1)
  .max(1000)
  .step(1);
sphereTweaks.add(sphereMaterial, "transmission").min(0).max(1).step(0.0001);
sphereTweaks.add(sphereMaterial, "ior").min(1).max(10).step(0.0001);
sphereTweaks.add(sphereMaterial, "thickness").min(0).max(1).step(0.0001);

// *bubbles
const bubbles = [];
const numOfBubs = 8;
const groupWhitSphere = new THREE.Group();
scene.add(groupWhitSphere);

createBubble(numOfBubs, 0.005, 0.065, [0, 0.3, 0.18], [0.4, 0.4, 0.4]);
createBubble(numOfBubs, 0.01, 0.08, [0.1, 0.48, -0.12], [0.2, 2, 0.2]);
createBubble(numOfBubs, 0.008, 0.01, [0.18, 0.33, -0.13], [0.4, 0.4, 0.4]);
createBubble(numOfBubs, 0.01, 0.05, [-0.27, 0.33, -0.1], [0.5, 0.2, 0.5]);
createBubble(numOfBubs, 0.03, 0.05, [-0.24, 0.38, -0.07], [0.2, 0.2, 0.5]);
createBubble(numOfBubs, 0.01, 0.03, [0.03, 0.2, 0.23], [0.4, 0.4, 0.4]);

createBubble(numOfBubs, 0.005, 0.02, [0.03, 0.2, 0.4], [0, 0, 0]);
createBubble(numOfBubs, 0.002, 0.02, [0.47, 0.43, 0.43], [0, 0, 0]);
createBubble(numOfBubs, 0.002, 0.02, [-0.3, 0.43, -0.3], [0, 0, 0]);

function createBubble(
  items,
  radiusMin,
  radiusMax,
  groupPositions,
  rangePositioning
) {
  const group = new THREE.Group();
  const bubbleGeometry = new THREE.SphereGeometry(radiusMax, 32, 32);

  for (let i = 0; i < items; i++) {
    const bubble = new THREE.Mesh(bubbleGeometry, sphereMaterial);
    bubbles.push(bubble);

    // valore casuale del raggio nel range specificato per ottenere il calcolo della ratio (evitando le deformazioni sugli assi)
    const radius = radiusMin + Math.random() * (radiusMax - radiusMin);
    const scaleRatio = radius / radiusMax;
    // scala casuale per ogni asse (x, y, z) - valori tra 0.5 e 1.0
    const randomScale = Math.random() * 0.5 + 0.5;

    bubble.scale.set(
      scaleRatio * randomScale,
      scaleRatio * randomScale,
      scaleRatio * randomScale
    );

    bubble.position.set(
      (Math.random() - 0.5) / rangePositioning[0],
      (Math.random() - 0.5) / rangePositioning[1],
      (Math.random() - 0.5) / rangePositioning[2]
    );
    bubble.castShadow = true;
    group.position.set(groupPositions[0], groupPositions[1], groupPositions[2]);
    group.add(bubble);
  }

  groupWhitSphere.add(sphere, group);
  groupWhitSphere.position.x = 0;
  groupWhitSphere.position.z = -0.45;
  groupWhitSphere.position.y = -0.45;
  const GWSscale = 1.5;
  groupWhitSphere.scale.set(GWSscale, GWSscale, GWSscale);

  const groupWhitSphereTweaks = gui.addFolder("groupWhitSphere group");
  groupWhitSphereTweaks
    .add(groupWhitSphere.position, "x")
    .min(-2)
    .max(2)
    .step(0.01);
  scene.add(groupWhitSphere);
  groupWhitSphereTweaks
    .add(groupWhitSphere.position, "z")
    .min(-2)
    .max(2)
    .step(0.01);
  const bubbleGruopTweaks = gui.addFolder("Bubble group");
  bubbleGruopTweaks.add(group.position, "x").min(-2).max(2).step(0.01);
  bubbleGruopTweaks.add(group.position, "y").min(-2).max(2).step(0.01);
  bubbleGruopTweaks.add(group.position, "z").min(-2).max(2).step(0.01);
}
// end bubbles

// *plane material
const planeMaterial = new THREE.MeshStandardMaterial();
planeMaterial.map = desertColorTexture;
// planeMaterial.side = THREE.DoubleSide;
planeMaterial.roughness = 0.94;
planeMaterial.metalness = 0.72;
planeMaterial.displacementMap = desertHeightTexture;
planeMaterial.displacementScale = 0.5;

planeMaterial.normalMap = desertNormalTexture;
planeMaterial.normalScale.set(0.56, -1.8);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 150, 150),
  planeMaterial
);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.24;

const planeTweaks = gui.addFolder("Plane");
planeTweaks.add(planeMaterial, "metalness").min(0).max(1).step(0.0001);
planeTweaks.add(planeMaterial, "roughness").min(0).max(1).step(0.0001);
planeTweaks.add(planeMaterial, "displacementScale").min(0).max(5).step(0.01);
// planeTweaks.add(planeMaterial, "aoMapIntensity").min(0).max(5).step(0.01);
planeTweaks.add(plane.position, "y").min(-2).max(2).step(0.01);
planeTweaks.add(plane.rotation, "x").min(-2).max(2).step(0.01);
planeTweaks
  .add(planeMaterial.normalScale, "x")
  .min(-4)
  .max(4)
  .step(0.01)
  .name("normal scale");
planeTweaks
  .add(planeMaterial.normalScale, "y")
  .min(-4)
  .max(4)
  .step(0.01)
  .name("normal scale");

scene.add(plane);

// **Models
const groupWhitePlane = new THREE.Group();
groupWhitePlane.add(plane);
groupWhitePlane.position.y = -0.5;
const gltfLoader1 = new GLTFLoader();
gltfLoader1.load(
  "/models/Barrel-cactus.glb",
  (gltf) => {
    const cactusData = [
      {
        position: { x: 0.9, y: -0.25, z: -0.08 },
        rotation: { x: 0, y: 0.5, z: 0 },
        scale: 0.03,
      },
      {
        position: { x: -0.62, y: -0.25, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.02,
      },
      {
        position: { x: -0.8, y: -0.25, z: -1.5 },
        rotation: { x: 0.03, y: 0, z: -0.2 },
        scale: 0.018,
      },
    ];
    cactusData.forEach((item) => {
      // istanza del modello del cactus
      const cactus = gltf.scene.clone();
      cactus.position.set(item.position.x, item.position.y, item.position.z);
      cactus.scale.set(item.scale, item.scale, item.scale);
      cactus.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
      cactus.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      const cactusTweaks = gui.addFolder("Cactus");
      cactusTweaks
        .add(cactus.position, "x")
        .min(-1)
        .max(1)
        .step(0.01)
        .name("position x");
      cactusTweaks
        .add(cactus.position, "y")
        .min(-1)
        .max(1)
        .step(0.01)
        .name("position y");
      cactusTweaks
        .add(cactus.position, "z")
        .min(-1)
        .max(1)
        .step(0.01)
        .name("position z");

      cactusTweaks
        .add(cactus.scale, "x")
        .min(0)
        .max(1)
        .step(0.01)
        .name("scale x");
      cactusTweaks
        .add(cactus.scale, "y")
        .min(0)
        .max(1)
        .step(0.01)
        .name("scale y");
      cactusTweaks
        .add(cactus.scale, "z")
        .min(0)
        .max(1)
        .step(0.01)
        .name("scale z");

      cactusTweaks
        .add(cactus.rotation, "x")
        .min(-3)
        .max(3)
        .step(0.01)
        .name("rotation x");
      cactusTweaks
        .add(cactus.rotation, "y")
        .min(-3)
        .max(3)
        .step(0.01)
        .name("rotation y");
      cactusTweaks
        .add(cactus.rotation, "z")
        .min(-3)
        .max(3)
        .step(0.01)
        .name("rotation z");
      groupWhitePlane.add(cactus);
    });
    scene.add(groupWhitePlane);
  },
  undefined,
  (error) => {
    console.error("Error loading GLB model", error);
  }
);

const gltfLoader2 = new GLTFLoader();
gltfLoader2.load(
  "/models/Pipe-cactus.glb",
  (gltf) => {
    const cactusData = [
      {
        position: { x: 1.22, y: -0.25, z: -0.27 },
        rotation: { x: 0, y: 0.9, z: 0 },
        scale: 0.2,
      },
      {
        position: { x: -1, y: -0.25, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.23,
      },
      {
        position: { x: 0, y: -0.17, z: -1.68 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.25,
      },
    ];
    cactusData.forEach((item) => {
      // istanza del modello del cactus
      const cactus = gltf.scene.clone();
      cactus.position.set(item.position.x, item.position.y, item.position.z);
      cactus.scale.set(item.scale, item.scale, item.scale);
      cactus.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
      cactus.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      const cactusTweaks = gui.addFolder("Pipe Cactus");
      cactusTweaks
        .add(cactus.position, "x")
        .min(-3)
        .max(3)
        .step(0.01)
        .name("position x");
      cactusTweaks
        .add(cactus.position, "y")
        .min(-3)
        .max(3)
        .step(0.01)
        .name("position y");
      cactusTweaks
        .add(cactus.position, "z")
        .min(-3)
        .max(3)
        .step(0.01)
        .name("position z");

      cactusTweaks
        .add(cactus.scale, "x")
        .min(0)
        .max(1)
        .step(0.01)
        .name("scale x");
      cactusTweaks
        .add(cactus.scale, "y")
        .min(0)
        .max(1)
        .step(0.01)
        .name("scale y");
      cactusTweaks
        .add(cactus.scale, "z")
        .min(0)
        .max(1)
        .step(0.01)
        .name("scale z");

      cactusTweaks
        .add(cactus.rotation, "x")
        .min(-3)
        .max(3)
        .step(0.01)
        .name("rotation x");
      cactusTweaks
        .add(cactus.rotation, "y")
        .min(-3)
        .max(3)
        .step(0.01)
        .name("rotation y");
      cactusTweaks
        .add(cactus.rotation, "z")
        .min(-3)
        .max(3)
        .step(0.01)
        .name("rotation z");
      groupWhitePlane.add(cactus);
    });
    scene.add(cactus);
  },
  undefined,
  (error) => {
    console.error("Error loading GLB model", error);
  }
);
//

// **Lights
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
const ambientlLightTweaks = gui.addFolder("Ambient Light");
ambientlLightTweaks.add(ambientLight, "intensity").min(0).max(8).step(0.001);
scene.add(ambientLight);

// Directional
const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(2, 5, 2.66);
directionalLight.intensity = 2.8;
directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

directionalLight.shadow.radius = 5;

directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 13;

directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
// directionalLightCameraHelper.visible = false;

scene.add(directionalLight, ambientLight, directionalLightCameraHelper);

const directionalLightTweaks = gui.addFolder("DirectionalLight");
directionalLightTweaks
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001);
directionalLightTweaks
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001);
directionalLightTweaks
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001);
directionalLightTweaks
  .add(directionalLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001);

// **Camera
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.y = 0.35;
camera.position.x = 0;
camera.position.z = 1.5;

scene.add(camera);

const cameraTweaks = gui.addFolder("Camera");
cameraTweaks.add(camera.position, "x").min(-2).max(2).step(0.01);
cameraTweaks.add(camera.position, "y").min(-2).max(2).step(0.01);
cameraTweaks.add(camera.position, "z").min(-2).max(6).step(0.01);

// **Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// **Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// **Animate
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //UPD CAMERA
  // camera.position.x = cursor.x * 1.5;
  // camera.position.y = 0.7 + cursor.y;
  // camera.position.x = Math.sin(cursor.x * Math.PI) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  camera.lookAt(sphere.position);

  // Animate bubbles
  groupWhitSphere.rotation.y = elapsedTime / 6;

  const amplitudeX = 0.05;
  const amplitudeY = 0.03;

  const x = Math.sin(elapsedTime) * amplitudeX;
  const y = 0.35 + Math.cos(elapsedTime) * amplitudeY;

  sphere.position.x = x;
  sphere.position.y = y;

  // oscillazione bolle
  bubbles.forEach((bubble, index) => {
    const offset = index * 0.5;
    const bubbleTime = elapsedTime + offset;
    const bubbleAmplitudeX = Math.cos(bubbleTime * 0.21) * 0.1;
    const bubbleAmplitudeY = Math.sin(bubbleTime * 0.8) * 0.1;
    const bubbleAmplitudeZ = Math.cos(bubbleTime * 0.13) * 0.1;
    const bubbleX = bubbleAmplitudeX;
    const bubbleY = bubbleAmplitudeY;
    const bubbleZ = bubbleAmplitudeZ;
    bubble.position.x = bubbleX * 0.38;
    bubble.position.y = bubbleY * 0.21;
    bubble.position.z = bubbleZ * 0.12;
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// Helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// move on mouse
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});
