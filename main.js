import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// ======================
// SCENE
// ======================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);


// ======================
// CAMERA
// ======================

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(2, 2, 4);


// ======================
// RENDERER
// ======================

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

document.body.appendChild(renderer.domElement);


// ======================
// CONTROLS
// ======================

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;


// ======================
// LIGHT
// ======================

const hemiLight = new THREE.HemisphereLight(
  0xffffff,
  0x444444,
  2
);

scene.add(hemiLight);


// ======================
// LOADERS
// ======================

const gltfLoader = new GLTFLoader();

const textureLoader = new THREE.TextureLoader();


// ======================
// MATERIALS ARRAY
// ======================

let materials = [];


// ======================
// LOAD MODEL
// ======================

gltfLoader.load('scene1.glb', (gltf) => {

  scene.add(gltf.scene);

  gltf.scene.traverse((child) => {

    if (child.isMesh) {

      materials.push(child.material);

      console.log(
        "Material Found:",
        child.material.name
      );
    }
  });

});


// ======================
// APPLY MATERIAL FUNCTION
// ======================

function applyMaterial(folder, extension) {

  const texture = textureLoader.load(

    `textures/${folder}/basecolor.${extension}`,

    () => {

      console.log(folder + " Loaded Successfully");

    },

    undefined,

    (error) => {

      console.error("Texture Load Error:", error);

    }

  );

  texture.wrapS = THREE.RepeatWrapping;

  texture.wrapT = THREE.RepeatWrapping;

  texture.repeat.set(4, 4);


  materials.forEach((mat) => {

    mat.map = texture;

    mat.needsUpdate = true;

  });

}


// ======================
// BUTTON 1
// ======================

document.getElementById("tile1").onclick = () => {

  applyMaterial("floortile", "jpg");

};


// ======================
// BUTTON 2
// ======================

document.getElementById("tile2").onclick = () => {

  applyMaterial("sidewall1", "png");

};


// ======================
// BUTTON 3
// ======================

document.getElementById("tile3").onclick = () => {

  applyMaterial("sidewall2", "jpg");

};


// ======================
// RESIZE
// ======================

window.addEventListener('resize', () => {

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

});


// ======================
// ANIMATION
// ======================

function animate() {

  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);

}

animate();