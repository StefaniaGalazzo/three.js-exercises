import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/** Base **/
// Debug
const gui = new GUI();
gui.close();
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// ** Fog
let fogOpt = {
  near: 6.7,
  far: 24,
};

const fog = new THREE.Fog("#001723", fogOpt.near, fogOpt.far);
scene.fog = fog;

// **  TEXTURES
const textureLoader = new THREE.TextureLoader();
// * Door textures
const blowTexture = textureLoader.load("./textures/firefly/1.png");
const starTexture = textureLoader.load("./textures/firefly/5.png");

const barkColorTexture = textureLoader.load("./textures/bark/color.jpg");
const barkAmbientOcclusionTexture = textureLoader.load("./textures/bark/ambientOcclusion.jpg");
const barkNormalTexture = textureLoader.load("./textures/bark/normal.jpg");
const barkHeightTexture = textureLoader.load("./textures/bark/height.png");

barkColorTexture.colorSpace = THREE.SRGBColorSpace;

barkColorTexture.repeat.set(5, 3);
barkColorTexture.wrapS = THREE.RepeatWrapping;
barkColorTexture.wrapT = THREE.RepeatWrapping;

barkAmbientOcclusionTexture.repeat.set(5, 3);
barkAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
barkAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;

barkNormalTexture.repeat.set(5, 3);
barkNormalTexture.wrapS = THREE.RepeatWrapping;
barkNormalTexture.wrapT = THREE.RepeatWrapping;

// * Briks textures
// * Door textures
const grassColorTexture = textureLoader.load("./textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load("./textures/grass/ambientOcclusion.jpg");
const grassNormalTexture = textureLoader.load("./textures/grass/normal.jpg");

grassColorTexture.colorSpace = THREE.SRGBColorSpace;

grassColorTexture.repeat.set(8, 8);
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;

// * Foliage Textures
const foliageColorTexture = textureLoader.load("./textures/foliage/color.jpg");
const foliageAmbientOcclusionTexture = textureLoader.load("./textures/foliage/ambientOcclusion.jpg");
const foliageNormalTexture = textureLoader.load("./textures/foliage/normal.jpg");
const foliageHeightTexture = textureLoader.load("./textures/foliage/height.png");

foliageColorTexture.colorSpace = THREE.SRGBColorSpace;

foliageColorTexture.repeat.set(2, 1);
foliageColorTexture.wrapS = THREE.RepeatWrapping;
foliageColorTexture.wrapT = THREE.RepeatWrapping;

foliageAmbientOcclusionTexture.repeat.set(2, 1);
foliageAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
foliageAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;

foliageNormalTexture.repeat.set(2, 1);
foliageNormalTexture.wrapS = THREE.RepeatWrapping;
foliageNormalTexture.wrapT = THREE.RepeatWrapping;

foliageHeightTexture.repeat.set(2, 1);
foliageHeightTexture.wrapS = THREE.RepeatWrapping;
foliageHeightTexture.wrapT = THREE.RepeatWrapping;

// * Rocks Textures
const rocksColorTexture = textureLoader.load("./textures/rocks/color.jpg");
const rocksRoughnessTexture = textureLoader.load("./textures/rocks/roughness.jpg");
const rocksHeightTexture = textureLoader.load("./textures/rocks/height.png");

rocksColorTexture.colorSpace = THREE.SRGBColorSpace;
//
/** OBJECTS **/
// ** Stars
const particlesGeometry = new THREE.BufferGeometry();

const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.2;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.alphaMap = starTexture;
particlesMaterial.transparent = true;
// particlesMaterial.color = new THREE.Color("salmon");

particlesMaterial.alphaTest = 0.1;

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

const count = 5000;
const dotPositions = new Float32Array(count * 3);

// Riduci di 2 per lasciare uno spazio intorno al bordo
const maxRadius = Math.min(scene.position.x, scene.position.z) - 2;

for (let i = 0; i < count; i++) {
  // dotPositions[i] = (Math.random() - 0.5) * 50;
  const angle = 5 + Math.random() * Math.PI * 2;
  const radius = 20 + Math.random() * maxRadius;

  // Calcola le coordinate x e z dei punti attorno al cerchio
  const x = Math.sin(angle) * radius;
  const y = Math.random() * radius * 2;
  const z = Math.cos(angle) * radius;

  // Assegna le coordinate alla posizione del punto
  dotPositions[i * 3] = x;
  dotPositions[i * 3 + 1] = y;
  dotPositions[i * 3 + 2] = z;
}
// particles.position.z = -20;
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));

const particlesGroupweaks = gui.addFolder("particlesGroupweaks");
particlesGroupweaks.add(particles.position, "z").min(-35).max(35).step(0.01).name("pos z");

//
// ** Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({ map: grassColorTexture, aoMap: grassAmbientOcclusionTexture, normalMap: grassNormalTexture, roughness: 0.9, color: "#B0C26D" })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

// ** HOUSE **
// * Group
const houseGroup = new THREE.Group();
scene.add(houseGroup);

// * Walls
let height = 4;

// const wallsMaterialOptions = {
//   displacementScale: 0.2, // per la gui
// };

const walls = new THREE.Mesh(
  new THREE.CylinderGeometry(2.8, 2.8, height, 34),
  new THREE.MeshStandardMaterial({
    map: barkColorTexture,
    aoMap: barkAmbientOcclusionTexture,
    normalMap: barkNormalTexture,
    roughness: 0.5,
    color: "#FFB741",
  })
);
walls.material.normalScale.set(4, -1.7);

walls.position.y = height / 2;

// * Branches
// right branch
const branchRightGroup = new THREE.Group();

const branchRight = new THREE.Mesh(
  new THREE.CylinderGeometry(0.1, 0.3, 2, 13),
  new THREE.MeshStandardMaterial({
    map: barkColorTexture,
    aoMap: barkAmbientOcclusionTexture,
    normalMap: barkNormalTexture,
    displacementMap: barkHeightTexture,
    displacementScale: 0.28,
    roughness: 0.5,
    color: "#FFB741",
  })
);
branchRight.material.normalScale.set(3, -1.7);
branchRight.rotation.set(0, 0, -0.9);

const blushRight = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 85, 55),
  new THREE.MeshStandardMaterial({
    map: foliageColorTexture,
    aoMap: foliageAmbientOcclusionTexture,
    normalMap: foliageNormalTexture,
    displacementMap: foliageHeightTexture,
    displacementScale: 0.8,
    roughness: 0.45,
    // color: "green",
  })
);
blushRight.material.normalScale.set(2, -1.3);

blushRight.scale.set(1.2, 0.8, 1.2);
blushRight.position.set(1, 0.7, 0);

branchRightGroup.position.set(2.8, 2.2, 1);
branchRightGroup.add(branchRight, blushRight);

//left branch
const branchLeftGroup = new THREE.Group();
const branchLeft = new THREE.Mesh(
  new THREE.CylinderGeometry(0.001, 0.12, 1.8, 8),
  new THREE.MeshStandardMaterial({
    map: barkColorTexture,
    aoMap: barkAmbientOcclusionTexture,
    normalMap: barkNormalTexture,
    displacementMap: barkHeightTexture,
    displacementScale: 0.28,
    roughness: 0.5,
    color: "#FFB741",
  })
);
branchRight.material.normalScale.set(2, -1.3);
branchLeft.rotation.set(0, 0, 0.9);

const blushLeft = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 85, 55),
  new THREE.MeshStandardMaterial({
    map: foliageColorTexture,
    aoMap: foliageAmbientOcclusionTexture,
    normalMap: foliageNormalTexture,
    displacementMap: foliageHeightTexture,
    displacementScale: 0.4,
    roughness: 0.5,
    // color: "green",
  })
);
blushLeft.material.normalScale.set(2, -1.3);
blushLeft.position.set(-0.5, 0.5, 0);
blushLeft.scale.set(1.2, 0.8, 1.2);

branchLeftGroup.add(branchLeft, blushLeft);
branchLeftGroup.position.set(-2.8, 1.3, 1);

//
// * Roof
const roof = new THREE.Mesh(
  new THREE.SphereGeometry(3, 85, 55),
  new THREE.MeshStandardMaterial({
    map: foliageColorTexture,
    aoMap: foliageAmbientOcclusionTexture,
    normalMap: foliageNormalTexture,
    displacementMap: foliageHeightTexture,
    displacementScale: 0.9,
    roughness: 0.5,
    // color: "green",
  })
);
roof.material.normalScale.set(2, -1.3);

roof.position.set(0, 4.7, 0);
roof.scale.set(1.5, 0.75, 1.35);

// * Door
const doorGroup = new THREE.Group();
let doorWidth = 1.5;
const mainDoor = new THREE.Mesh(new THREE.PlaneGeometry(doorWidth, 1.5), new THREE.MeshStandardMaterial({ color: "black" }));
const topDoor = new THREE.Mesh(new THREE.CircleGeometry(doorWidth / 2), new THREE.MeshStandardMaterial({ color: "black" }));

mainDoor.position.set(0, 0.7, 2.8 + 0.01);
topDoor.position.set(0, 1.5, 2.8 + 0.01);

doorGroup.add(mainDoor, topDoor);

houseGroup.add(walls, branchRightGroup, branchLeftGroup, doorGroup, roof);

// ** STONES
let numOfStone = 40;
let scaleVal;
// Gruop
const stonesGroup = new THREE.Group();
scene.add(stonesGroup);

const stoneGrometry = new THREE.SphereGeometry(0.5, 80, 100);
const stoneMaterial = new THREE.MeshStandardMaterial({
  map: rocksColorTexture,
  normalMap: rocksHeightTexture,
  roughnessMap: rocksRoughnessTexture,
  displacementMap: rocksHeightTexture,
  displacementScale: 0.28,
  roughness: 0.47,
});
stoneMaterial.normalScale.set(-4, -0.82);

for (let i = 0; i < numOfStone; i++) {
  //creo un angolo e un radius per determinare l'area in cui collocare le pietre
  const angle = Math.random() * Math.PI * 2;
  //reminder: N + è lo spazio occupato dalla casa e il perimetro "safe" da lasciare senza rocce
  const radius = 5 + Math.random() * 6;
  //creo un cerchio per posizionare gli elementi in modo randomico dentro l'area (circolare) specificata (con angle e radius)
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const stone = new THREE.Mesh(stoneGrometry, stoneMaterial);

  stone.position.set(x, 0, z);

  scaleVal = (Math.random() - 0.2) * 1.5;
  stone.scale.set(scaleVal, scaleVal, scaleVal);
  stone.rotation.y = (Math.random() - 0.5) * 1;
  stone.rotation.z = (Math.random() - 0.5) * 1;

  stone.castShadow = true;
  stonesGroup.add(stone);
}

// const stoneTweaks = gui.addFolder("Stone");
// stoneTweaks.add(stoneMaterial.normalScale, "x").min(-4).max(4).step(0.01).name("normal scale");
// stoneTweaks.add(stoneMaterial.normalScale, "y").min(-4).max(4).step(0.01).name("normal scale");
// stoneTweaks.add(stoneMaterial, "displacementScale").min(0).max(1).step(0.001).name("Displacement Scale");
// stoneTweaks.add(stoneMaterial, "roughness").min(0).max(1).step(0.001).name("roughness");

// ** COLUMNS
const columnLeft = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.3, 4, 13),
  new THREE.MeshStandardMaterial({
    map: barkColorTexture,
    aoMap: barkAmbientOcclusionTexture,
    normalMap: barkNormalTexture,
    displacementMap: barkHeightTexture,
    displacementScale: 0.28,
    roughness: 0.5,
    color: "#FFB741",
  })
);
columnLeft.position.set(-0.98, 1.5, 2.74);

columnLeft.material.normalScale.set(3, -1.7);

const columnRight = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.3, 4, 13),
  new THREE.MeshStandardMaterial({
    map: barkColorTexture,
    aoMap: barkAmbientOcclusionTexture,
    normalMap: barkNormalTexture,
    displacementMap: barkHeightTexture,
    displacementScale: 0.28,
    roughness: 0.5,
    color: "#FFB741",
  })
);
columnRight.material.normalScale.set(3, -1.7);
columnRight.position.set(0.98, 1.5, 2.74);

houseGroup.add(columnLeft, columnRight);

// ** FIREFLY
const fireflyArray = [];

const positions = [
  { x: 0, y: 2, z: 4 },
  { x: 3.63, y: 1.07, z: 1.13 },
  { x: -3.65, y: 1.07, z: -1 },
];

function createFireflyGroup(position, numOfFireflies) {
  const fireflyGroup = new THREE.Group();

  for (let i = 0; i < numOfFireflies; i++) {
    const singleFireFly = new THREE.Group();
    const fireflyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 4), new THREE.MeshStandardMaterial({ alphaMap: blowTexture, transparent: true, emissive: 0xff0000, emissiveIntensity: 0.7 }));
    fireflyMesh.material.color = new THREE.Color("yellow");
    const fireflyLight = new THREE.PointLight("#F3AF15", 3.7, 0.92, 2.1);

    // posiziona i fireflies in modo casuale attorno alla posizione data
    const offsetX = Math.random() * 2 - 1;
    const offsetY = Math.random() * 2 - 1;
    const offsetZ = Math.random() * 2 - 1;

    fireflyMesh.position.set(offsetX, offsetY, offsetZ);
    fireflyLight.position.copy(fireflyMesh.position);

    singleFireFly.add(fireflyMesh, fireflyLight);
    fireflyGroup.add(singleFireFly);
  }

  fireflyGroup.position.set(position.x, position.y, position.z);
  fireflyArray.push(fireflyGroup);

  // const fireflyGroupweaks = gui.addFolder("fireflyGroup");
  // fireflyGroupweaks.add(fireflyGroup.position, "x").min(-5).max(5).step(0.01).name("pos x");
  // fireflyGroupweaks.add(fireflyGroup.position, "y").min(-5).max(5).step(0.01).name("pos y");
  // fireflyGroupweaks.add(fireflyGroup.position, "z").min(-5).max(5).step(0.01).name("pos z");
  return fireflyGroup;
}

const fireflyGroup1 = createFireflyGroup(positions[0], 5);
const fireflyGroup2 = createFireflyGroup(positions[1], 8);
const fireflyGroup3 = createFireflyGroup(positions[2], 8);

const updateFireflyGroups = (elapsedTime) => {
  fireflyArray.forEach((group) => {
    group.children.forEach((fireflyMesh, fireflyIndex) => {
      // il divisore regola la velocità del movimento
      const fireflyAngle = (elapsedTime * Math.PI * 2) / 6;
      // ampiezza del movimento
      const fireflyRadius = 0.2;

      const x = Math.sin(fireflyAngle + fireflyIndex) * fireflyRadius * (8 + Math.sin((elapsedTime / 6) * fireflyIndex));
      const y = Math.sin(elapsedTime) / 4;
      const z = Math.cos(fireflyAngle + fireflyIndex) * fireflyRadius * (5 + Math.cos((elapsedTime / 6) * fireflyIndex));
      fireflyMesh.position.set(x / 4, y / 4, z / 4);
    });
  });
};

scene.add(fireflyGroup1, fireflyGroup2, fireflyGroup3);

//end objects

// ** LIGHTS
// Ambient light
const ambientLight = new THREE.AmbientLight("#b6d5ff", 0.4);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.01);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b6d5ff", 2);
moonLight.position.set(1.93, 3.28, 2.91);
moonLight.intensity = 4;

// Point Light
const doorlight = new THREE.PointLight("#F3AF15", 2.92, 2.05, 2.17);
doorlight.position.set(0, 2.3, 2.82);

houseGroup.add(doorlight);

scene.add(moonLight);

// ** Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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
  renderer.setClearColor("#001723");
});

// ** Camera
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
scene.add(camera);

const cameraTweaks = gui.addFolder("Camera");
cameraTweaks.add(camera.position, "x").min(-5).max(5).step(0.01).name("pos x");
cameraTweaks.add(camera.position, "y").min(-5).max(5).step(0.01).name("pos y");
cameraTweaks.add(camera.position, "z").min(-5).max(5).step(0.01).name("pos z");

// ** Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// ** Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#001723");

// ** SHADOWS
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

floor.receiveShadow = true;

moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 456;
moonLight.shadow.mapSize.height = 456;
moonLight.shadow.camera.far = 25;
moonLight.shadow.radius = 15;

doorlight.castShadow = true;

doorlight.shadow.mapSize.width = 256;
doorlight.shadow.mapSize.height = 256;
doorlight.shadow.camera.far = 7;

walls.castShadow = true;
roof.castShadow = true;

//
// ** Animate
const clock = new THREE.Clock();

window.onload = () => tick();

// camera.position.x = 0;
// camera.position.y = 0.56;
// camera.position.z = 12;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  updateFireflyGroups(elapsedTime);
  camera.position.x = -4 + Math.sin((elapsedTime / 21) * Math.PI * 2) * 10;
  camera.position.z = 2 + Math.cos((elapsedTime / 21) * Math.PI * 2) * 12;
  camera.position.y = 1.2 + Math.sin((elapsedTime * Math.PI) / 4);

  camera.lookAt(houseGroup.position);
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

// ** Helpers
// *haxes
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// *directional lights
const directionalLightCameraHelper = new THREE.CameraHelper(moonLight.shadow.camera);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

// *door lights
const pointLightCameraHelper = new THREE.CameraHelper(doorlight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);

// GUI Controls
// * Fog
const nearController = gui.add(fogOpt, "near").min(0).max(20).step(0.01).name("Near");
const farController = gui.add(fogOpt, "far").min(0).max(30).step(0.01).name("Far");
nearController.onChange(function (value) {
  fog.near = value;
});
farController.onChange(function (value) {
  fog.far = value;
});

// * Walls
// const wallsTweaks = gui.addFolder("Walls");
// wallsTweaks.add(wallsMaterialOptions, "displacementScale").min(0).max(1).step(0.001).name("Displacement Scale");
// wallsTweaks.add(walls.material.normalScale, "x").min(-4).max(4).step(0.01).name("normal scale");
// wallsTweaks.add(walls.material.normalScale, "y").min(-4).max(4).step(0.01).name("normal scale");

// * MoonLight
// const moonLightTweaks = gui.addFolder("MoonLight");
// moonLightTweaks.add(moonLight, "intensity").min(0).max(5).step(0.01);
// moonLightTweaks.add(moonLight.position, "x").min(-5).max(5).step(0.01).name("pos x");
// moonLightTweaks.add(moonLight.position, "y").min(-5).max(5).step(0.01).name("pos y");
// moonLightTweaks.add(moonLight.position, "z").min(-5).max(5).step(0.01).name("pos z");
// moonLightTweaks.add(moonLight.rotation, "x").min(-5).max(5).step(0.01).name("rot x");
// moonLightTweaks.add(moonLight.rotation, "y").min(-5).max(5).step(0.01).name("rot y");
// moonLightTweaks.add(moonLight.rotation, "z").min(-5).max(5).step(0.01).name("rot z");

// * ColumnLeft
// const columnLeftTweaks = gui.addFolder("ColumnLeft");
// columnLeftTweaks.add(columnLeft.position, "x").min(-5).max(5).step(0.01).name("pos x");
// columnLeftTweaks.add(columnLeft.position, "y").min(-5).max(5).step(0.01).name("pos y");
// columnLeftTweaks.add(columnLeft.position, "z").min(-5).max(5).step(0.01).name("pos z");

// * ColumnRight
// const columnRightTweaks = gui.addFolder("ColumnRight");
// columnRightTweaks.add(columnRight.position, "x").min(-5).max(5).step(0.01).name("pos x");
// columnRightTweaks.add(columnRight.position, "y").min(-5).max(5).step(0.01).name("pos y");
// columnRightTweaks.add(columnRight.position, "z").min(-5).max(5).step(0.01).name("pos z");

// * BranchLeft
// const branchLeftTweaks = gui.addFolder("BranchLeft");
// branchLeftTweaks.add(blushLeft.position, "x").min(-5).max(5).step(0.01).name("blush pos x");
// branchLeftTweaks.add(blushLeft.position, "y").min(-5).max(5).step(0.01).name("blush pos y");
// branchLeftTweaks.add(blushLeft.position, "z").min(-5).max(5).step(0.01).name("blush pos z");
// branchLeftTweaks.add(branchLeftGroup.position, "x").min(-5).max(5).step(0.01).name("pos x");
// branchLeftTweaks.add(branchLeftGroup.position, "y").min(-5).max(5).step(0.01).name("pos y");
// branchLeftTweaks.add(branchLeftGroup.position, "z").min(-5).max(5).step(0.01).name("pos z");
// branchLeftTweaks.add(branchLeftGroup.rotation, "x").min(-5).max(5).step(0.01).name("rot x");
// branchLeftTweaks.add(branchLeftGroup.rotation, "y").min(-5).max(5).step(0.01).name("rot y");
// branchLeftTweaks.add(branchLeftGroup.rotation, "z").min(-5).max(5).step(0.01).name("rot z");

// *  BranchRight
// const branchRightTweaks = gui.addFolder("BranchRight");
// branchRightTweaks.add(blushRight.position, "x").min(-5).max(5).step(0.01).name("pos x");
// branchRightTweaks.add(blushRight.position, "y").min(-5).max(5).step(0.01).name("pos y");
// branchRightTweaks.add(blushRight.position, "z").min(-5).max(5).step(0.01).name("pos z");
// branchRightTweaks.add(branchRight.rotation, "x").min(-5).max(5).step(0.01).name("rot x");
// branchRightTweaks.add(branchRight.rotation, "y").min(-5).max(5).step(0.01).name("rot y");
// branchRightTweaks.add(branchRight.rotation, "z").min(-5).max(5).step(0.01).name("rot z");

// * Roof
const roofTweaks = gui.addFolder("Roof");
roofTweaks.add(roof.position, "x").min(-5).max(5).step(0.01).name("pos x");
roofTweaks.add(roof.position, "y").min(-5).max(5).step(0.01).name("pos y");
roofTweaks.add(roof.material, "roughness").min(-5).max(5).step(0.01).name("roughness");
roofTweaks.add(roof.material, "displacementScale").min(0).max(1).step(0.001).name("Displacement Scale");
roofTweaks.add(roof.scale, "x").min(-5).max(5).step(0.01).name("scale x");
roofTweaks.add(roof.scale, "y").min(-5).max(5).step(0.01).name("scale y");
roofTweaks.add(roof.scale, "z").min(-5).max(5).step(0.01).name("scale z");

// * Door
// const doorTweaks = gui.addFolder("Door");
// doorTweaks.add(door.position, "x").min(-5).max(5).step(0.01).name("pos x");
// doorTweaks.add(door.position, "y").min(-5).max(5).step(0.01).name("pos y");
// doorTweaks.add(door.position, "z").min(-5).max(5).step(0.01).name("pos z");

// * DoorLight
// const doorlightTweaks = gui.addFolder("Doorlight");
// doorlightTweaks.add(doorlight, "intensity").min(0).max(5).step(0.01);
// doorlightTweaks.add(doorlight, "distance").min(0).max(5).step(0.01);
// doorlightTweaks.add(doorlight, "decay").min(0).max(5).step(0.01);
// doorlightTweaks.add(doorlight.position, "x").min(-5).max(5).step(0.01).name("pos x");
// doorlightTweaks.add(doorlight.position, "y").min(-5).max(5).step(0.01).name("pos y");
// doorlightTweaks.add(doorlight.position, "z").min(-5).max(5).step(0.01).name("pos z");

// * FireFlies
// const fireFly1Tweaks = gui.addFolder("FireFly1");
// fireFly1Tweaks.add(fireFly1.position, "x").min(-15).max(15).step(0.01).name("pos x");
// fireFly1Tweaks.add(fireFly1.position, "y").min(-15).max(15).step(0.01).name("pos y");
// fireFly1Tweaks.add(fireFly1.position, "z").min(-15).max(15).step(0.01).name("pos z");
// fireFly1Tweaks.add(firefly1mesh.material, "roughness").min(0).max(1).step(0.01);
// fireFly1Tweaks.add(firefly1mesh.material, "metalness").min(0).max(1).step(0.01);
// fireFly1Tweaks.add(firefly1mesh.material, "emissiveIntensity").min(0).max(1).step(0.01);
// fireFly1Tweaks.add(firefly1meshLight, "intensity").min(0).max(10).step(0.01);
// fireFly1Tweaks.add(firefly1meshLight, "distance").min(0).max(8).step(0.01);
// fireFly1Tweaks.add(firefly1meshLight, "decay").min(0).max(8).step(0.01);
// fireFly1Tweaks.add(firefly1meshLight, "distance").min(0).max(8).step(0.01);
// fireFly1Tweaks.add(firefly1meshLight.position, "x").min(0).max(8).step(0.001).name("fly light pos x");
// fireFly1Tweaks.add(firefly1meshLight.position, "y").min(0).max(8).step(0.001).name("fly light pos y");
// fireFly1Tweaks.add(firefly1meshLight.position, "z").min(0).max(8).step(0.001).name("fly light pos z");
