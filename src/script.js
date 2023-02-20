import * as THREE from 'three';
import {Color, Scene} from 'three';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler';
import { BufferGeometryUtils } from 'three';

// const gui = new dat.gui()

// Create an empty scene, needed for the renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//cam
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 1, 2);
//OrbitControls
const orbit = new OrbitControls(camera, renderer.domElement);

// Create a sphere with basic geometry & material
const geometry = new THREE.SphereGeometry(6, 15, 15);
const material = new THREE.MeshBasicMaterial({
  color: 0x66ccff,
  wireframe: true
});
const sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);

const sampler = new MeshSurfaceSampler(sphere).build();
const sphereGeometry = new THREE.SphereGeometry(0.05, 6, 6);
var sphereMaterial = new THREE.MeshBasicMaterial({
 color: 0xffa0e6
});
const spheres = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, 3000);
scene.add(spheres);	

//load 3d model
const url = 'model.glb'
const modelContainer = new THREE.Group();
scene.add(modelContainer);
const loader = new GLTFLoader();
loader.load(url, (gltf) => {
    modelContainer.add(gltf.scene);
    modelContainer.traverse((o) =>{
        if (o.isMesh) o.material = material
    })
    },
    undefined,
    console.error
);

const sampler2 = new MeshSurfaceSampler(sphere).build();
var sphereMaterial = new THREE.MeshBasicMaterial({
 color: 0xffa0e6
});
const modelp = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, 3000);
scene.add(modelp);


const light = new THREE.AmbientLight(0xffffff, 1 );
scene.add (light);


const tempPosition = new THREE.Vector3();
const tempObject = new THREE.Object3D();
for (let i = 0; i < 3000; i++) {
  sampler.sample(tempPosition);
  tempObject.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
  tempObject.scale.setScalar(Math.random() * 0.5 + 0.5);
  tempObject.updateMatrix();
  spheres.setMatrixAt(i, tempObject.matrix);
}	
console.log('i')


/// Render the scene on each frame
function render () {  
  // Rotate the sphere a little on each frame
  // sphere.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(render);