import {ShaderMaterial,MeshStandardMaterial, SmoothShading, PMREMGenerator, FloatType} from 'three'
import * as THREE from 'three'
import vertShader from "./shaders/vertShader.glsl"
import fragShader from "./shaders/fragShader.glsl"

import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';


function loadScene(loader,objHolder,scene, renderer){
	loader.load(
		"./glbs/compSmooth.glb",
		function(gltf){

				var blurTex = null;
				var exrTex = null;

				var TLTex = null;
				var TRTex = null;
				var BLTex = null;
				var BRTex = null;
				var CTex = null;
				var BallTex = null;
				var PlaneTex = null;

				function getCorresponingTex(mesh,textures){
					switch(mesh.name){
						case 'Plane':
							return textures[0];
						case 'Icosphere':
							return textures[1];
						case '7507-musee-rodin-hand':
							return textures[2];
						case "the-mighty-hand-at-the-musee-rodin-paris-4":
							return textures[3];
						case 'hand-of-adam-detail-1':
							return textures[4];
						case '7621-cap-hand-2':
							return textures[5];
						case 'hand-of-adam-detail-1001':
							return textures[6];
					}
				}

				const manager = new THREE.LoadingManager();
				manager.onLoad = function(){

						var textures = [PlaneTex,BallTex,CTex,BLTex,TRTex,BRTex,TLTex];

					    var meshes = [];

					    gltf.scene.traverse((obj) => {
					    	if(obj.isMesh){
					    		meshes.push(obj);
					    	}
					    });

					    meshes.forEach((e,i) => e.material = new THREE.MeshBasicMaterial({map: getCorresponingTex(e,textures)}));

					    scene.add(gltf.scene);
				}

				
				var texLoader = new THREE.TextureLoader(manager);

				var texFolder = "./diffShadows/";

				function loadTex(sourcePath,texVar){
					return texLoader.load( 
						texFolder + sourcePath,
						function ( texture ) {
							texture.minFilter = texture.magFilter = THREE.LinearFilter;
							// texture.encoding = THREE.sRGBEncoding;
							texture.flipY = false;
					    });
				}

				PlaneTex = loadTex("PEnv.png");
				BallTex = loadTex("ballEnv.png");
				CTex = loadTex("CEnv.png");
				BRTex = loadTex("BREnv.png");
				BLTex = loadTex("BLEnv.png");
				TRTex = loadTex("TREnv.png");
				TLTex = loadTex("TLEnv.png");
			
		}
	);

}






export {loadScene}