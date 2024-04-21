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
  far: 25.6,
};

const fog = new THREE.Fog("#001723", fogOpt.near, fogOpt.far);
scene.fog = fog;

// **  TEXTURES
const textureLoader = new THREE.TextureLoader();
// * Door textures
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
    roughness: 0.5,
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
    displacementScale: 1,
    roughness: 0.5,
    // color: "green",
  })
);
roof.material.normalScale.set(2, -1.3);

roof.position.set(0, 4.7, 0);
roof.scale.set(1.8, 0.8, 1.2);

// * Door
const doorGroup = new THREE.Group();
let doorWidth = 1.5;
const mainDoor = new THREE.Mesh(new THREE.PlaneGeometry(doorWidth, 1.5), new THREE.MeshStandardMaterial({ color: "#3D1908" }));
const topDoor = new THREE.Mesh(new THREE.CircleGeometry(doorWidth / 2), new THREE.MeshStandardMaterial({ color: "#3D1908" }));

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

// const stoneGrometry = new THREE.BoxGeometry(0.5, 0.8, 0.2);
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
  //reminder: 4 è lo spazio occupato dalla casa e il perimetro "safe" da lasciare senza rocce
  const radius = 4 + Math.random() * 6;
  //creo un cerchio per posizionare gli elementi in modo randomico dentro l'area (circolare) specificata (con angle e radius)
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const stone = new THREE.Mesh(stoneGrometry, stoneMaterial);

  stone.position.set(x, 0, z);
  scaleVal = (Math.random() - 0.2) * 1.8;
  stone.scale.set(scaleVal, scaleVal, scaleVal);
  stone.rotation.y = (Math.random() - 0.5) * 1;
  stone.rotation.z = (Math.random() - 0.5) * 1;

  stonesGroup.add(stone);
}

const stoneTweaks = gui.addFolder("Stone");
stoneTweaks.add(stoneMaterial.normalScale, "x").min(-4).max(4).step(0.01).name("normal scale");
stoneTweaks.add(stoneMaterial.normalScale, "y").min(-4).max(4).step(0.01).name("normal scale");
stoneTweaks.add(stoneMaterial, "displacementScale").min(0).max(1).step(0.001).name("Displacement Scale");
stoneTweaks.add(stoneMaterial, "roughness").min(0).max(1).step(0.001).name("roughness");

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

//end objects

// ** LIGHTS
// Ambient light
const ambientLight = new THREE.AmbientLight("#b6d5ff", 0.3);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.01);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b6d5ff", 2);
moonLight.position.set(4, 5, 3.5);
moonLight.intensity = 2.8;

// moonLight.castShadow = true;
// moonLight.shadow.mapSize.width = 1024;
// moonLight.shadow.mapSize.height = 1024;
// moonLight.shadow.radius = 5;
// moonLight.shadow.camera.near = 1;
// moonLight.shadow.camera.far = 100;

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
camera.position.x = 0;
camera.position.y = 0.56;
camera.position.z = 12;
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
moonLight.castShadow = true;

// ** Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

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
// const nearController = gui.add(fogOpt, "near").min(0).max(20).step(0.01).name("Near");
// const farController = gui.add(fogOpt, "far").min(0).max(30).step(0.01).name("Far");
// nearController.onChange(function (value) {
//   fog.near = value;
// });
// farController.onChange(function (value) {
//   fog.far = value;
// });

// * Walls
// const wallsTweaks = gui.addFolder("Walls");
// wallsTweaks.add(wallsMaterialOptions, "displacementScale").min(0).max(1).step(0.001).name("Displacement Scale");
// wallsTweaks.add(walls.material.normalScale, "x").min(-4).max(4).step(0.01).name("normal scale");
// wallsTweaks.add(walls.material.normalScale, "y").min(-4).max(4).step(0.01).name("normal scale");

// * MoonLight
// const moonLightTweaks = gui.addFolder("MoonLight");
// moonLightTweaks.add(moonLight, "intensity").min(0).max(3).step(0.01);
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
// const roofTweaks = gui.addFolder("Roof");
// roofTweaks.add(roof.position, "x").min(-5).max(5).step(0.01).name("pos x");
// roofTweaks.add(roof.position, "y").min(-5).max(5).step(0.01).name("pos y");
// roofTweaks.add(roof.position, "z").min(-5).max(5).step(0.01).name("pos z");
// roofTweaks.add(roof.scale, "x").min(-5).max(5).step(0.01).name("scale x");

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
